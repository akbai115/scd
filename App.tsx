
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { FabricPlane } from './components/FabricPlane';
import { AudioEngine } from './components/AudioEngine';
import { Sovereignty } from './components/Sovereignty';
import { Admin } from './components/Admin';
import { TransmissionOverlay } from './components/TransmissionOverlay';
import { Vlinkjn } from './components/Vlinkjn';
import { ArkLogo } from './components/ArkLogo';
import { PasswordGate } from './components/PasswordGate';
import { LoadingScreen } from './components/LoadingScreen';
import { FileManager } from './components/FileManager';
import { supabase } from './src/lib/supabase';

export type View = 'YZY' | 'THE_ARK' | 'STILL' | 'ADMIN' | 'FILES' | 'SYSTEM_FAILURE';

const App: React.FC = () => {
  const [view, setView] = useState<View>(() => {
    if (typeof window === 'undefined') return 'YZY';
    const p = window.location.pathname;
    if (p === '/admin') return 'ADMIN';
    if (p === '/the_ark') return 'THE_ARK';
    if (p === '/still') return 'STILL';
    if (p === '/files') return 'FILES';
    if (p === '/') return 'YZY';
    return 'SYSTEM_FAILURE';
  });

  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname;
      if (p === '/admin') setView('ADMIN');
      else if (p === '/the_ark') setView('THE_ARK');
      else if (p === '/still') setView('STILL');
      else if (p === '/files') setView('FILES');
      else if (p === '/') setView('YZY');
      else setView('SYSTEM_FAILURE');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const path = view === 'YZY' ? '/' : `/${view.toLowerCase()}`;
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  }, [view]);
  const [isSynced, setIsSynced] = useState(true);
  const [syncProgress, setSyncProgress] = useState(1);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isStarted, setIsStarted] = useState(true);
  const [mouseVelocity, setMouseVelocity] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [audioVolume, setAudioVolume] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isHolyHour, setIsHolyHour] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [isSpamming, setIsSpamming] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [bannerText, setBannerText] = useState('TBA');
  const [isLoading, setIsLoading] = useState(true);

  // SUPABASE REALTIME SUBSCRIPTION
  useEffect(() => {
    // 1. Initial fetch for latest banner
    const fetchLatest = async () => {
      const { data } = await supabase
        .from('transmissions')
        .select('*')
        .eq('type', 'BANNER_UPDATE')
        .order('created_at', { ascending: false })
        .limit(1);

      if (data && data[0]) {
        setBannerText(data[0].message);
      }
    };
    fetchLatest();

    // 2. Realtime Subscription
    const channel = supabase
      .channel('public:transmissions')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'transmissions' }, (payload) => {
        const { message, type } = payload.new;

        if (type === 'BANNER_UPDATE') {
          setBannerText(message);
        } else if (type === 'BROADCAST' || type === 'INJECTION') {
          // Trigger the existing visual logic
          onTransmissionRequest(message);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Transmission State
  const [activeTransmission, setActiveTransmission] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isSubliminal, setIsSubliminal] = useState(false);
  const [transmissionTrigger, setTransmissionTrigger] = useState(0);
  const [clickTrigger, setClickTrigger] = useState(0);
  const [isDissolving, setIsDissolving] = useState(false);

  // Stem States
  const [stems] = useState({
    foundation: true,
    spirit: true,
    ambience: true
  });

  const syncInterval = useRef<number | null>(null);
  const spamTimeout = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const checkHoly = () => {
      const hours = new Date().getHours();
      const mins = new Date().getMinutes();
      setIsHolyHour((hours === 0 || hours === 12) && mins < 5);
    };
    checkHoly();
    const interval = setInterval(checkHoly, 60000);
    return () => clearInterval(interval);
  }, []);

  // Extremely dampened procedural pulse - almost static
  useEffect(() => {
    if (!isStarted || view === 'STILL') return;
    const interval = setInterval(() => {
      setAudioVolume(v => {
        const target = 0.005 + Math.random() * 0.01;
        return v + (target - v) * 0.02;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [isStarted, view]);

  const startSync = () => {
    if (isSynced) return;
    setIsSyncing(true);
    syncInterval.current = window.setInterval(() => {
      setSyncProgress(p => {
        if (p >= 1) {
          finishSync();
          return 1;
        }
        return p + 0.008;
      });
    }, 50);
  };

  const stopSync = () => {
    if (isSynced) return;
    setIsSyncing(false);
    if (syncInterval.current) {
      clearInterval(syncInterval.current);
      syncInterval.current = null;
    }
    setSyncProgress(0);
  };

  const finishSync = () => {
    setIsSynced(true);
    setClickTrigger(t => t + 1);
    if (syncInterval.current) clearInterval(syncInterval.current);
    if (navigator.vibrate) navigator.vibrate(30);
    setTimeout(() => {
      setIsStarted(true);
    }, 1000);
  };

  const handleStartInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (isSynced) {
      setClickTrigger(t => t + 1);
      return;
    }
    startSync();
  };

  const handleEndInteraction = () => {
    if (isSynced) return;
    stopSync();
  };

  const onTransmissionRequest = (message: string) => {
    if (message === 'RESET' || message === 'BULLY') {
      setIsGlitching(true);
      setTransmissionTrigger(prev => prev + 5);
      setTimeout(() => setIsGlitching(false), 2500);
      return;
    }

    // CHECK FOR VISION INJECTION
    if (message.startsWith('VISION_INJECTED:')) {
      const payload = message.replace('VISION_INJECTED: ', '');
      const isSub = payload.startsWith('SUB_');
      const url = isSub ? payload.replace('SUB_', '') : payload;

      setActiveTransmission(null);
      setActiveImage(null);
      setIsDissolving(false);
      setTransmissionTrigger(prev => prev + 1);

      setTimeout(() => {
        setActiveImage(url); // Set the full URL
        setIsSubliminal(isSub);

        const dissolveTimer = setTimeout(() => {
          setIsDissolving(true);
          setTimeout(() => {
            setActiveImage(null);
            setIsSubliminal(false);
            setIsDissolving(false);
          }, 3000); // Fade out after 3s
        }, isSub ? 500 : 7000); // Fast cut for subliminal, longer for normal
        return () => clearTimeout(dissolveTimer);
      }, 100);
      return;
    }

    setActiveTransmission(null);
    setActiveImage(null);
    setIsDissolving(false);
    setTransmissionTrigger(prev => prev + 1);

    setTimeout(() => {
      setActiveTransmission(message.toUpperCase());
      const dissolveTimer = setTimeout(() => {
        setIsDissolving(true);
        setTimeout(() => {
          setActiveTransmission(null);
          setIsDissolving(false);
        }, 3000);
      }, 7000);
      return () => clearTimeout(dissolveTimer);
    }, 500);
  };

  const onFabricClick = useCallback(() => {
    setClickCount(c => c + 1);
    if (spamTimeout.current) clearTimeout(spamTimeout.current);
    spamTimeout.current = window.setTimeout(() => setClickCount(0), 2000);

    if (clickCount > 15) {
      setIsSpamming(true);
      setTransmissionTrigger(t => t + 1);
      setTimeout(() => setIsSpamming(false), 5000);
    }
  }, [clickCount]);

  return (
    <>
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      <div
        className={`relative w-full h-screen bg-[#EBE9E4] overflow-hidden select-none cursor-none transition-all duration-2000 ${isGlitching ? 'grayscale contrast-[105%] blur-[12px] brightness-[0.95]' : ''}`}
        onMouseDown={handleStartInteraction}
        onMouseUp={handleEndInteraction}
        onTouchStart={handleStartInteraction}
        onTouchEnd={handleEndInteraction}
      >
        <div className="fixed inset-0 pointer-events-none z-[2000] opacity-[0.02] mix-blend-multiply bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        <div className={`absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-[#EBE9E4]/30 via-transparent to-[#EBE9E4]/50 backdrop-blur-[4px] transition-opacity duration-[4000ms] ${isSynced ? 'opacity-100' : 'opacity-0'}`} />

        {!isSynced ? (
          <div className="absolute inset-0 bg-black z-[1000] flex flex-col items-center justify-center transition-all duration-2000">
            <div className="flex flex-col items-center gap-20 group">
              <div className="relative w-80 h-[1px] bg-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-white/30 transition-all duration-700 ease-out" style={{ width: `${syncProgress * 100}%` }} />
              </div>
              <button className={`times-bold text-2xl md:text-4xl tracking-[1em] transition-all duration-1500 ${isSyncing ? 'text-white opacity-80 blur-0' : 'text-white/5 opacity-10 blur-[8px]'}`}>
                {isSyncing ? 'CONSTRUCTING' : 'HOLD_TO_BUILD'}
              </button>
            </div>
          </div>
        ) : (
          <>
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }} style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0 }} dpr={[1, typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 1.5]}>
              <color attach="background" args={['#EBE9E4']} />
              <ambientLight intensity={0.2} />
              <pointLight position={[0, 0, 10]} intensity={2.0} />
              <FabricPlane
                onVelocityChange={setMouseVelocity}
                audioVolume={audioVolume}
                activeView={view}
                isHolyHour={isHolyHour}
                isSpamming={isSpamming}
                onClick={onFabricClick}
              />
            </Canvas>

            {/* ARK LOGO - Always visible */}
            <ArkLogo />

            {/* GLOBAL BANNER - UNDER NAVBAR */}
            {/* GLOBAL BANNER - UNDER NAVBAR */}
            <div className="absolute top-52 left-0 right-0 flex justify-center z-[100] pointer-events-none">
              <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-black/80 animate-pulse">{bannerText}</span>
            </div>

            <div className="absolute top-0 left-0 right-0 h-48 flex items-center justify-center z-[100]">
              <nav className="flex flex-row gap-12 md:gap-24 text-[8px] font-bold tracking-[1em] uppercase pointer-events-auto items-center opacity-60 hover:opacity-100 transition-opacity duration-[1500ms]">
                {(['YZY', 'THE_ARK', 'STILL', 'FILES'] as View[]).map((v) => (
                  <button
                    key={v}
                    onClick={(e) => { e.stopPropagation(); setView(v); setClickTrigger(t => t + 1); }}
                    className={`transition-all duration-[1200ms] hover:text-black hover:scale-105 active:scale-95 ${view === v ? 'text-black opacity-100 chiseled-nav' : 'text-black opacity-20'}`}
                  >
                    {v}
                  </button>
                ))}
              </nav>
            </div>

            {activeTransmission || activeImage ? <TransmissionOverlay message={activeTransmission} imageUrl={activeImage} isSubliminal={isSubliminal} isDissolving={isDissolving} /> : null}

            <div className="absolute inset-0 pointer-events-none z-50">
              {view === 'YZY' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-black transition-all duration-[3000ms]">
                  <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-[16rem] flex flex-col items-center">
                    <h2 className="times-bold text-2xl md:text-5xl tracking-tightest opacity-60 blur-[1px] uppercase">STAY ON YOUR SOVEREIGNTY</h2>
                  </div>
                  <h1 className="times-bold text-[18rem] md:text-[24rem] tracking-tightest leading-none select-none opacity-20 mt-32 uppercase">YZY</h1>
                  <Vlinkjn />
                  <div className="absolute bottom-32 text-[9px] font-bold tracking-[2.5em] opacity-50 uppercase">JAN 2026</div>
                </div>
              )}

              {view === 'STILL' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-black transition-all duration-[3000ms] gap-6">
                  <h2 className="times-bold text-4xl md:text-8xl tracking-[0.4em] opacity-60 uppercase blur-[0.5px]">IN A PERFECT WORLD</h2>
                  <div className="text-center">
                    <span className="text-[11px] font-bold tracking-[1.5em] uppercase opacity-50">TBA</span>
                  </div>
                </div>
              )}




              {view === 'THE_ARK' && <Sovereignty />}
              {view === 'ADMIN' && (
                adminUnlocked ? (
                  <Admin onTransmit={onTransmissionRequest} onBannerUpdate={setBannerText} currentBanner={bannerText} />
                ) : (
                  <PasswordGate onUnlock={() => setAdminUnlocked(true)} />
                )
              )}
              {view === 'FILES' && <FileManager />}

              {view === 'SYSTEM_FAILURE' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-[3000] text-[#EBE9E4]">
                  <h1 className="times-bold text-6xl md:text-9xl uppercase tracking-tighter text-red-600 mix-blend-difference">SYSTEM FAILURE</h1>
                  <div className="flex flex-col items-center gap-4 mt-8">
                    <span className="font-mono text-sm tracking-widest uppercase opacity-70">ERR_404_REALITY_NOT_FOUND</span>
                    <button
                      onClick={() => { setView('YZY'); window.history.pushState({}, '', '/'); }}
                      className="px-6 py-2 border border-white/20 hover:bg-white hover:text-black transition-colors font-mono text-xs uppercase tracking-widest"
                    >
                      REBOOT_SYSTEM
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="fixed pointer-events-none z-[1100] mix-blend-difference" style={{ left: mousePos.x, top: mousePos.y, transform: 'translate(-50%, -50%)' }}>
              <div className="w-16 h-16 flex items-center justify-center opacity-10">
                <div className="absolute w-[0.5px] h-full bg-white scale-y-110"></div>
                <div className="absolute h-[0.5px] w-full bg-white scale-x-110"></div>
              </div>
            </div>

            <AudioEngine
              mouseVelocity={mouseVelocity} isStarted={isStarted} activeView={view} stems={stems}
              transmissionTrigger={transmissionTrigger} clickTrigger={clickTrigger} isTransmissionActive={activeTransmission !== null} isSpamming={isSpamming}
            />
          </>
        )}

        <style>{`
        .chiseled-nav {
          text-shadow: 1px 1px 0px rgba(255,255,255,0.6), -1px -1px 0px rgba(0,0,0,0.02);
        }
        .tracking-tightest { letter-spacing: -0.15em; }
      `}</style>
      </div>
    </>
  );
};

export default App;
