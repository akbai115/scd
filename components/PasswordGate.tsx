import React, { useState } from 'react';

interface PasswordGateProps {
    onUnlock: () => void;
}

export const PasswordGate: React.FC<PasswordGateProps> = ({ onUnlock }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const [shake, setShake] = useState(false);

    const checkPassword = async (input: string) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        // Hash for 'YZY888'
        if (hashHex === '7686594dc1f40a2b2832df7161e4e005333d4b55092470a2841d917648d6233a') {
            onUnlock();
        } else {
            setError(true);
            setShake(true);
            setTimeout(() => setShake(false), 500);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        checkPassword(password);
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center bg-[#111111] z-[2000]">
            <div className="flex flex-col items-center gap-12 text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-white flex items-center justify-center">
                        <div className="w-6 h-6 bg-white rotate-45" />
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
                            className={`w-full bg-transparent border-b-2 ${error ? 'border-red-500' : 'border-white/20'} text-2xl font-mono tracking-widest py-4 px-2 outline-none placeholder:opacity-20 focus:border-white transition-colors uppercase text-center text-white`}
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
                        className="py-4 bg-white text-black text-[10px] font-bold tracking-[1em] uppercase hover:invert transition-all active:scale-95"
                    >
                        AUTHENTICATE
                    </button>
                </form>

                <div className="flex items-center gap-4 opacity-20">
                    <div className="w-12 h-[1px] bg-white" />
                    <div className="w-2 h-2 bg-white rotate-45" />
                    <div className="w-12 h-[1px] bg-white" />
                </div>
            </div>
        </div>
    );
};
