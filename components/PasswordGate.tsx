import React, { useState } from 'react';

interface PasswordGateProps {
    onUnlock: () => void;
}

export const PasswordGate: React.FC<PasswordGateProps> = ({ onUnlock }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'YZY888') {
            onUnlock();
        } else {
            setError(true);
            setPassword('');
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-[#EBE9E4] z-[2000]">
            <div className="flex flex-col items-center gap-12">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-black flex items-center justify-center">
                        <div className="w-6 h-6 bg-black rotate-45" />
                    </div>
                    <h2 className="times-bold text-4xl tracking-tightest uppercase opacity-90">ADMIN_ACCESS</h2>
                    <span className="text-[9px] font-bold tracking-[1.5em] opacity-40 uppercase">RESTRICTED_ZONE</span>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-80">
                    <div className="relative">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="ENTER_PASSCODE"
                            className={`w-full bg-transparent border-b-2 ${error ? 'border-red-500' : 'border-black/20'} text-2xl font-mono tracking-widest py-4 px-2 outline-none placeholder:opacity-20 focus:border-black transition-colors uppercase text-center`}
                            autoFocus
                        />
                        {error && (
                            <div className="absolute -bottom-8 left-0 right-0 text-center text-[10px] font-bold tracking-widest text-red-500 uppercase animate-pulse">
                                ACCESS_DENIED
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="py-4 bg-black text-[#EBE9E4] text-[10px] font-bold tracking-[1em] uppercase hover:invert transition-all active:scale-95"
                    >
                        AUTHENTICATE
                    </button>
                </form>

                <div className="flex items-center gap-4 opacity-20">
                    <div className="w-12 h-[1px] bg-black" />
                    <div className="w-2 h-2 bg-black rotate-45" />
                    <div className="w-12 h-[1px] bg-black" />
                </div>
            </div>
        </div>
    );
};
