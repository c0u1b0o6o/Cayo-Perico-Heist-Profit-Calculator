import React, { useMemo } from 'react';
import { Language, translations } from '@/lib/translations';
import { User, ExternalLink, ShieldCheck, Database, MessageSquare } from 'lucide-react';
import { clsx } from 'clsx';
import Image from 'next/image';
import mainAvatar from '@/assets/avatar/main-avatar.png';

interface ContactPageProps {
    language: Language;
}

const WordZoom: React.FC<{ text: string; className?: string }> = ({ text, className }) => {
    // Split by character to handle Chinese/English mixed text properly
    const chars = text.split('');
    return (
        <span className={className}>
            {chars.map((char, i) => (
                <span 
                    key={i} 
                    className="inline-block transition-all duration-200 hover:scale-125 hover:text-gray-900 hover:relative hover:z-10 cursor-default"
                >
                    {char === ' ' ? '\u00A0' : char}
                </span>
            ))}
        </span>
    );
};

export const ContactPage: React.FC<ContactPageProps> = ({ language }) => {
    const t = translations[language];

    const stats = useMemo(() => [
        { label: t.contact.role, value: t.contact.roleValue },
        { label: t.contact.status, value: t.contact.statusValue, color: 'text-green-600' },
        { label: t.contact.location, value: t.contact.locationValue },
    ], [t]);

    const links = useMemo(() => {
        const urls = [
            'https://github.com/c0u1b0o6o',
            'https://discord.com/cuboo',
            'https://placeholder.com',
            'mailto:cuboomax@gmail.com'
        ];
        return [
            { name: 'GitHub', Icon: GithubIcon, url: urls[0], color: 'bg-gray-800' },
            { name: 'Discord', Icon: DiscordIcon, url: urls[1], color: 'bg-indigo-600' },
            { name: 'My Blog', Icon: GlobeIcon, url: urls[2], color: 'bg-blue-600' },
            { name: 'E-mail', Icon: MailIcon, url: urls[3], color: 'bg-red-600' },
        ];
    }, []);

    return (
        <div className="w-full max-w-5xl mx-auto py-8 px-1 sm:px-4 space-y-8">
            {/* Main Dossier Section */}
            <div className="relative bg-[#e6d5b8] rounded-r-xl shadow-2xl p-1 border-l-8 sm:border-l-20 border-[#cbb085]">
                {/* Dossier Content */}
                <div className="bg-white/90 paper-texture p-4 sm:p-8 md:p-12 min-h-[500px] shadow-inner relative overflow-hidden">
                    
                    {/* Decorative Stamp */}
                    <div className="absolute top-10 right-[-40px] border-4 border-red-600/30 text-red-600/30 font-black text-4xl px-8 py-2 rotate-12 select-none pointer-events-none uppercase tracking-widest hidden md:block">
                        {t.contact.stamp}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Left Column: ID Card Area */}
                        <div className="md:col-span-1 space-y-8">
                            {/* Polaroid Style Photo */}
                            <div className="relative mx-auto w-48 h-56 bg-white p-3 shadow-xl transform -rotate-2 border border-gray-200">
                                <div className="w-full h-40 bg-gray-200 flex items-center justify-center overflow-hidden relative">
                                     <Image 
                                        src={mainAvatar} 
                                        alt="Git gud" 
                                        fill 
                                        className="object-cover"
                                     />
                                </div>
                                <div className="mt-4 font-hand text-center text-gray-800 text-lg font-bold">
                                    <WordZoom text="SHAW!" />
                                </div>
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-yellow-200/50 rotate-1 tape"></div>
                            </div>

                            {/* Personnel Details */}
                            <div className="space-y-4 pt-4 border-t-2 border-gray-200 border-dashed">
                                {stats.map(({ label, value, color }, i) => (
                                    <div key={i} className="flex justify-between items-center group">
                                        <span className="text-xs uppercase font-bold text-gray-500 tracking-wider font-sans">{label}</span>
                                        <WordZoom 
                                            text={value} 
                                            className={clsx("font-hand text-xl font-black", color || "text-gray-800")} 
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Information */}
                        <div className="md:col-span-2 space-y-10">
                            <div>
                                <h2 className="font-hand text-heading-1 text-gray-900 mb-2 border-b-4 border-gray-900 pb-2 inline-block">
                                    <WordZoom text={t.contact.title} />
                                </h2>
                                <h2 className="font-hand text-lg md:text-2xl text-gray-600 mt-6 leading-relaxed">
                                    <WordZoom text={t.contact.bio} />
                                </h2>
                            </div>
                        </div>
                    </div>
                    
                    {/* Bottom Fold Detail */}
                    <div className="absolute bottom-0 right-0 p-4 opacity-10 pointer-events-none">
                        <div className="font-sans font-black text-6xl tracking-tighter">EL CAYO</div>
                    </div>
                </div>
            </div>

            {/* Separated Links Section (Intel Sheet) */}
            <div className="relative bg-[#e6d5b8] rounded-r-lg shadow-xl p-1 border-l-4 sm:border-l-12 border-[#cbb085] -rotate-1">
                <div className="bg-white/90 paper-texture p-4 sm:p-6 md:p-8 shadow-inner relative overflow-hidden">
                    <h2 className="font-hand text-heading-2 text-gray-800 mb-6 border-b-2 border-gray-200 pb-2 flex items-center gap-3">
                        <WordZoom text={t.contact.intelTitle} />
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {links.map(({ name, Icon, url, color }, i) => (
                            <a 
                                key={i}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 bg-gray-50/50 border border-gray-200 rounded hover:border-gray-900 transition-all group"
                            >
                                <div className={clsx("p-2 rounded text-white group-hover:scale-110 transition-transform shadow-sm", color)}>
                                    <Icon size={20} />
                                 </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-hand text-xl font-bold text-gray-800 truncate">
                                        <WordZoom text={name} />
                                    </div>
                                    <div className="font-hand text-[11px] text-gray-400 truncate">{url.replace(/^(https?:\/\/|mailto:)/i, '')}</div>
                                </div>
                                <ExternalLink size={12} className="text-gray-300 group-hover:text-gray-900 shrink-0" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Feedback Section */}
            <div className="relative bg-[#d1e6e9] rounded-r-xl shadow-2xl p-1 border-l-20 border-[#a5c7cc] rotate-1">
                <div className="bg-white/90 paper-texture p-6 md:p-8 shadow-inner relative overflow-hidden">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="bg-white p-3 shadow-lg transform -rotate-3 border border-gray-200 shrink-0">
                             <div className="w-16 h-16 bg-cyan-100 flex items-center justify-center rounded">
                                <MessageSquare className="text-cyan-600" size={32} />
                             </div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="font-hand text-3xl font-black text-gray-900 mb-2">
                                <WordZoom text={t.contact.feedback} />
                            </h2>
                            <p className="font-hand text-xl text-gray-600 mb-4 tracking-tighter sm:tracking-normal">
                                <WordZoom text={t.contact.feedbackDesc} />
                            </p>
                            <a 
                                href="https://github.com/c0u1b0o6o/Cayo-Perico-Heist-Profit-Calculator/issues"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-6 py-2 bg-gray-900 text-white font-hand text-xl rounded hover:bg-gray-800 transition-colors shadow-lg active:scale-95"
                            >
                                <GithubIcon size={20} />
                                <span>GitHub Issues</span>
                                <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const GithubIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 -0.5 25 25" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="m12.301 0h.093c2.242 0 4.34.613 6.137 1.68l-.055-.031c1.871 1.094 3.386 2.609 4.449 4.422l.031.058c1.04 1.769 1.654 3.896 1.654 6.166 0 5.406-3.483 10-8.327 11.658l-.087.026c-.063.02-.135.031-.209.031-.162 0-.312-.054-.433-.144l.002.001c-.128-.115-.208-.281-.208-.466 0-.005 0-.01 0-.014v.001q0-.048.008-1.226t.008-2.154c.007-.075.011-.161.011-.249 0-.792-.323-1.508-.844-2.025.618-.061 1.176-.163 1.718-.305l-.076.017c.573-.16 1.073-.373 1.537-.642l-.031.017c.508-.28.938-.636 1.292-1.058l.006-.007c.372-.476.663-1.036.84-1.645l.009-.035c.209-.683.329-1.468.329-2.281 0-.045 0-.091-.001-.136v.007c0-.022.001-.047.001-.072 0-1.248-.482-2.383-1.269-3.23l.003.003c.168-.44.265-.948.265-1.479 0-.649-.145-1.263-.404-1.814l.011.026c-.115-.022-.246-.035-.381-.035-.334 0-.649.078-.929.216l.012-.005c-.568.21-1.054.448-1.512.726l.038-.022-.609.384c-.922-.264-1.981-.416-3.075-.416s-2.153.152-3.157.436l.081-.02q-.256-.176-.681-.433c-.373-.214-.814-.421-1.272-.595l-.066-.022c-.293-.154-.64-.244-1.009-.244-.124 0-.246.01-.364.03l.013-.002c-.248.524-.393 1.139-.393 1.788 0 .531.097 1.04.275 1.509l-.01-.029c-.785.844-1.266 1.979-1.266 3.227 0 .025 0 .051.001.076v-.004c-.001.039-.001.084-.001.13 0 .809.12 1.591.344 2.327l-.015-.057c.189.643.476 1.202.85 1.693l-.009-.013c.354.435.782.793 1.267 1.062l.022.011c.432.252.933.465 1.46.614l.046.011c.466.125 1.024.227 1.595.284l.046.004c-.431.428-.718 1-.784 1.638l-.001.012c-.207.101-.448.183-.699.236l-.021.004c-.256.051-.549.08-.85.08-.022 0-.044 0-.066 0h.003c-.394-.008-.756-.136-1.055-.348l.006.004c-.371-.259-.671-.595-.881-.986l-.007-.015c-.198-.336-.459-.614-.768-.827l-.009-.006c-.225-.169-.49-.301-.776-.38l-.016-.004-.32-.048c-.023-.002-.05-.003-.077-.003-.14 0-.273.028-.394.077l.007-.003q-.128.072-.08.184c.039.086.087.16.145.225l-.001-.001c.061.072.13.135.205.19l.003.002.112.08c.283.148.516.354.693.603l.004.006c.191.237.359.505.494.792l.01.024.16.368c.135.402.38.738.7.981l.005.004c.3.234.662.402 1.057.478l.016.002c.33.064.714.104 1.106.112h.007c.045.002.097.002.15.002.261 0 .517-.021.767-.062l-.027.004.368-.064q0 .609.008 1.418t.008.873v.014c0 .185-.08.351-.208.466h-.001c-.119.089-.268.143-.431.143-.075 0-.147-.011-.214-.032l.005.001c-4.929-1.689-8.409-6.283-8.409-11.69 0-2.268.612-4.393 1.681-6.219l-.032.058c1.094-1.871 2.609-3.386 4.422-4.449l.058-.031c1.739-1.034 3.835-1.645 6.073-1.645h.098-.005zm-7.64 17.666q.048-.112-.112-.192-.16-.048-.208.032-.048.112.112.192.144.096.208-.032zm.497.545q.112-.08-.032-.256-.16-.144-.256-.048-.112.08.032.256.159.157.256.047zm.48.72q.144-.112 0-.304-.128-.208-.272-.096-.144.08 0 .288t.272.112zm.672.673q.128-.128-.064-.304-.192-.192-.32-.048-.144.128.064.304.192.192.32.044zm.913.4q.048-.176-.208-.256-.24-.064-.304.112t.208.24q.24.097.304-.096zm1.009.08q0-.208-.272-.176-.256 0-.256.176 0 .208.272.176.256.001.256-.175zm.929-.16q-.032-.176-.288-.144-.256.048-.224.24t.288.128.225-.224z" />
    </svg>
);

const DiscordIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
    </svg>
);

const GlobeIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
);

const MailIcon = ({ size = 20 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
    </svg>
);
