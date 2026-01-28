export const Vlinkjn: React.FC = () => {
    return (
        <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000] pointer-events-none"
        >
            <video
                src="/rain.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-64 h-auto md:w-96 drop-shadow-2xl opacity-90"
            />
        </div>
    );
};
