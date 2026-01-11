export const ContactButton = () => {
    return (
        <div className="w-[296px] h-[93px] relative group cursor-pointer z-50">
            <div className="absolute w-full h-full top-0 left-0 bg-black/90 rounded-[50px] border-[3px] border-solid border-white flex items-center justify-center transition-all duration-300 group-hover:scale-105 active:scale-95 group-active:scale-95 backdrop-blur-sm group-hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] group-hover:border-white/100">
                <span
                    className="text-white text-[24px] font-normal tracking-wide"
                    style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                    Contact Us
                </span>
            </div>
        </div>
    );
};
