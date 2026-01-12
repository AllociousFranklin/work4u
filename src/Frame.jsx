import { useState, useEffect } from "react";
import { Box } from "./Box";
import { TransformCard } from "./TransformCard";
import { Group } from "./Group";
import { WhatWeDoCard } from "./WhatWeDoCard";
import { ConnectExpertsCard } from "./ConnectExpertsCard";
import { WeBuildDigital } from "./WeBuildDigital";
import { FromWebDesignAnd } from "./FromWebDesignAnd";
import { ContactButton } from "./ContactButton";
import { Sidebar } from "./Sidebar";

export const Frame = () => {
    const [dims, setDims] = useState({ width: 1280, height: 820, scale: 1 });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);

            if (!mobile) {
                const baseW = 1280;
                const baseH = 820;
                const scale = Math.min(window.innerWidth / baseW, window.innerHeight / baseH);
                setDims({
                    width: window.innerWidth / scale,
                    height: window.innerHeight / scale,
                    scale
                });
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (isMobile) {
        return (
            <div className="bg-[#020202] w-full min-h-screen flex flex-col items-center gap-8 pt-8 pb-32 px-4 relative overflow-x-hidden">
                {/* Noise and Background Shared */}
                <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.05] mix-blend-overlay"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                />

                <Group />

                {/* Mobile Header with Nav */}
                <div className="w-full flex flex-col items-center gap-6 z-10 animate-slide-left">
                    <div className="w-full flex justify-start px-2">
                        <h1 className="text-white text-3xl font-normal" style={{ fontFamily: '"Satisfy", cursive' }}>Work4U</h1>
                    </div>
                    <ContactButton className="w-[160px] h-[50px]" />
                </div>


                {/* Video / Hero Area - Native Sizing */}
                <div className="w-full flex justify-center items-center py-4 animate-float-bottom [animation-delay:400ms] z-10">
                    <div className="relative w-full max-w-[340px] aspect-[1.5/1]">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.35]">
                            <Box className="relative top-0 left-0" />
                        </div>
                    </div>
                </div>

                {/* Main Text Content - Centered */}
                <div className="w-full flex flex-col items-center text-center gap-6 animate-float-bottom [animation-delay:800ms] z-10">
                    <div className="w-full flex justify-center">
                        <WeBuildDigital className="mx-auto text-center scale-90" />
                    </div>
                    <div className="w-full max-w-[320px] flex justify-center">
                        <FromWebDesignAnd className="text-center mx-auto" />
                    </div>
                </div>

                {/* Cards Container - Stacked and Centered */}
                <div className="w-full flex flex-col items-center gap-6 animate-float-bottom [animation-delay:1200ms] z-10">
                    <TransformCard className="w-full max-w-[350px] h-[89px]" />
                    <WhatWeDoCard className="w-full max-w-[300px] h-[195px]" />
                    <ConnectExpertsCard className="w-full max-w-[300px] h-[100px]" />
                </div>

                {/* Agency Text for Mobile */}
                <div className="w-full flex justify-center mt-4 animate-float-bottom [animation-delay:1600ms] z-10">
                    <p className="text-[#666] text-[10px] tracking-[0.4em] uppercase" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                        Digital Agency
                    </p>
                </div>

                {/* Fixed Social Bar */}
                <div className="fixed bottom-0 left-0 w-full p-4 flex justify-center bg-black/80 backdrop-blur-xl border-t border-white/10 z-[100]">
                    <SidebarMobileSocials />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#020202] w-screen h-screen overflow-hidden">
            <title>Work4U | Digital Agency</title>

            <div
                className="relative bg-[#020202] origin-top-left shadow-2xl"
                style={{
                    transform: `scale(${dims.scale})`,
                    width: `${dims.width}px`,
                    height: `${dims.height}px`
                }}
            >
                {/* Desktop Version Content */}
                <div className="absolute top-0 left-0 h-full pointer-events-none animate-slide-left">
                    <Sidebar />
                </div>

                <div className="absolute top-[58px] left-[302px]">
                    <Box />
                </div>

                <div className="absolute top-[25px] left-[250px] xl:left-[366px] z-10 w-[920px] animate-float-bottom [animation-delay:1600ms]">
                    <Group />
                </div>

                <div className="absolute top-[25px] xl:top-[52px] left-[20px] xl:left-auto xl:right-[162px] z-50 animate-slide-right [animation-delay:800ms]">
                    <ContactButton />
                </div>

                <div className="absolute top-[340px] right-[179px] z-20 flex flex-col gap-6 animate-float-bottom [animation-delay:4000ms]">
                    <WhatWeDoCard />
                    <ConnectExpertsCard />
                </div>

                <div className="absolute top-[230px] left-[340px] z-20 pointer-events-none animate-float-bottom [animation-delay:2400ms]">
                    <WeBuildDigital />
                </div>

                <div className="absolute top-[500px] left-[340px] z-20 animate-float-bottom [animation-delay:4800ms]">
                    <FromWebDesignAnd />
                </div>

                <div className="absolute bottom-[58px] left-[65px] z-20 animate-slide-left [animation-delay:3200ms]">
                    <TransformCard />
                </div>
            </div>
        </div>
    );
};

const SidebarMobileSocials = () => {
    return (
        <div className="flex items-center gap-10 px-6 py-1">
            <a href="#" className="text-white hover:text-white hover:scale-125 transition-all"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg></a>
            <a href="#" className="text-white hover:text-white hover:scale-125 transition-all"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a>
            <a href="#" className="text-white hover:text-white hover:scale-125 transition-all"><svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>
        </div>
    )
}
