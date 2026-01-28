import React from 'react';

export const CrackOverlay: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[200] pointer-events-none flex items-center justify-center">
            {/* CRACK SVG - splits screen vertically */}
            <svg
                viewBox="0 0 100 1000"
                className="h-full w-auto max-w-[50px]"
                preserveAspectRatio="none"
            >
                <defs>
                    <filter id="crackGlow">
                        <feGaussianBlur stdDeviation="1" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Main crack line - jagged path down center */}
                <path
                    d="M50,0
                       L48,50 L55,80 L45,120 L52,160 L47,200
                       L53,240 L46,280 L54,320 L48,360 L51,400
                       L45,440 L55,480 L47,520 L53,560 L46,600
                       L54,640 L48,680 L52,720 L46,760 L54,800
                       L47,840 L53,880 L48,920 L52,960 L50,1000"
                    stroke="rgba(50,50,50,0.9)"
                    strokeWidth="3"
                    fill="none"
                    filter="url(#crackGlow)"
                    className="animate-crack-draw"
                    style={{
                        strokeDasharray: 2000,
                        strokeDashoffset: 2000,
                    }}
                />

                {/* Secondary crack branches */}
                <path
                    d="M52,160 L65,180 L58,195
                       M45,280 L32,300 L38,320
                       M54,440 L68,460 L60,475
                       M46,560 L30,580 L36,600
                       M52,720 L65,740 L58,755
                       M48,840 L35,860 L42,875"
                    stroke="rgba(40,40,40,0.7)"
                    strokeWidth="1.5"
                    fill="none"
                    className="animate-crack-branches"
                    style={{
                        strokeDasharray: 500,
                        strokeDashoffset: 500,
                    }}
                />

                {/* Highlight edge for depth */}
                <path
                    d="M50,0
                       L48,50 L55,80 L45,120 L52,160 L47,200
                       L53,240 L46,280 L54,320 L48,360 L51,400
                       L45,440 L55,480 L47,520 L53,560 L46,600
                       L54,640 L48,680 L52,720 L46,760 L54,800
                       L47,840 L53,880 L48,920 L52,960 L50,1000"
                    stroke="rgba(80,80,80,0.4)"
                    strokeWidth="1"
                    fill="none"
                    transform="translate(1, 0)"
                    className="animate-crack-draw"
                    style={{
                        strokeDasharray: 2000,
                        strokeDashoffset: 2000,
                    }}
                />
            </svg>

            <style>{`
                @keyframes crack-draw {
                    0% { stroke-dashoffset: 2000; }
                    100% { stroke-dashoffset: 0; }
                }
                @keyframes crack-branches {
                    0% { stroke-dashoffset: 500; opacity: 0; }
                    50% { opacity: 0; }
                    100% { stroke-dashoffset: 0; opacity: 1; }
                }
                .animate-crack-draw {
                    animation: crack-draw 3s ease-out forwards;
                    animation-delay: 1s;
                }
                .animate-crack-branches {
                    animation: crack-branches 2s ease-out forwards;
                    animation-delay: 2s;
                }
            `}</style>
        </div>
    );
};
