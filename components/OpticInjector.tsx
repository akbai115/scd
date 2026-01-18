import React, { useState } from 'react';

interface OpticInjectorProps {
    onInject: (url: string, isSubliminal: boolean) => void;
}

export const OpticInjector: React.FC<OpticInjectorProps> = ({ onInject }) => {
    const [imageUrl, setImageUrl] = useState('');
    const [isSubliminal, setIsSubliminal] = useState(false);
    const [status, setStatus] = useState<'IDLE' | 'UPLOADING' | 'LOCKED'>('IDLE');

    const handleBroadcast = (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageUrl.trim()) return;

        setStatus('UPLOADING');
        console.log(`BROADCASTING VISION: ${imageUrl}`);

        // Simulate network request
        setTimeout(() => {
            setStatus('LOCKED');
            onInject(imageUrl, isSubliminal);

            // Reset after a delay
            setTimeout(() => {
                setStatus('IDLE');
                setImageUrl('');
            }, 2000);
        }, 1000);
    };

    return (
        <div className="border border-black p-5 flex flex-col gap-6 bg-white/50 backdrop-blur-sm">
            <header>
                <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">OPTIC_OVERRIDE_PROTOCOL</span>
            </header>

            <div className="flex flex-col gap-4">
                <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="ENTER_SOURCE_URL [JPG/PNG]"
                    className="w-full bg-transparent border-b border-black text-sm font-mono py-2 outline-none placeholder:opacity-30 focus:border-black transition-colors"
                />

                <div className="flex items-center justify-between pt-2">
                    {/* Subliminal Toggle */}
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative w-4 h-4 border border-black flex items-center justify-center transition-colors group-hover:bg-black/5">
                            <input
                                type="checkbox"
                                checked={isSubliminal}
                                onChange={(e) => setIsSubliminal(e.target.checked)}
                                className="peer sr-only"
                            />
                            <div className="w-2 h-2 bg-black opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-[10px] font-bold tracking-widest uppercase opacity-60 select-none">SUBLIMINAL_MODE</span>
                    </label>

                    {/* Action Button */}
                    <button
                        onClick={handleBroadcast}
                        disabled={status !== 'IDLE' || !imageUrl.trim()}
                        className="px-6 py-2 bg-black text-white text-[10px] font-bold tracking-widest uppercase hover:bg-white hover:text-black hover:border hover:border-black transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
                    >
                        {status === 'IDLE' ? 'RENDER' : status === 'UPLOADING' ? 'UPLOADING...' : 'VISION LOCKED'}
                    </button>
                </div>
            </div>
        </div>
    );
};
