export const TransformCard = () => {
    return (
        <div className="w-[547px] h-[89px] relative group cursor-pointer">
            {/* Background with subtle glass effect and rounded corners */}
            <div className="absolute w-full h-full top-0 left-0 bg-black/90 rounded-[50px] border-[3px] border-solid border-white flex items-center justify-between px-3 pl-10 z-10 box-border backdrop-blur-sm transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] group-active:scale-95">

                <span
                    className="text-white text-[20px] font-normal tracking-wide flex-1 text-left"
                    style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                    Lets Transform Your Digital Presence
                </span>

                {/* Interactive Blue Circle Button */}
                <button className="w-[68px] h-[68px] bg-[#5BC0EB] rounded-full flex items-center justify-center cursor-pointer hover:scale-110 active:scale-90 transition-all duration-300 shadow-[0_0_25px_rgba(91,192,235,0.4)] border-none outline-none group-hover:bg-[#4ab3de]">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </button>
            </div>
        </div>
    )
}
