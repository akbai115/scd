import React, { useState } from 'react';

interface FileItem {
    id: string;
    name: string;
    size: string;
    type: string;
    dateCreated: string;
    content?: string;
    audioUrl?: string;
}

interface Directory {
    id: string;
    name: string;
    items: FileItem[];
}

const MANIFESTO_TEXT = `THE ARK IS NOT A RELIGION
NOT A PARTY
NOT A HASHTAG

THE ARK IS A RESPONSE

WHEN THE FLOOD COMES
YOU DON’T ARGUE WITH THE WATER
YOU BUILD

THE ARK IS FOR THE ONES WHO SAW THE PATTERN EARLY
THE ONES WHO STOPPED ASKING PERMISSION
THE ONES WHO UNDERSTOOD THAT SYSTEMS DON’T SAVE YOU
STRUCTURE DOES

THE ARK IS OWNERSHIP
OF THOUGHT
OF DISTRIBUTION
OF TIME

WE DON’T BEG FOR ACCESS
WE DESIGN THE DOOR

THE ARK DOESN’T FLOAT BECAUSE OF FAITH
IT FLOATS BECAUSE IT WAS ENGINEERED
VISION + DISCIPLINE
ART + INFRASTRUCTURE

EVERY ERA ENDS THE SAME WAY
THE OLD WORLD LAUGHS
UNTIL THE WATER TOUCHES THEIR ANKLES

THE ARK IS QUIET
UNTIL IT ISN’T

IT MOVES WITHOUT ANNOUNCEMENT
BUILDS WITHOUT APPLAUSE
AND CLOSES WITHOUT APOLOGY

THIS IS NOT ABOUT ESCAPE
THIS IS ABOUT SURVIVAL WITH STYLE

THE ARK IS FOR THE BUILDERS
THE MAKERS
THE ONES WHO STAYED WORKING
WHILE EVERYONE ELSE WAS TALKING

WHEN IT SETS SAIL
DON’T ASK WHERE IT’S GOING

ASK WHY YOU DIDN’T BUILD ONE TOO`;

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
            { id: '4', name: 'ANGELS.MP3', size: '3.4MB', type: 'AUDIO', dateCreated: '01-01-2099', audioUrl: '/ANGELS.mp3' }
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

    const handleFileDoubleClick = (file: FileItem) => {
        if (file.content || file.audioUrl) {
            setOpenedFile(file);
        }
    };

    return (
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-32 pb-8 px-4 md:px-12 md:pt-48 z-[40] pointer-events-auto overflow-hidden animate-in fade-in zoom-in-95 duration-500 text-white">

            {/* Background Noise Layer for cohesion */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Main Window Container - STRIPPED BACK */}
            <div className="w-full max-w-6xl flex-1 flex flex-col relative z-10 transition-all duration-500 group">

                {/* Header - RAW DATA VISUALIZATION */}
                <div className="border-b border-white p-4 flex items-end justify-between select-none">
                    <div className="flex flex-col gap-1">
                        <span className="text-[9px] font-bold tracking-[0.5em] opacity-40 uppercase">SYSTEM_DIRECTORY</span>
                        <h2 className="times-bold text-4xl tracking-tightest uppercase leading-none opacity-80">INDEX</h2>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">

                    {/* Sidebar / Drives */}
                    <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 flex flex-col">
                        <div className="p-4 border-b border-white/5">
                            <span className="text-[9px] font-bold tracking-widest opacity-40">MOUNT_POINTS</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
                            {fileSystem.map(drive => (
                                <button
                                    key={drive.id}
                                    onClick={() => { setActiveDrive(drive); setSelectedFileId(null); }}
                                    className={`w-full text-left flex items-center justify-between group
                      ${activeDrive.id === drive.id
                                            ? 'opacity-100'
                                            : 'opacity-40 hover:opacity-70'
                                        }`}
                                >
                                    <span className="uppercase tracking-widest flex items-center gap-2">
                                        <span className={`w-1 h-1 bg-white ${activeDrive.id === drive.id ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
                                        {drive.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Main File List */}
                    <div className="flex-1 flex flex-col">

                        {/* List Header */}
                        <div className="flex border-b border-white/5 text-[9px] font-bold tracking-widest opacity-30 uppercase p-4">
                            <div className="flex-1">OBJECT_NAME</div>
                            <div className="w-24 hidden md:block">SIZE</div>
                            <div className="w-32 hidden md:block">CREATED</div>
                        </div>

                        {/* File Items */}
                        <div className="flex-1 overflow-y-auto w-full p-4 space-y-2 font-mono text-xs">
                            {currentFiles.map(file => (
                                <div
                                    key={file.id}
                                    onClick={() => setSelectedFileId(file.id)}
                                    onDoubleClick={() => handleFileDoubleClick(file)}
                                    className={`flex items-center cursor-pointer py-2 border-b border-dashed border-white/5 group transition-all duration-200
                                       ${selectedFileId === file.id
                                            ? 'opacity-100 pl-4'
                                            : 'opacity-60 hover:opacity-80 hover:pl-2'
                                        }`}
                                >
                                    <div className="flex-1 truncate flex items-center gap-4">
                                        <span className="opacity-30 text-[10px]">{selectedFileId === file.id ? '>' : ''}</span>
                                        <span className="uppercase tracking-widest">{file.name}</span>
                                    </div>
                                    <div className="w-24 hidden md:block opacity-40 text-[10px]">{file.size}</div>
                                    <div className="w-32 hidden md:block opacity-40 text-[10px]">{file.dateCreated}</div>
                                </div>
                            ))}
                            {currentFiles.length === 0 && (
                                <div className="p-8 text-center opacity-30 text-[10px] tracking-widest uppercase">
                                    [VOID]
                                </div>
                            )}
                        </div>
                    </div>

                    {/* FILE VIEWER OVERLAY - RAW */}
                    {openedFile && (
                        <div className="absolute inset-0 z-50 bg-[#111111] flex flex-col animate-in fade-in zoom-in-95 duration-300">
                            <div className="flex items-center justify-between p-6 border-b border-white">
                                <span className="font-mono text-sm uppercase tracking-widest">{openedFile.name}</span>
                                <button
                                    onClick={() => setOpenedFile(null)}
                                    className="text-xs font-bold uppercase tracking-widest hover:underline"
                                >
                                    CLOSE_STREAM
                                </button>
                            </div>
                            <div className="flex-1 p-8 md:p-16 overflow-y-auto flex flex-col items-center justify-center">
                                {openedFile.audioUrl ? (
                                    <div className="w-full max-w-md flex flex-col gap-8">
                                        <div className="w-full h-32 border border-white/20 flex items-center justify-center bg-white/5 animate-pulse">
                                            <span className="text-4xl font-bold tracking-widest opacity-50">AUDIO_WAVE</span>
                                        </div>
                                        <audio controls className="w-full invert opacity-80" src={openedFile.audioUrl} autoPlay />
                                        <div className="flex justify-between text-[10px] font-mono opacity-50 uppercase tracking-widest">
                                            <span>Start_Stream</span>
                                            <span>End_Stream</span>
                                        </div>
                                    </div>
                                ) : (
                                    <pre className="whitespace-pre-wrap font-mono text-sm md:text-base leading-loose opacity-80 uppercase selection:bg-white selection:text-black w-full">
                                        {openedFile.content}
                                    </pre>
                                )}
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer - Only Counts */}
                <div className="h-12 border-t border-white flex items-center px-4 justify-between text-[9px] font-bold tracking-widest opacity-40 uppercase">
                    <span>INDEX_COUNT: {objectCount}</span>
                </div>

            </div>

            <style>{`
        .tracking-tightest { letter-spacing: -0.05em; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
      `}</style>
        </div>
    );
};
