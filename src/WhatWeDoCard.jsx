export const WhatWeDoCard = () => {
    return (
        <div className="w-[286px] h-[195px] relative">
            {/* Glass Background */}
            <div className="absolute w-full h-full top-0 left-0 bg-[#ffffff10] rounded-[40px] backdrop-blur-[20px] border border-white/20 shadow-xl" />

            {/* Content */}
            <div className="absolute w-full h-full top-0 left-0 flex flex-col justify-center px-8 z-10">
                <h3
                    className="text-white text-[28px] font-normal mb-2"
                    style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                    What we do ?
                </h3>
                <p
                    className="text-white text-[13px] font-light leading-relaxed opacity-90"
                    style={{ fontFamily: '"Montserrat", sans-serif' }}
                >
                    We specialize in creating dynamic experience tailored to your brands needs
                </p>
            </div>
        </div>
    );
};
