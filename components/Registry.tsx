import React, { useState } from 'react';

interface RegistryProps {
  onAction: () => void;
}

export const Registry: React.FC<RegistryProps> = ({ onAction }) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitted(true);
    onAction();
    setTimeout(() => {
      setEmail('');
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-auto transition-all duration-1000 animate-in fade-in zoom-in-95 px-6">
      <div className="w-full max-w-2xl flex flex-col gap-16">

        {/* Header */}
        <div className="flex flex-col items-center gap-6 text-center text-white">
          <div className="flex flex-col gap-2">
            <span className="text-[9px] font-bold tracking-[2em] opacity-40 uppercase">ENROLLMENT_PROTOCOL</span>
            <h1 className="times-bold text-6xl md:text-8xl tracking-tightest uppercase leading-none">DECLARE</h1>
            <h2 className="times-bold text-4xl md:text-6xl tracking-tightest uppercase opacity-60">IDENTITY</h2>
          </div>

          <div className="w-32 h-[1px] bg-white opacity-20" />

          <p className="text-[10px] font-bold tracking-[0.8em] uppercase opacity-50 max-w-md leading-relaxed">
            Join the sovereign network. Your identity is your power. No intermediaries. No compromise.
          </p>
        </div>

        {/* Form */}
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-10 text-white">
            <div className="relative group">
              <label className="text-[9px] font-bold tracking-[1.5em] uppercase opacity-40 mb-3 block">
                EMAIL_ADDRESS
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="YOUR@DOMAIN.COM"
                className="w-full bg-transparent border-b-2 border-white/10 text-2xl font-mono tracking-wide py-6 px-2 outline-none placeholder:opacity-10 focus:border-white transition-all uppercase text-white"
                required
              />
              <div className="absolute bottom-0 left-0 h-[3px] bg-white scale-x-0 group-focus-within:scale-x-100 transition-transform duration-1000 origin-left" />
            </div>

            <div className="flex flex-col gap-4">
              <button
                type="submit"
                className="py-6 bg-white text-black text-[11px] font-bold tracking-[1.2em] uppercase hover:invert transition-all active:scale-[0.98] shadow-lg"
              >
                REGISTER_SOVEREIGNTY
              </button>

              <div className="flex items-center justify-center gap-4 opacity-20">
                <div className="w-16 h-[1px] bg-white" />
                <div className="w-2 h-2 bg-white rotate-45" />
                <div className="w-16 h-[1px] bg-white" />
              </div>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center gap-10 animate-in fade-in zoom-in-95 duration-700 text-white">
            <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 border-4 border-white flex items-center justify-center animate-pulse">
                <div className="w-10 h-10 bg-white rotate-45" />
              </div>

              <div className="flex flex-col items-center gap-3">
                <h3 className="times-bold text-4xl tracking-tightest uppercase">SOVEREIGNTY</h3>
                <h4 className="times-bold text-2xl tracking-tightest uppercase opacity-60">VERIFIED</h4>
              </div>

              <div className="text-[10px] font-bold tracking-[1em] uppercase opacity-40 text-center max-w-md leading-relaxed">
                Your declaration has been recorded on the immutable ledger. Welcome to the network.
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 w-full max-w-md opacity-60">
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-mono">001</div>
                <div className="text-[8px] font-bold tracking-widest uppercase opacity-50">NODE_ID</div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-mono">∞</div>
                <div className="text-[8px] font-bold tracking-widest uppercase opacity-50">VALIDITY</div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="text-3xl font-mono">100%</div>
                <div className="text-[8px] font-bold tracking-widest uppercase opacity-50">TRUST</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center gap-4 opacity-30 text-white">
          <div className="flex items-center gap-6">
            <div className="w-24 h-[1px] bg-white" />
            <div className="w-3 h-3 bg-white rotate-45" />
            <div className="w-24 h-[1px] bg-white" />
          </div>
          <div className="text-[8px] font-bold tracking-[2em] uppercase">YZY_PROTOCOL_V1</div>
        </div>
      </div>

      <style>{`
        .tracking-tightest { letter-spacing: -0.1em; }
      `}</style>
    </div>
  );
};
