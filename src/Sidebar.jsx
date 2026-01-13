export const Sidebar = () => {
    return (
        <div className="absolute top-0 left-0 w-[302px] h-full z-20">
            {/* WORK4 U Title */}
            <div className="absolute top-[380px] left-[55px] origin-top-left -rotate-90">
                <h1
                    className="text-white text-[96px] leading-none whitespace-nowrap font-normal"
                    style={{ fontFamily: '"Satisfy", cursive' }}
                >
                    Work4U
                </h1>
            </div>

            {/* DIGITAL AGENCY Subtitle */}
            <div className="absolute top-[380px] left-[150px] origin-top-left -rotate-90">
                <h2
                    className="text-white text-[18px] tracking-[0.6em] font-light uppercase whitespace-nowrap"
                    style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                    DIGITAL AGENCY
                </h2>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-[240px] left-[55px] w-[200px] flex flex-col gap-6">
                <p
                    className="text-[#cccccc] text-[13px] leading-relaxed font-light"
                    style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                    By reaching out to connect with us you are taking the first step towards unlocking the full potential to your brand
                </p>

                {/* Social Icons */}
                <div className="flex items-center gap-6 bg-white/[0.08] backdrop-blur-md rounded-full px-7 py-3 w-fit border border-white/20 shadow-lg pointer-events-auto">
                    {/* X (Twitter) */}
                    <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white hover:scale-125 active:scale-90 transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                    </a>

                    {/* Instagram */}
                    <a href="https://www.instagram.com/we.work4u.services/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white hover:scale-125 active:scale-90 transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                    </a>

                    {/* LinkedIn */}
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white hover:scale-125 active:scale-90 transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                            <rect x="2" y="9" width="4" height="12"></rect>
                            <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
};
