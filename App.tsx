
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
import { IntroAnimation } from './components/IntroAnimation';
import { Notepad } from './components/Notepad';
import { HimFigure } from './components/HimFigure';
import { StormOverlay } from './components/StormOverlay';
import { Events } from './Events';
import { LiveStream } from './components/LiveStream';
import { supabase } from './src/lib/supabase';

export type View = 'YZY' | 'THE_ARK' | 'STILL' | 'ADMIN' | 'FILES' | 'EVENTS' | 'LIVE' | 'SYSTEM_FAILURE';

const App: React.FC = () => {
  const [view, setView] = useState<View>(() => {
    if (typeof window === 'undefined') return 'YZY';
    const p = window.location.pathname;
    if (p === '/admin') return 'ADMIN';
    if (p === '/the_ark') return 'THE_ARK';
    if (p === '/still') return 'STILL';
    if (p === '/files') return 'FILES';
    if (p === '/events') return 'EVENTS';
    if (p === '/live') return 'LIVE';
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
      else if (p === '/events') setView('EVENTS');
      else if (p === '/live') setView('LIVE');
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
      {/* <IntroAnimation /> */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}

      <div
        className={`relative w-full h-screen bg-[#F2F2F2] overflow-hidden select-none cursor-none transition-all duration-2000 ${isGlitching ? 'grayscale contrast-[105%] blur-[12px] brightness-[0.95]' : ''}`}
        onMouseDown={handleStartInteraction}
        onMouseUp={handleEndInteraction}
        onTouchStart={handleStartInteraction}
        onTouchEnd={handleEndInteraction}
      >
        {/* PHASE 2 HEADER */}
        <div className="absolute top-4 left-0 right-0 flex justify-center z-[2000] pointer-events-none">
          <h1 className="text-red-600 font-black text-xl tracking-[0.5em] uppercase animate-pulse">PHASE 2</h1>
        </div>

        {/* AUDIO: BULLY LOOP */}
        <audio autoPlay loop hidden>
          <source src="/bully.mp3" type="audio/mpeg" />
        </audio>
        <div className="fixed inset-0 pointer-events-none z-[2000] opacity-[0.05] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        <div className={`absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-[#F2F2F2]/30 via-transparent to-[#F2F2F2]/50 backdrop-blur-[4px] transition-opacity duration-[4000ms] ${isSynced ? 'opacity-100' : 'opacity-0'}`} />

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
              <color attach="background" args={['#F2F2F2']} />
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

            {/* HOOD LOGO - TOP RIGHT */}
            <div className="fixed top-8 right-8 z-[150] pointer-events-none opacity-80 hover:opacity-100 transition-opacity">
              <img
                src="/hood.png"
                alt="Hood Logo"
                className="w-16 h-auto drop-shadow-lg"
              />
            </div>

            {/* LEFT NOTEPAD */}
            <Notepad />

            {/* HIM FIGURE */}
            <HimFigure />

            {/* STORM OVERLAY */}
            <StormOverlay />

            {/* GLOBAL BANNER - UNDER NAVBAR */}
            {/* GLOBAL BANNER - UNDER NAVBAR */}
            <div className="absolute top-40 left-0 right-0 flex justify-center z-[100] pointer-events-none">
              <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-black/80 animate-pulse">{bannerText}</span>
            </div>

            <div className="absolute top-0 left-0 right-0 h-48 flex items-center justify-center z-[100]">
              <nav className="flex flex-row gap-12 md:gap-24 text-[10px] font-black tracking-[0.5em] uppercase pointer-events-auto items-center text-black">
                {(['YZY', 'THE_ARK', 'STILL', 'FILES', 'EVENTS', 'LIVE'] as View[]).map((v) => (
                  <button
                    key={v}
                    onClick={(e) => { e.stopPropagation(); setView(v); setClickTrigger(t => t + 1); }}
                    className={`transition-all duration-300 hover:scale-105 active:scale-95 border-b-2 border-transparent hover:border-black
                      ${(v === 'EVENTS' || v === 'LIVE') ? 'text-red-600 hover:text-red-500' : 'hover:text-black'}
                      ${view === v
                        ? (v === 'EVENTS' || v === 'LIVE' ? 'opacity-100 border-red-600' : 'opacity-100 border-black')
                        : 'opacity-40 hover:opacity-100'
                      }`}
                  >
                    {v === 'YZY' ? 'IAPW' : v}
                  </button>
                ))}
              </nav>
            </div>

            {activeTransmission || activeImage ? <TransmissionOverlay message={activeTransmission} imageUrl={activeImage} isSubliminal={isSubliminal} isDissolving={isDissolving} /> : null}

            <div className="absolute inset-0 pointer-events-none z-50">
              {view === 'YZY' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-black transition-all duration-[3000ms]">
                  <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-[16rem] flex flex-col items-center">
                    {/* Subheader removed for silence */}
                  </div>
                  <img
                    src="/by.png"
                    alt="ARK"
                    className="w-[10rem] md:w-[24rem] h-auto -translate-y-24 md:-translate-y-48 object-contain select-none opacity-100"
                  />
                  <Vlinkjn />

                  {/* CENTER MANIFESTO */}
                  <div className="absolute top-[65%] md:top-[60%] flex flex-col items-center text-center gap-6 z-20 pointer-events-none mix-blend-difference">
                    <div className="flex flex-col gap-1">
                      <p className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-black">PHASE 1 WAS SIGNAL</p>
                      <p className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-black">SEEING WHO FLINCHED</p>
                      <p className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-black">WHO RUSHED TO LABEL</p>
                      <p className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-black">WHO NEEDED EXPLANATIONS INSTEAD OF VISION</p>
                    </div>

                    <div className="w-1 h-8 bg-black/20" />

                    <div className="flex flex-col gap-1">
                      <p className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-black">PHASE 2 IS STRUCTURE</p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-black">NO MORE FRAGMENTS FOR SPECTATORS</p>
                      <p className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-black">NO MORE DECODING FOR PEOPLE WHO DON’T BUILD</p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-black">THIS IS WHERE IDEAS STOP FLOATING</p>
                      <p className="text-[10px] md:text-[11px] font-bold tracking-[0.2em] uppercase text-black">AND START CARRYING WEIGHT</p>
                    </div>

                    <div className="mt-4 flex flex-col gap-1 opacity-60">
                      <p className="text-[9px] md:text-[10px] font-mono tracking-[0.1em] uppercase text-black">IF YOU’RE STILL ASKING WHAT IT MEANS</p>
                      <p className="text-[9px] md:text-[10px] font-mono tracking-[0.1em] uppercase text-black">YOU’RE NOT LATE</p>
                      <p className="text-[9px] md:text-[10px] font-mono tracking-[0.1em] uppercase text-black">YOU’RE JUST NOT INSIDE YET</p>
                    </div>
                  </div>

                  <div className="absolute bottom-32 text-[10px] font-black tracking-[1.5em] text-black uppercase">JAN 2026</div>

                  {/* BOTTOM LEFT CA LINK & SPOTIFY */}
                  <div className="absolute bottom-8 left-8 z-[100] pointer-events-auto flex flex-col items-start gap-4">
                    <a
                      href="https://open.spotify.com/prerelease/4xFs0x8abwU3H9uNRPFRmE"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-[10px] font-mono font-bold text-black/50 hover:text-green-600 transition-colors uppercase tracking-widest group"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-black group-hover:text-green-600 transition-colors">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                      </svg>
                      PRE-SAVE ON SPOTIFY
                    </a>
                    <a
                      href="https://pump.fun/profile/yz0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] font-mono font-bold text-black/50 hover:text-black transition-colors uppercase tracking-widest"
                    >
                      CA: 54F9DbbQqZJKQdweH8WnwBEa8MWVNhUUdP3NJFREpump
                    </a>
                  </div>

                  {/* RIGHT SIDE MANIFESTO */}
                  {/* RIGHT SIDE MANIFESTO - HEAVY/CARVED */}
                  <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 flex flex-col items-end text-right gap-8 pointer-events-none z-10">
                    <div className="flex flex-col gap-0">
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">THE ARK WAS NEVER ABOUT ESCAPE</p>
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">IT WAS ABOUT SELECTION</p>
                    </div>

                    <div className="flex flex-col gap-0">
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">THIS IS THE ONE</p>
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">DON’T DIVIDE</p>
                    </div>

                    <div className="flex flex-col gap-0">
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">NOT EVERYONE FITS</p>
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">NOT EVERYONE WANTS IT</p>
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">NOT EVERYONE SURVIVES</p>
                    </div>

                    <div className="flex flex-col gap-0">
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">THE FLOOD DOESN’T ANNOUNCE ITSELF</p>
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">THE ARK DOESN’T EXPLAIN</p>
                    </div>

                    <div className="flex flex-col gap-0">
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">THIS IS THE ONE</p>
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">DON’T DIVIDE</p>
                    </div>

                    <div className="flex flex-col gap-0">
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">THE ARK DOESN’T BEG</p>
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">IT WAITS <span className="text-[10px] opacity-100 font-mono">54F9DbbQqZJKQdweH8WnwBEa8MWVNhUUdP3NJFREpump</span></p>
                    </div>
                  </div>

                  {/* LEFT SIDE MESSAGE */}
                  <div className="absolute left-4 md:left-16 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-start text-left gap-8 pointer-events-none z-10">
                    <div className="flex flex-col gap-0">
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">BECAUSE PEOPLE KEEP GRABBING RANDOM PIECES</p>
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">AND CALLING THEM THE WHOLE STORY</p>
                    </div>

                    <div className="flex flex-col gap-0">
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">THIS WAS NEVER CHAOS</p>
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">IT WAS A PATTERN</p>
                    </div>

                    <div className="flex flex-col gap-0">
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">I RELEASE FRAGMENTS ON PURPOSE</p>
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">PRESSURE TESTS</p>
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">SIGNAL CHECKS</p>
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">WHO LISTENS VS WHO REACTS</p>
                    </div>

                    <div className="flex flex-col gap-0">
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">THIS IS THE FINAL ARC</p>
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">NOT BECAUSE IT’S LOUD</p>
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">BUT BECAUSE IT’S PRECISE</p>
                    </div>

                    <div className="flex flex-col gap-0">
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">YOU DON’T GET THE FULL PICTURE BY SCREENSHOTTING MOMENTS</p>
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">YOU GET IT BY WATCHING HOW THEY CONNECT</p>
                    </div>

                    <div className="flex flex-col gap-0">
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">I WON’T GIVE CLARITY UNTIL THE COMMUNITY SHOWS IT CAN HOLD IT</p>
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">NOT HYPE</p>
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">NOT OUTRAGE</p>
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">UNDERSTANDING</p>
                    </div>

                    <div className="flex flex-col gap-0">
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">YOU DON’T RISE BY DEMANDING</p>
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">YOU RISE BY TUNING IN</p>
                    </div>

                    <div className="flex flex-col gap-0">
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">PATTERNS FIRST</p>
                      <p className="text-[12px] font-black tracking-[0.1em] uppercase text-black">THEN ASCENT</p>
                    </div>
                  </div>
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
              {view === 'EVENTS' && <Events onNavigateToCheckout={() => window.open('https://yzy.com', '_blank')} onImpact={() => setTransmissionTrigger(t => t + 1)} />}
              {view === 'LIVE' && <LiveStream />}

              {view === 'SYSTEM_FAILURE' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-[3000] text-[#EBE9E4]">
                  <h1 className="times-bold text-6xl md:text-9xl uppercase tracking-tighter text-red-600 mix-blend-difference">SYSTEM FAILURE</h1>
                  <div className="flex flex-col items-center gap-4 mt-8">
                    <span className="font-mono text-sm tracking-widest uppercase opacity-70">ERR_404_REALITY_NOT_FOUND</span>
                    <button
                      onClick={() => { setView('YZY'); window.history.pushState({}, '', '/'); }}
                      className="px-6 py-2 border border-black/20 hover:bg-black hover:text-white transition-colors font-mono text-xs uppercase tracking-widest"
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
