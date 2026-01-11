import expertProfile from "./assets/expert_profile.png";

export const ConnectExpertsCard = () => {
    return (
        <div className="w-[286px] h-[100px] relative group cursor-pointer">
            {/* Glass Background */}
            <div className="absolute w-full h-full top-0 left-0 bg-[#ffffff10] rounded-[40px] backdrop-blur-[20px] border border-white/20 shadow-xl transition-all duration-300 group-hover:bg-[#ffffff20] group-hover:scale-[1.05] group-hover:border-white/40 group-active:scale-95 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]" />

            {/* Content */}
            <div className="absolute w-full h-full top-0 left-0 flex items-center px-4 z-10 transition-transform duration-300 group-hover:scale-[1.05] group-active:scale-95">
                {/* Profile Image */}
                <div className="w-[70px] h-[70px] rounded-full overflow-hidden border-2 border-white/50 bg-gray-800 transition-all duration-300 group-hover:border-white">
                    <img
                        src={expertProfile}
                        alt="Expert"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Text */}
                <div className="flex-1 ml-4">
                    <p
                        className="text-white text-[14px] font-normal leading-tight"
                        style={{ fontFamily: '"Montserrat", sans-serif' }}
                    >
                        Connect with our<br />Experts
                    </p>
                </div>

                {/* Up-Right Arrow Icon */}
                <div className="text-white opacity-80 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7"></line>
                        <polyline points="7 7 17 7 17 17"></polyline>
                    </svg>
                </div>
            </div>
        </div>
    );
};
