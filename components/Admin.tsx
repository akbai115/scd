import React, { useState, useEffect } from 'react';
import { supabase } from '../src/lib/supabase';
import { OpticInjector } from './OpticInjector';
import { useSiteContent } from '../src/hooks/useSiteContent';

interface AdminProps {
  onTransmit: (message: string) => void;
  onBannerUpdate: (text: string) => void;
  currentBanner: string;
}

const TABS = ['BROADCAST', 'CONTENT', 'STREAM', 'VISUALS'];

interface VisualPanelProps {
  onUpdate: (config: any) => void;
}

const VisualsPanel: React.FC<VisualPanelProps> = ({ onUpdate }) => {
  const [bg, setBg] = useState('VIDEO');
  const [features, setFeatures] = useState({
    goldenKey: true,
    crescentMoon: true,
    crackOverlay: true,
    digitalStatic: true,
    floatingSubs: true,
    notepad: true,
    stadium: true,
    arkLogo: true,
  });
  const [colors, setColors] = useState({
    textColor: '#FFFFFF',
    accentColor: '#FF0000',
    backgroundColor: '#000000',
  });

  const handleUpdate = () => {
    onUpdate({
      activeBackground: bg,
      visibleFeatures: features,
      branding: colors
    });
  };

  return (
    <div className="flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">
      <div className="flex justify-between items-center">
        <h3 className="text-[10px] uppercase opacity-50 tracking-widest">VISUAL_CONTROLLER_V1</h3>
        <button onClick={handleUpdate} className="px-6 py-2 bg-blue-600 text-white font-bold text-[10px] tracking-widest uppercase hover:bg-blue-500">APPLY_VISUALS</button>
      </div>

      {/* BACKGROUND MODE */}
      <div className="flex flex-col gap-3">
        <label className="text-[9px] uppercase opacity-40">BACKGROUND_MODE</label>
        <div className="flex gap-2">
          {['VIDEO', 'CYMATICS', 'SOLID'].map(mode => (
            <button
              key={mode}
              onClick={() => setBg(mode)}
              className={`flex-1 py-3 text-[10px] font-bold border transition-all ${bg === mode ? 'bg-white text-black border-white' : 'border-white/20 hover:border-white'}`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* COLORS */}
      <div className="flex flex-col gap-3">
        <label className="text-[9px] uppercase opacity-40">SYSTEM_COLORS</label>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-[8px] uppercase">TEXT</span>
            <input type="color" value={colors.textColor} onChange={e => setColors({ ...colors, textColor: e.target.value })} className="w-full h-8 bg-transparent cursor-pointer" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[8px] uppercase">ACCENT</span>
            <input type="color" value={colors.accentColor} onChange={e => setColors({ ...colors, accentColor: e.target.value })} className="w-full h-8 bg-transparent cursor-pointer" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[8px] uppercase">SOLID_BG</span>
            <input type="color" value={colors.backgroundColor} onChange={e => setColors({ ...colors, backgroundColor: e.target.value })} className="w-full h-8 bg-transparent cursor-pointer" />
          </div>
        </div>
      </div>

      {/* FEATURES TOGGLE */}
      <div className="flex flex-col gap-3">
        <label className="text-[9px] uppercase opacity-40">COMPONENT_VISIBILITY</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(features).map(([key, enabled]) => (
            <button
              key={key}
              onClick={() => setFeatures(prev => ({ ...prev, [key]: !enabled }))}
              className={`p-3 text-left border flex justify-between items-center ${enabled ? 'border-green-500/50 bg-green-900/10' : 'border-white/10 opacity-50'}`}
            >
              <span className="text-[9px] uppercase font-bold">{key.replace(/([A-Z])/g, '_$1')}</span>
              <div className={`w-2 h-2 rounded-full ${enabled ? 'bg-green-500' : 'bg-red-500'}`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Admin: React.FC<AdminProps> = ({ onTransmit, onBannerUpdate, currentBanner }) => {
  const [activeTab, setActiveTab] = useState('BROADCAST');
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<string[]>(['CORE_STABLE', 'VIBRATION_ACTIVE_432HZ']);
  const [bannerText, setBannerText] = useState(currentBanner);

  // Content State
  const content = useSiteContent();
  const [headerText, setHeaderText] = useState(content.headerText);
  const [footerText, setFooterText] = useState(content.footerText);
  const [leftManifesto, setLeftManifesto] = useState(content.leftManifesto.join('\n'));
  const [centerManifesto, setCenterManifesto] = useState(content.centerManifesto.join('\n'));
  const [rightManifesto, setRightManifesto] = useState(content.rightManifesto.join('\n'));
  const [streamUrl, setStreamUrl] = useState(content.streamUrl);
  const [streamLive, setStreamLive] = useState(content.streamLive);

  // Sync local state when remote content loads (only once or on drastic change?)
  // We'll trust the hook to update us, but avoid overwriting user's typing.
  // Simple approach: Init state from hook was done. We might need useEffect to update if hook changes *and* we haven't touched it.
  // For simplicity, we assume one admin.
  useEffect(() => {
    setHeaderText(content.headerText);
    setFooterText(content.footerText);
    setLeftManifesto(content.leftManifesto.join('\n'));
    setCenterManifesto(content.centerManifesto.join('\n'));
    setRightManifesto(content.rightManifesto.join('\n'));
    setStreamUrl(content.streamUrl);
    setStreamLive(content.streamLive);
  }, [content]); // This might overwrite work if someone else edits, but ensures we edit latest.

  const handleTransmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onTransmit(message);
    setHistory(prev => [message.toUpperCase(), ...prev].slice(0, 8));
    setMessage('');
    await supabase.from('transmissions').insert({ message: message, type: 'BROADCAST' });
  };

  const handleInject = async (url: string, sub: boolean) => {
    const payload = `VISION_INJECTED: ${sub ? 'SUB_' : ''}${url}`;
    onTransmit(payload);
    await supabase.from('transmissions').insert({ message: payload, type: 'INJECTION' });
  };

  const handleBannerUpdate = async () => {
    onBannerUpdate(bannerText);
    setHistory(prev => [`BANNER_UPDATED: ${bannerText}`, ...prev].slice(0, 8));
    await supabase.from('transmissions').insert({ message: bannerText, type: 'BANNER_UPDATE' });
  };

  const broadcastEvent = async (eventName: string) => {
    // 1. Local Echo
    onTransmit(eventName);
    setHistory(prev => [`EVENT_TRIGGERED: ${eventName}`, ...prev].slice(0, 8));

    // 2. Broadcast to DB
    const { error } = await supabase.from('transmissions').insert({
      message: eventName,
      type: 'BROADCAST'
    });

    if (error) {
      console.error('Broadcast failed:', error);
      setHistory(prev => [`ERROR: ${error.message}`, ...prev].slice(0, 8));
    }
  };

  const saveContent = async () => {
    const updates = {
      headerText,
      footerText,
      leftManifesto: leftManifesto.split('\n').filter(l => l.trim()),
      centerManifesto: centerManifesto.split('\n').filter(l => l.trim()),
      rightManifesto: rightManifesto.split('\n').filter(l => l.trim()),
      streamUrl,
      streamLive
    };

    // Optimistic Update? The hook listens to DB so we just pushing to DB is enough.
    // We send the whole object to be safe, or could send partials.
    // Sending full state ensures consistency.

    const { error } = await supabase.from('transmissions').insert({
      message: JSON.stringify(updates),
      type: 'CONTENT_UPDATE'
    });

    if (error) {
      setHistory(prev => [`ERROR_SAVING_CONTENT`, ...prev].slice(0, 8));
    } else {
      setHistory(prev => [`CONTENT_PUBLISHED`, ...prev].slice(0, 8));
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto transition-all duration-1000 animate-in fade-in zoom-in-95 px-4 md:px-12 bg-black/90 text-white font-mono overflow-y-auto">
      <div className="w-full max-w-6xl flex flex-col gap-6 py-12">

        {/* HEADER / TABS */}
        <header className="flex flex-col md:flex-row justify-between items-end border-b border-white/20 pb-4 gap-4">
          <h1 className="times-bold text-4xl tracking-tightest uppercase text-white/90">YZY_ADMIN_V2</h1>
          <nav className="flex gap-1 bg-white/5 p-1 rounded-sm">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-all ${activeTab === tab ? 'bg-white text-black' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* LEFT COLUMN: ACTIVE VIEW */}
          <div className="md:col-span-2 bg-white/5 border border-white/10 p-6 backdrop-blur-sm min-h-[500px]">
            {activeTab === 'BROADCAST' && (
              <div className="flex flex-col gap-8 h-full">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase opacity-50 tracking-widest">TRANSMISSION_INPUT</label>
                  <form onSubmit={handleTransmit} className="flex flex-col gap-4">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="ENTER COMMAND..."
                      className="w-full bg-black/50 border border-white/20 p-4 font-mono text-xl outline-none focus:border-white transition-colors uppercase"
                    />
                    <div className="flex gap-4">
                      <button type="submit" className="flex-1 py-3 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] hover:bg-gray-200">BROADCAST</button>
                      <button type="button" onClick={() => broadcastEvent('BULLY')} className="flex-1 py-3 border border-red-500 text-red-500 font-bold text-xs uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white">WAR_MODE</button>
                    </div>
                  </form>
                </div>
                <div className="w-full h-[1px] bg-white/10" />
                <OpticInjector onInject={handleInject} />
                <div className="w-full h-[1px] bg-white/10" />
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase opacity-50 tracking-widest">BANNER_CONTROL</label>
                  <div className="flex gap-2">
                    <input
                      value={bannerText}
                      onChange={e => setBannerText(e.target.value)}
                      className="flex-1 bg-black/50 border border-white/20 p-2 text-xs font-mono uppercase"
                    />
                    <button onClick={handleBannerUpdate} className="px-4 bg-white/10 text-[10px] font-bold uppercase hover:bg-white/20">UPDATE</button>
                  </div>
                </div>

                <div className="w-full h-[1px] bg-white/10" />

                <div className="flex flex-col gap-4">
                  <label className="text-[10px] uppercase opacity-50 tracking-widest">LIVE_EVENTS</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => broadcastEvent('SEISMIC')} className="py-4 md:py-3 border border-white/20 hover:bg-white hover:text-black text-[10px] font-bold uppercase tracking-widest active:bg-white active:text-black transition-colors">SEISMIC_SHAKE</button>
                    <button onClick={() => broadcastEvent('FLASH')} className="py-4 md:py-3 border border-white/20 hover:bg-white hover:text-black text-[10px] font-bold uppercase tracking-widest active:bg-white active:text-black transition-colors">FLASH_BANG</button>
                    <button onClick={() => broadcastEvent('INVERT')} className="py-4 md:py-3 border border-white/20 hover:bg-white hover:text-black text-[10px] font-bold uppercase tracking-widest active:bg-white active:text-black transition-colors">TOGGLE_INVERT</button>
                    <button onClick={() => broadcastEvent('BLACKOUT')} className="py-4 md:py-3 border border-white/20 hover:bg-black hover:text-white bg-white text-black text-[10px] font-bold uppercase tracking-widest active:bg-black active:text-white transition-colors">TOGGLE_BLACKOUT</button>
                    <button onClick={() => broadcastEvent('GLITCH_STORM')} className="py-4 md:py-3 border border-white/20 hover:bg-white hover:text-black text-[10px] font-bold uppercase tracking-widest active:bg-white active:text-black transition-colors">GLITCH_STORM</button>
                    <button onClick={() => broadcastEvent('RED_WASH')} className="py-4 md:py-3 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white text-[10px] font-bold uppercase tracking-widest active:bg-red-600 active:text-white transition-colors">RED_ALERT</button>
                    <button onClick={() => broadcastEvent('BLUR_WAVE')} className="py-4 md:py-3 border border-white/20 hover:bg-white hover:text-black text-[10px] font-bold uppercase tracking-widest active:bg-white active:text-black transition-colors">BLUR_WAVE</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'CONTENT' && (
              <div className="flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold opacity-50">HOMEPAGE_TEXT_EDITOR</span>
                  <button onClick={saveContent} className="px-6 py-2 bg-green-600 text-white font-bold text-[10px] tracking-widest uppercase hover:bg-green-500">PUBLISH_CHANGES</button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] uppercase opacity-40">HEADER_TEXT</label>
                    <input value={headerText} onChange={e => setHeaderText(e.target.value)} className="bg-black/30 border border-white/10 p-2 text-xs font-mono" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] uppercase opacity-40">FOOTER_TEXT</label>
                    <input value={footerText} onChange={e => setFooterText(e.target.value)} className="bg-black/30 border border-white/10 p-2 text-xs font-mono" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase opacity-40">LEFT_MANIFESTO (BUNDLERS)</label>
                  <textarea rows={6} value={leftManifesto} onChange={e => setLeftManifesto(e.target.value)} className="bg-black/30 border border-white/10 p-2 text-xs font-mono w-full resize-y" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase opacity-40">CENTER_MANIFESTO (GREED)</label>
                  <textarea rows={8} value={centerManifesto} onChange={e => setCenterManifesto(e.target.value)} className="bg-black/30 border border-white/10 p-2 text-xs font-mono w-full resize-y" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[9px] uppercase opacity-40">RIGHT_MANIFESTO (THE ARK)</label>
                  <textarea rows={8} value={rightManifesto} onChange={e => setRightManifesto(e.target.value)} className="bg-black/30 border border-white/10 p-2 text-xs font-mono w-full resize-y" />
                </div>
              </div>
            )}

            {activeTab === 'STREAM' && (
              <div className="flex flex-col gap-8 h-full">
                <div className="flex flex-col gap-4">
                  <label className="text-[10px] uppercase opacity-50 tracking-widest">LIVE_STREAM_CONFIG</label>

                  <div className="flex items-center gap-4 border border-white/10 p-4 bg-black/20">
                    <span className={`w-3 h-3 rounded-full ${streamLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`} />
                    <span className="text-sm font-bold tracking-widest">{streamLive ? 'STREAM_ACTIVE' : 'STREAM_OFFLINE'}</span>
                    <button
                      onClick={() => setStreamLive(!streamLive)}
                      className={`ml-auto px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${streamLive ? 'border-red-500 text-red-500 hover:bg-red-500 hover:text-white' : 'border-green-500 text-green-500 hover:bg-green-500 hover:text-black'}`}
                    >
                      {streamLive ? 'END_STREAM' : 'GO_LIVE'}
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] uppercase opacity-40">STREAM_URL (YOUTUBE EMBED / ETC)</label>
                    <input
                      value={streamUrl}
                      onChange={e => setStreamUrl(e.target.value)}
                      placeholder="https://www.youtube.com/embed/..."
                      className="w-full bg-black/30 border border-white/10 p-3 text-xs font-mono"
                    />
                  </div>

                  <div className="mt-auto">
                    <button onClick={saveContent} className="w-full py-4 bg-white text-black font-bold text-xs uppercase tracking-[0.2em] hover:invert">UPDATE_STREAM_SETTINGS</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'VISUALS' && (
              <VisualsPanel
                onUpdate={async (config) => {
                  await supabase.from('transmissions').insert({
                    message: JSON.stringify(config),
                    type: 'SITE_CONFIG'
                  });
                  onTransmit('SITE_VISUALS_UPDATED');
                }}
              />
            )}
          </div>

          {/* RIGHT COLUMN: SYSTEM/LOGS */}
          <div className="col-span-1 border-l border-white/10 pl-8 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-bold tracking-[1.5em] opacity-60 uppercase">SYSTEM_STATUS</span>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white/5 p-3 flex justify-between items-center">
                  <span className="text-[10px] font-mono">DB_CONNECTION</span>
                  <span className="text-[10px] font-bold text-green-500">ACTIVE</span>
                </div>
                <div className="bg-white/5 p-3 flex justify-between items-center">
                  <span className="text-[10px] font-mono">LATENCY</span>
                  <span className="text-[10px] font-bold">12ms</span>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col gap-2 min-h-[300px]">
              <span className="text-[9px] font-bold tracking-[1.5em] opacity-60 uppercase">EVENT_LOG</span>
              <div className="flex-1 bg-black/50 border border-white/5 p-4 font-mono text-[10px] opacity-70 overflow-y-auto no-scrollbar">
                {history.map((h, i) => (
                  <div key={i} className="mb-2 border-b border-white/5 pb-10">
                    <span className="block opacity-50 mb-1">{new Date().toLocaleTimeString()}</span>
                    <span >{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
};
