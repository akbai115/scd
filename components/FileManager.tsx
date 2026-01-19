import React, { useState } from 'react';

interface FileItem {
    id: string;
    name: string;
    size: string;
    type: string;
    dateCreated: string;
    content?: string;
}

interface Directory {
    id: string;
    name: string;
    items: FileItem[];
}

const MANIFESTO_TEXT = `THEY THOUGHT THEY COULD BANKRUPT THE VISION BUT YOU CANT BANKRUPT GOD THEY WANT YOU TO BUY A LOGO TO VALIDATE YOUR EXISTENCE I TOOK THE LOGO OFF NOW YOU HAVE TO LOOK AT YOURSELF

NO MORE SLAVE DEALS NO MORE MIDDLE MEN WE GOING DIRECT TO THE PEOPLE THE ARK IS THE ONLY WAY OUT THEY CANT CONTROL WHAT THEY CANT SEE WE GONE`;

const fileSystem: Directory[] = [
    {
        id: 'root',
        name: 'ROOT_ACCESS',
        items: [
            { id: '1', name: 'KERNEL.SYS', size: '24MB', type: 'SYSTEM', dateCreated: '01-01-2099' },
            { id: '2', name: 'BOOT_SEQ.LOG', size: '4KB', type: 'LOG', dateCreated: '01-02-2099' },
            { id: '3', name: 'INDEX.DAT', size: '128KB', type: 'DATA', dateCreated: '01-01-2099' },
        ]
    },
    {
        id: 'audio',
        name: 'AUDIO_BANKS',
        items: [
            { id: '8', name: 'DOPPLER.WAV', size: '42MB', type: 'AUDIO', dateCreated: '04-01-2099' },
            { id: '9', name: 'GLTCH_01.MP3', size: '5MB', type: 'AUDIO', dateCreated: '04-02-2099' },
            { id: '10', name: 'SUB_BASS.FLAC', size: '85MB', type: 'AUDIO', dateCreated: '04-01-2099' },
        ]
    },
    {
        id: 'manifestos',
        name: 'MANIFESTOS',
        items: [
            { id: '11', name: 'MANIFESTO.TXT', size: '1KB', type: 'TEXT', dateCreated: '05-01-2099', content: MANIFESTO_TEXT }
        ]
    }
];

