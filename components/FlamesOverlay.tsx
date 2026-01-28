import React from 'react';

export const FlamesOverlay: React.FC = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 h-48 md:h-64 z-[45] pointer-events-none mix-blend-screen opacity-60">
            {/* FLAMES VIDEO */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover mask-gradient-to-t"
            >
                <source src="/flames.mp4" type="video/mp4" />
            </video>

            <style>{`
                .mask-gradient-to-t {
                    mask-image: linear-gradient(to top, black 0%, transparent 100%);
                    -webkit-mask-image: linear-gradient(to top, black 0%, transparent 100%);
                }
            `}</style>
        </div>
    );
};
