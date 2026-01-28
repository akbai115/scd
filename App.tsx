
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

import { useSiteContent } from './src/hooks/useSiteContent';

import { ArrivalBackground } from './components/ArrivalBackground';
import { DigitalStaticOverlay } from './components/DigitalStaticOverlay';
import { CymaticsBackground } from './components/CymaticsBackground';

import { StadiumWidget } from './components/StadiumWidget';
// import { RisingArm } from './components/RisingArm'; - REMOVED
import { CrackOverlay } from './components/CrackOverlay';
import { FloatingSubs } from './components/FloatingSubs';
import { CrescentMoon } from './components/CrescentMoon';
import { FlamesOverlay } from './components/FlamesOverlay';


const App: React.FC = () => {
  const { headerText, footerText, leftManifesto, centerManifesto, rightManifesto } = useSiteContent();
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

  // Admin Event States
  const [isShaking, setIsShaking] = useState(false);
  const [isInverted, setIsInverted] = useState(false);
  const [isBlackout, setIsBlackout] = useState(false);
  const [isFlash, setIsFlash] = useState(false);
  const [isRedWash, setIsRedWash] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);

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

    // CHECK FOR ADMIN EVENTS
    if (message === 'SEISMIC') {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 2000);
      return;
    }
    if (message === 'INVERT') {
      setIsInverted(prev => !prev);
      return;
    }
    if (message === 'BLACKOUT') {
      setIsBlackout(prev => !prev);
      return;
    }
    if (message === 'FLASH') {
      setIsFlash(true);
      setTimeout(() => setIsFlash(false), 200);
      return;
    }
    if (message === 'GLITCH_STORM') {
      setIsGlitching(true);
      setTransmissionTrigger(prev => prev + 20);
      setTimeout(() => setIsGlitching(false), 5000); // Longer glitch
      return;
    }
    if (message === 'RED_WASH') {
      setIsRedWash(prev => !prev);
      return;
    }
    if (message === 'BLUR_WAVE') {
      setIsBlurred(true);
      setTimeout(() => setIsBlurred(false), 3000);
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
        className={`relative w-full h-screen bg-black overflow-hidden select-none transition-all duration-2000 
          ${isGlitching ? 'grayscale contrast-[105%] blur-[12px] brightness-[0.95]' : ''}
          ${isShaking ? 'animate-shake' : ''}
          ${isInverted ? 'invert' : ''}
          ${isBlackout ? 'brightness-0' : ''}
          ${isFlash ? 'brightness-[2.0] bg-white' : ''}
          ${isRedWash ? 'bg-red-600 mix-blend-multiply' : ''}
          ${isBlurred ? 'blur-[8px]' : ''}
        `}
        onMouseDown={handleStartInteraction}
        onMouseUp={handleEndInteraction}
        onTouchStart={handleStartInteraction}
        onTouchEnd={handleEndInteraction}
      >
        {/* BACKGROUND VIDEO */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-[40] opacity-60"
        >
          <source src="/ARK.mp4" type="video/mp4" />
        </video>

        {/* CYMATICS ANIMATION - Above video, below content */}
        <CymaticsBackground audioVolume={audioVolume} />
        {/* PHASE 2 HEADER */}
        <div className="absolute top-4 left-0 right-0 flex justify-center z-[2000] pointer-events-none">
          <h1 className="text-white font-black text-xl tracking-[0.5em] uppercase animate-pulse">{headerText}</h1>
        </div>


        <div className="fixed inset-0 pointer-events-none z-[2000] opacity-[0.05] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />



        <div className={`absolute inset-0 z-10 pointer-events-none bg-gradient-to-b from-white/30 via-transparent to-white/50 backdrop-blur-[4px] transition-opacity duration-[4000ms] ${isSynced ? 'opacity-100' : 'opacity-0'}`} />

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
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }} style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0, zIndex: 10 }} dpr={[1, typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 1.5]}>
              {/* <color attach="background" args={['#FFFFFF']} /> REPLACED BY VIDEO */}
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

            {/* ARRIVAL BACKGROUND SCROLL */}
            <ArrivalBackground />

            {/* DIGITAL STATIC OVERLAY - Digital Feed Aesthetics */}
            <DigitalStaticOverlay />

            {/* ARK LOGO - Always visible */}
            <ArkLogo />



            {/* LEFT NOTEPAD */}
            <Notepad />

            {/* STADIUM WIDGET */}
            <StadiumWidget />

            {/* HIM FIGURE */}
            <HimFigure />

            {/* RISING HAND/ARM - REMOVED */}
            {/* <RisingArm /> */}

            {/* CRACK OVERLAY - Splits screen in half */}
            <CrackOverlay />

            {/* FLOATING SUBS */}
            <FloatingSubs />

            {/* CRESCENT MOON - Top left corner */}
            <CrescentMoon />

            {/* FLAMES OVERLAY - Bottom of screen */}
            <FlamesOverlay />

            {/* STORM OVERLAY - PAUSED */}
            {/* <StormOverlay /> */}

            {/* GLOBAL BANNER - UNDER NAVBAR */}
            {/* GLOBAL BANNER - UNDER NAVBAR */}
            <div className="absolute top-40 left-0 right-0 flex justify-center z-[100] pointer-events-none">
              <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-white/80 animate-pulse">{bannerText}</span>
            </div>

            <div className="absolute top-0 left-0 right-0 h-32 md:h-48 flex items-center justify-center z-[100] pointer-events-none overflow-x-auto">
              <nav className="flex flex-row gap-4 md:gap-24 text-[8px] md:text-[10px] font-black tracking-[0.3em] md:tracking-[0.5em] uppercase pointer-events-auto items-center text-white px-4">
                {(['YZY', 'THE_ARK', 'STILL', 'FILES', 'EVENTS', 'LIVE'] as View[]).map((v) => (
                  <button
                    key={v}
                    onClick={(e) => { e.stopPropagation(); setView(v); setClickTrigger(t => t + 1); }}
                    className={`transition-all duration-300 hover:scale-105 active:scale-95 border-b-2 border-transparent hover:border-black
                      ${(v === 'EVENTS' || v === 'LIVE' || v === 'THE_ARK') ? 'text-red-600 hover:text-red-500' : 'hover:text-white'}
                      ${v === 'THE_ARK' ? 'animate-pulse drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]' : ''}
                      ${view === v
                        ? (v === 'EVENTS' || v === 'LIVE' || v === 'THE_ARK' ? 'opacity-100 border-red-600' : 'opacity-100 border-white')
                        : 'opacity-40 hover:opacity-100'
                      }`}
                  >
                    {v === 'YZY' ? 'HOME' : v}
                  </button>
                ))}
              </nav>
            </div>

            {activeTransmission || activeImage ? <TransmissionOverlay message={activeTransmission} imageUrl={activeImage} isSubliminal={isSubliminal} isDissolving={isDissolving} /> : null}

            <div className="absolute inset-0 pointer-events-none z-50">
              {view === 'YZY' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white transition-all duration-[3000ms]">
                  <div className="absolute top-[50%] left-1/2 -translate-x-1/2 -translate-y-[16rem] flex flex-col items-center">
                    {/* Subheader removed for silence */}
                  </div>



                  <div className="relative -translate-y-24 md:-translate-y-48 z-[100] mt-4 pointer-events-none w-fit mx-auto">
                    <img
                      src="/theark.png"
                      alt="THE ARK"
                      className="w-96 md:w-[45rem] h-auto object-contain relative z-10"
                    />
                    {/* SHINE EFFECT */}
                    {/* Mask Container - Stationary */}
                    <div className="absolute inset-0 z-20 w-full h-full mask-logo">
                      {/* Animated Gradient */}
                      <div className="w-[200%] h-full bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-[-20deg] animate-shiny-sweep absolute top-0 -left-[100%]" />
                    </div>
                    <style>{`
                      .mask-logo {
                        mask-image: url("/theark.png");
                        mask-size: contain;
                        mask-repeat: no-repeat;
                        mask-position: center;
                        -webkit-mask-image: url("/theark.png");
                        -webkit-mask-size: contain;
                        -webkit-mask-repeat: no-repeat;
                        -webkit-mask-position: center;
                      }
                      @keyframes shiny-sweep {
                        0% { transform: translateX(0%); }
                        20% { transform: translateX(100%); }
                        100% { transform: translateX(100%); }
                      }
                      .animate-shiny-sweep {
                        animation: shiny-sweep 5s cubic-bezier(0.4, 0.0, 0.2, 1) infinite;
                        background: linear-gradient(
                          90deg, 
                          transparent 0%, 
                          rgba(255, 255, 255, 0.0) 40%, 
                          rgba(255, 255, 255, 0.9) 50%, 
                          rgba(255, 255, 255, 0.0) 60%, 
                          transparent 100%
                        );
                      }
                    `}</style>

                    {/* GRIP FIGURE - Behind the logo, appearing to grip it */}
                    <img
                      src="/grip.png"
                      alt=""
                      className="absolute top-1/2 left-1/2 translate-x-[10%] -translate-y-[30%] w-[10%] md:w-[6%] h-auto object-contain z-0 opacity-90"
                    />
                  </div>

                  {/* MINIMALISTIC BOAT SVG */}
                  <div className="absolute top-[35%] md:top-[30%] z-[90] pointer-events-none animate-float opacity-80 mt-12 md:mt-24">
                    <svg width="60" height="30" viewBox="0 0 100 50" className="drop-shadow-lg">
                      {/* Hull */}
                      <path d="M10,20 L25,45 L75,45 L90,20 Z" fill="black" />
                      {/* Cabin/Details - minimal */}
                      <rect x="35" y="5" width="30" height="15" fill="black" />
                      <rect x="42" y="0" width="16" height="5" fill="black" />
                    </svg>
                    <style>{`
                          @keyframes float {
                              0%, 100% { transform: translateY(0) rotate(0deg); }
                              50% { transform: translateY(-5px) rotate(1deg); }
                          }
                          .animate-float {
                              animation: float 4s ease-in-out infinite;
                          }
                      `}</style>
                  </div>

                  <Vlinkjn />

                  {/* LINKS REPLACING MANIFESTO */}
                  <div className="absolute top-[65%] md:top-[60%] flex flex-col items-center text-center gap-6 z-20 pointer-events-auto">
                    <div className="flex flex-col items-center gap-4">
                      <a
                        href="https://twitter.com/intent/tweet?text=%24YZARK%20ARRIVAL%2054F9DbbQqZJKQdweH8WnwBEa8MWVNhUUdP3NJFREpump"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[10px] font-mono font-bold text-white hover:text-white/70 transition-colors uppercase tracking-widest group"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white group-hover:text-white/70 transition-colors">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        POST $YZARK
                      </a>
                    </div>

                    <div className="flex flex-col items-center gap-6 mt-8 opacity-90 mix-blend-difference pointer-events-none">
                      {centerManifesto.map((line, i) => (
                        <p key={i} className="text-[8px] md:text-[11px] font-bold tracking-[0.1em] md:tracking-[0.2em] uppercase text-white text-center px-4">{line}</p>
                      ))}
                    </div>

                    <div className="absolute bottom-24 md:bottom-32 text-[8px] md:text-[10px] font-black tracking-[0.5em] md:tracking-[1.5em] text-white uppercase">{footerText}</div>
                  </div>

                  {/* BOTTOM LEFT CA LINK & SPOTIFY */}
                  <div className="absolute bottom-8 left-8 z-[100] pointer-events-auto flex flex-col items-start gap-4">

                    <a
                      href="https://pump.fun/profile/yz0"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[7px] md:text-[10px] font-mono font-bold text-white/50 hover:text-white transition-colors uppercase tracking-widest break-all max-w-[200px] md:max-w-none"
                    >
                      CA: 54F9DbbQqZJKQdweH8WnwBEa8MWVNhUUdP3NJFREpump
                    </a>
                  </div>

                  {/* RIGHT SIDE MANIFESTO */}
                  {/* RIGHT SIDE MANIFESTO - HEAVY/CARVED */}
                  {/* RIGHT SIDE MANIFESTO */}
                  <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 flex flex-col items-end text-right gap-4 pointer-events-none z-10">
                    {rightManifesto.map((line, i) => (
                      <p key={i} className="text-[8px] md:text-[12px] font-black tracking-[0.05em] md:tracking-[0.1em] uppercase text-white">
                        {line.includes('54F9') ? (
                          <>
                            {line.split('54F9')[0]}
                            <span className="text-[10px] opacity-100 font-mono">54F9{line.split('54F9')[1]}</span>
                          </>
                        ) : line}
                      </p>
                    ))}
                  </div>

                  {/* LEFT SIDE MESSAGE */}
                  {/* LEFT SIDE MESSAGE */}
                  <div className="absolute left-4 md:left-16 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-start text-left gap-4 pointer-events-none z-10">
                    {leftManifesto.map((line, i) => (
                      <p key={i} className="text-[12px] font-black tracking-[0.1em] uppercase text-white">{line}</p>
                    ))}
                  </div>

                </div>
              )}

              {view === 'STILL' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white transition-all duration-[3000ms] gap-6">
                  <h2 className="times-bold text-2xl md:text-8xl tracking-[0.2em] md:tracking-[0.4em] opacity-60 uppercase blur-[0.5px] px-4 text-center">IN A PERFECT WORLD</h2>
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



            {/* HUM AUDIO - replaces procedural AudioEngine */}
            {isStarted && (
              <audio autoPlay loop preload="auto" style={{ display: 'none' }}>
                <source src="/humnew.wav" type="audio/wav" />
              </audio>
            )}

            {/* AUDIO ENGINE - DISABLED, replaced by humnew.wav */}
            {/* <AudioEngine
              mouseVelocity={mouseVelocity} isStarted={isStarted} activeView={view} stems={stems}
              transmissionTrigger={transmissionTrigger} clickTrigger={clickTrigger} isTransmissionActive={activeTransmission !== null} isSpamming={isSpamming}
            /> */}
          </>
        )}

        <style>{`
        .chiseled-nav {
          text-shadow: 1px 1px 0px rgba(255,255,255,0.6), -1px -1px 0px rgba(0,0,0,0.02);
        }
        .tracking-tightest { letter-spacing: -0.15em; }
        
        @keyframes shake {
          0% { transform: translate(2px, 2px) rotate(0deg); }
          10% { transform: translate(-2px, -4px) rotate(-1deg); }
          20% { transform: translate(-6px, 0px) rotate(2deg); }
          30% { transform: translate(6px, 4px) rotate(0deg); }
          40% { transform: translate(2px, -2px) rotate(2deg); }
          50% { transform: translate(-2px, 4px) rotate(-1deg); }
          60% { transform: translate(-6px, 2px) rotate(0deg); }
          70% { transform: translate(6px, 2px) rotate(-1deg); }
          80% { transform: translate(-2px, -2px) rotate(2deg); }
          90% { transform: translate(2px, 4px) rotate(0deg); }
          100% { transform: translate(2px, -4px) rotate(-1deg); }
        }
        .animate-shake {
          animation: shake 0.5s;
          animation-iteration-count: infinite;
        }
      `}</style>
      </div>


    </>
  );
};

export default App;