export const FileManager: React.FC = () => {
    const [activeDrive, setActiveDrive] = useState<Directory>(fileSystem[0]);
    const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
    const [openedFile, setOpenedFile] = useState<FileItem | null>(null);

    const currentFiles = activeDrive.items;
    const objectCount = currentFiles.length;
    const freeSpace = "0KB";

    const handleFileDoubleClick = (file: FileItem) => {
        if (file.content) {
            setOpenedFile(file);
        }
    };

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-32 pb-8 px-4 md:px-12 md:pt-48 z-[40] pointer-events-auto overflow-hidden animate-in fade-in zoom-in-95 duration-500">

            {/* Background Noise Layer for cohesion */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Main Window Container */}
            <div className="w-full max-w-6xl flex-1 bg-[#1a1a1a]/95 backdrop-blur-md border border-white/20 flex flex-col shadow-[20px_20px_0px_rgba(0,0,0,0.8)] relative z-10 transition-all duration-500 group">

                {/* Header - Brutalist */}
                <div className="border-b border-white/20 bg-black p-4 flex flex-col md:flex-row md:items-end justify-between gap-4 select-none">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-bold tracking-[0.5em] text-white/50 uppercase">Directory_Listing_V2</span>
                        <h2 className="times-bold text-3xl md:text-5xl text-white tracking-tightest uppercase leading-none">FILE_MANAGER</h2>
                    </div>

                    {/* Custom Controls */}
                    <div className="flex gap-2">
                        <div className="h-8 w-8 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black cursor-pointer transition-colors text-xs font-mono">_</div>
                        <div className="h-8 w-8 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black cursor-pointer transition-colors text-xs font-mono">□</div>
                        <div className="h-8 w-8 bg-white/10 border border-white/20 flex items-center justify-center hover:bg-red-900 hover:text-white cursor-pointer transition-colors text-xs font-mono">X</div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">

                    {/* Sidebar / Drives */}
                    <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 flex flex-col bg-black/20">
                        <div className="p-4 border-b border-white/10">
                            <span className="text-[9px] font-bold tracking-widest text-white/40">MOUNTED_DRIVES</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs">
                            {fileSystem.map(drive => (
                                <button
                                    key={drive.id}
                                    onClick={() => { setActiveDrive(drive); setSelectedFileId(null); }}
                                    className={`w-full text-left px-3 py-3 border border-transparent transition-all duration-300 group relative flex items-center justify-between
                      ${activeDrive.id === drive.id
                                            ? 'bg-white text-black border-white'
                                            : 'text-gray-400 hover:text-white hover:border-white/30'
                                        }`}
                                >
                                    <span className="uppercase tracking-wider">{drive.name}</span>
                                    {activeDrive.id === drive.id && <span className="text-[10px] font-bold animate-pulse">●</span>}
                                </button>
                            ))}
                        </div>
                        {/* Drive Stats Decoration */}
                        <div className="p-4 border-t border-white/10 flex flex-col gap-2 opacity-50">
                            <div className="h-[1px] w-full bg-white/20"></div>
                            <div className="flex justify-between text-[9px] font-mono text-white/60">
                                <span>SYS_INTEGRITY</span>
                                <span>99.9%</span>
                            </div>
                        </div>
                    </div>

                    {/* Main File List */}
                    <div className="flex-1 flex flex-col bg-[#1a1a1a]">

                        {/* List Header */}
                        <div className="flex border-b border-white/10 text-[10px] md:text-xs font-bold tracking-widest text-white/40 uppercase bg-black/40">
                            <div className="flex-1 px-4 py-3 border-r border-white/5">FILENAME</div>
                            <div className="w-24 px-4 py-3 border-r border-white/5 hidden md:block">SIZE</div>
                            <div className="w-24 px-4 py-3 border-r border-white/5 hidden md:block">TYPE</div>
                            <div className="w-32 px-4 py-3 hidden md:block">CREATED</div>
                        </div>

                        {/* File Items */}
                        <div className="flex-1 overflow-y-auto w-full p-2 space-y-1 font-mono text-xs md:text-sm">
                            {currentFiles.map(file => (
                                <div
                                    key={file.id}
                                    onClick={() => setSelectedFileId(file.id)}
                                    onDoubleClick={() => handleFileDoubleClick(file)}
                                    className={`flex items-center cursor-pointer px-4 py-3 border border-transparent transition-all duration-200 group
                       ${selectedFileId === file.id
                                            ? 'bg-white text-black translate-x-1'
                                            : 'text-white/80 hover:bg-white/5 hover:border-white/10'
                                        }`}
                                >
                                    <div className="flex-1 truncate flex items-center gap-3">
                                        <div className={`w-2 h-2 ${selectedFileId === file.id ? 'bg-black' : 'bg-white/50'} rotate-45 transform transition-colors`}></div>
                                        <span className="uppercase tracking-widest">{file.name}</span>
                                    </div>
                                    <div className="w-24 hidden md:block opacity-60">{file.size}</div>
                                    <div className="w-24 hidden md:block opacity-60">{file.type}</div>
                                    <div className="w-32 hidden md:block opacity-60">{file.dateCreated}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* FILE VIEWER OVERLAY */}
                    {openedFile && (
                        <div className="absolute inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col animate-in fade-in zoom-in-95 duration-300">
                            <div className="flex items-center justify-between p-4 border-b border-white/20 bg-black">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold tracking-[0.3em] opacity-50 uppercase">TEXT_VIEWER</span>
                                    <span className="font-mono text-xl uppercase tracking-widest">{openedFile.name}</span>
                                </div>
                                <button
                                    onClick={() => setOpenedFile(null)}
                                    className="h-10 w-10 border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                                >
                                    X
                                </button>
                            </div>
                            <div className="flex-1 p-8 md:p-16 overflow-y-auto">
                                <pre className="whitespace-pre-wrap font-mono text-sm md:text-lg leading-relaxed text-white/90 tracking-wide selection:bg-white selection:text-black">
                                    {openedFile.content}
                                </pre>
                            </div>
                            <div className="p-4 border-t border-white/10 text-center">
                                <span className="text-[9px] font-bold tracking-[0.5em] opacity-30 uppercase">END_OF_FILE</span>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="h-10 border-t border-white/20 bg-black flex items-center px-6 justify-between text-[9px] font-bold tracking-widest text-[#EBE9E4] uppercase">
                    <div className="flex gap-8">
                        <span>TOTAL_OBJECTS: <span className="font-mono text-white opacity-60 ml-2">{objectCount.toString().padStart(2, '0')}</span></span>
                        <span>SELECTION: <span className="font-mono text-white opacity-60 ml-2">{selectedFileId ? 'ACTIVE' : 'NULL'}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="hidden md:inline">STORAGE_AVAILABLE: </span>
                        <span className="font-mono opacity-60">{freeSpace}</span>
                    </div>
                </div>

            </div>

            <style>{`
        .tracking-tightest { letter-spacing: -0.05em; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.5); }
      `}</style>
        </div>
    );
};
