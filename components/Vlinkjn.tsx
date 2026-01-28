export const Vlinkjn: React.FC = () => {
    return (
        <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] pointer-events-none"
        >
            <video
                src="/flames.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-64 h-auto md:w-96 drop-shadow-2xl opacity-90 relative z-10"
            />
            <video
                src="/flames32.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-64 h-auto md:w-96 object-cover mix-blend-screen opacity-60 z-20 animate-pulse"
            />
        </div>
    );
};
