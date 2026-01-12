import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Group } from "./Group";
import { Link } from 'react-router-dom';

// Import Assets
import cinimaticVideo from './assets/cinimatic_background.mp4';
import beforePic from './assets/before_pic.png';
import afterPic from './assets/after_pic.png';

// --- Assets & Utilities ---
const NoiseOverlay = () => (
    <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
    />
);

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const moveCursor = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
            // Check if hovering over interactive elements
            const target = e.target;
            setIsHovering(
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('.interactive-hover')
            );
        };
        window.addEventListener("mousemove", moveCursor);
        return () => window.removeEventListener("mousemove", moveCursor);
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white pointer-events-none z-[10000] mix-blend-difference flex items-center justify-center bg-white/0"
            animate={{
                x: mousePos.x - 16,
                y: mousePos.y - 16,
                scale: isHovering ? 2.5 : 1,
                borderColor: isHovering ? "rgba(255,255,255,0)" : "rgba(255,255,255,1)",
                backgroundColor: isHovering ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)"
            }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        >
            {isHovering && <span className="text-black text-[3px] font-bold uppercase tracking-widest">View</span>}
        </motion.div>
    );
};

// --- Components ---

const ServiceCard = ({ title, tagline, description, color, index, children }) => {
    return (
        <div className="md:sticky top-0 w-full md:h-screen flex items-center justify-center overflow-hidden py-20 md:py-0">
            <div
                className="relative w-full h-full flex items-center justify-center transition-colors duration-700"
                style={{ backgroundColor: color }}
            >
                {/* Glassmorphism 2.0 Card */}
                <div className="w-[92%] max-w-[1400px] h-auto md:h-[85vh] relative flex flex-col md:flex-row rounded-[24px] md:rounded-[32px] overflow-hidden
                            border border-white/10 bg-white/[0.02] backdrop-blur-[20px]
                            shadow-[0_20px_50px_rgba(0,0,0,0.5)]">

                    {/* Content Section (Left/Top) */}
                    <div className="w-full md:w-1/2 md:h-full p-8 sm:p-12 md:p-16 flex flex-col justify-center space-y-6 md:space-y-8 z-10 relative">
                        {/* Decorative 'Digital' Elements */}
                        <div className="absolute top-6 left-8 md:top-10 md:left-10 text-[9px] md:text-[10px] text-white/20 font-mono">
                            0{index + 1} / SERVICE PROFILE
                        </div>

                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2
                                className="text-white text-4xl sm:text-5xl md:text-7xl font-extralight tracking-tight mb-2 leading-tight"
                                style={{ fontFamily: '"Montserrat", sans-serif' }}
                            >
                                {title}
                            </h2>
                            <div className="w-16 md:w-24 h-[1px] bg-gradient-to-r from-[#D4AF37] to-transparent" />
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-[#D4AF37] text-sm md:text-xl font-medium tracking-[0.15em] md:tracking-[0.2em] uppercase"
                        >
                            {tagline}
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-white/70 text-base md:text-lg leading-relaxed max-w-lg font-light"
                        >
                            {description}
                        </motion.p>
                    </div>

                    {/* Interactive Visual Section (Right/Bottom) */}
                    <div className="w-full md:w-1/2 h-[350px] sm:h-[450px] md:h-full relative border-t md:border-t-0 md:border-l border-white/5 overflow-hidden group interactive-hover">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

// 1. Web Design Visual (Enhanced)
const WebDesignVisual = () => {
    return (
        <div className="w-full h-full flex items-center justify-center perspective-[2000px] bg-gradient-to-br from-black to-[#050505] p-6">
            <motion.div
                className="w-full max-w-[500px] aspect-[16/10] bg-[#0a0a0a] rounded-xl border border-white/10 shadow-2xl relative overflow-hidden"
                style={{ transformStyle: "preserve-3d" }}
                whileHover={{ rotateY: -15, rotateX: 10, scale: 1.05 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
                {/* Browser Interface */}
                <div className="h-8 border-b border-white/5 flex items-center space-x-3 px-4 bg-black/40 backdrop-blur-md absolute top-0 w-full z-10">
                    <div className="flex space-x-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    </div>
                </div>

                {/* Content Image */}
                <div className="w-full h-full pt-8">
                    <img
                        src="https://framerusercontent.com/images/1mmewAvBFU9a5XFIcaDMfJ9bL4.webp"
                        className="w-full h-full object-cover"
                        alt="Web Design Showcase"
                    />
                </div>

                {/* Floating Elements (Glassmorphism Layers) */}
                <motion.div
                    className="absolute -right-12 -bottom-12 w-[140px] h-[240px] bg-black/60 border border-white/20 rounded-[24px] backdrop-blur-xl shadow-2xl z-20 flex flex-col items-center justify-center"
                    transformTemplate={(_, generated) => `translateZ(80px) ${generated}`}
                >
                    <p className="text-white/40 font-mono text-xs rotate-90">MOBILE</p>
                </motion.div>
            </motion.div>
        </div>
    )
}

// 2. Photo/Video Visual (Video Loop)
const PhotoVideoVisual = () => {
    return (
        <div className="w-full h-full relative group">
            {/* Background Video */}
            <div className="absolute inset-0">
                <video
                    className="w-full h-full object-cover opacity-60 transition-opacity duration-700 group-hover:opacity-100"
                    autoPlay loop muted playsInline
                    src={cinimaticVideo}
                />
            </div>

            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-700" />

            {/* Lens UI Overlay */}
            <motion.div
                className="absolute inset-0 pointer-events-none flex items-center justify-center"
                initial={{ opacity: 0.5, scale: 0.9 }}
                whileHover={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="w-[80%] h-[80%] border border-white/30 rounded-lg relative">
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white" />

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/80 font-mono text-xs tracking-[0.5em] uppercase">
                        REC [●] 00:04:22
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

// 3. Editing Before/After (Enhanced)
const EditingVisual = () => {
    const containerRef = useRef(null);
    const [sliderPos, setSliderPos] = useState(50);

    const handleMove = (clientX) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const newPos = ((clientX - rect.left) / rect.width) * 100;
        setSliderPos(Math.min(Math.max(newPos, 0), 100));
    };

    const handleMouseMove = (e) => handleMove(e.clientX);
    const handleTouchMove = (e) => handleMove(e.touches[0].clientX);

    return (
        <div
            className="w-full h-full relative select-none cursor-col-resize overflow-hidden"
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
        >
            {/* After Image */}
            <div className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${afterPic})` }}>
                <div className="absolute top-6 right-6 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-xs font-mono text-green-400">FINAL GRADE</div>
            </div>

            {/* Before Image */}
            <motion.div
                className="absolute inset-0 bg-cover bg-center border-r border-white/50"
                style={{
                    backgroundImage: `url(${beforePic})`,
                    width: `${sliderPos}%`
                }}
            >
                <div className="absolute top-6 left-6 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-xs font-mono text-white/60">RAW LOG</div>
            </motion.div>

            {/* Slider Handle with 'Visual Haptics' */}
            <div className="absolute top-0 bottom-0 w-[1px] bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)] z-20" style={{ left: `${sliderPos}%` }}>
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-white/10 backdrop-blur-md border border-white/40 rounded-full flex items-center justify-center shadow-2xl">
                    <div className="w-1.5 h-8 bg-white/80 rounded-full" />
                </div>
            </div>
        </div>
    )
}

// 4. Lead Gen Grid (Bento Layout)
const LeadGenVisual = ({ inView }) => {
    return (
        <div className="w-full h-full bg-[#080808] p-4 sm:p-8 flex flex-col gap-4">
            {/* Top Row: Big Number & Chart */}
            <div className="flex-1 flex flex-col sm:flex-row gap-4">
                {/* Kinetic Number Card */}
                <div className="w-full sm:w-2/3 bg-white/[0.03] rounded-2xl border border-white/10 p-6 flex flex-col justify-between group hover:bg-white/[0.05] transition-colors">
                    <div className="text-white/40 font-mono text-[10px] uppercase tracking-widest">Growth Velocity</div>
                    <div className="flex items-end gap-2">
                        <span className="text-6xl sm:text-7xl md:text-8xl font-bold text-white tracking-tighter leading-none">
                            {inView ? <CountingNumber target={850} /> : "0"}
                        </span>
                        <span className="text-2xl sm:text-3xl md:text-4xl text-[#D4AF37] mb-2 font-bold">%</span>
                    </div>
                </div>

                {/* Mini Graph Card */}
                <div className="w-full sm:w-1/3 bg-gradient-to-br from-[#D4AF37]/20 to-black rounded-2xl border border-white/10 p-4 flex items-end relative overflow-hidden min-h-[120px]">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <svg className="w-full h-1/2 overflow-visible" preserveAspectRatio="none">
                        <path d="M0,50 L20,40 L40,45 L60,10 L80,20 L100,5" stroke="white" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
                        <path d="M0,50 L20,40 L40,45 L60,10 L80,20 L100,5 L100,100 L0,100 Z" fill="url(#grad)" opacity="0.4" />
                        <defs>
                            <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="white" />
                                <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>

            {/* Bottom Row: CTA & Details */}
            <div className="h-24 flex gap-4">
                <div className="flex-1 bg-white/[0.03] rounded-2xl border border-white/10 flex items-center justify-between px-6 hover:border-[#D4AF37]/50 transition-colors cursor-pointer group">
                    <span className="text-white font-medium">View Case Study</span>
                    <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </div>
                </div>
                <div className="w-48 bg-[#0a0a0a] rounded-2xl border border-white/5 flex items-center justify-center">
                    <span className="text-xs text-white/30 font-mono">EST. 2026</span>
                </div>
            </div>
        </div>
    )
}

// Utility Component for Animated Numbers
const CountingNumber = ({ target }) => {
    const { scrollYProgress } = useScroll(); // Just to trigger rerender if needed, or simple Interval
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 2000;
        const stepTime = 20;
        const increment = target / (duration / stepTime);

        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, [target]);

    return <>{count}</>;
};

export const ServicesPage = () => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({ container: containerRef });

    // Header expansion effect
    const headerTracking = useTransform(scrollYProgress, [0, 0.2], ["-0.05em", "0.2em"]);

    return (
        <div className="w-full bg-[#020202] relative cursor-none" ref={containerRef}>
            <NoiseOverlay />
            <CustomCursor />

            {/* Fixed Navbar similar to Frame but static */}
            <div className="fixed top-0 left-0 w-full z-50 flex justify-center py-6 pointer-events-none">
                <div className="pointer-events-auto w-full flex justify-center">
                    <Group />
                </div>
            </div>

            {/* Intro / Hero of Services */}
            <div className="h-[50vh] md:h-[70vh] flex flex-col items-center justify-center relative overflow-hidden px-2 pt-20 pb-20">
                <motion.h1
                    className="text-white text-[11vw] sm:text-[80px] md:text-[120px] font-thin leading-none z-10 mix-blend-difference text-center w-full break-normal whitespace-nowrap"
                    style={{
                        fontFamily: '"Clesmont", sans-serif',
                        letterSpacing: headerTracking
                    }}
                >
                    EXPERTISE
                </motion.h1>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-400 mt-2 tracking-[0.5em] uppercase text-[10px] md:text-xs z-10 text-center"
                >
                    Beyond Boundaries
                </motion.div>

                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-10 animate-bounce text-white/20 text-xs tracking-widest uppercase">
                    Scroll to Explore
                </div>
            </div>

            {/* Sticky Cards Stacking */}
            <ServiceCard
                title="Web Design"
                tagline="Aesthetic meets Performance"
                description="We build sites that don't just look good—they work. Custom coded, fast, and converting layouts for the modern web."
                color="#020202"
                index={0}
            >
                <WebDesignVisual />
            </ServiceCard>

            <ServiceCard
                title="Media"
                tagline="Visual Storytelling"
                description="We capture the soul of your brand in 4K. Cinematography and photography that moves audiences and tells your truth."
                color="#050505"
                index={1}
            >
                <PhotoVideoVisual />
            </ServiceCard>

            <ServiceCard
                title="Editing"
                tagline="Precision Cuts"
                description="Turning raw footage into masterpieces. Color grading, sound design, and narrative flow that keeps eyes glued to the screen."
                color="#080808"
                index={2}
            >
                <EditingVisual />
            </ServiceCard>

            <ServiceCard
                title="Lead Gen"
                tagline="ROI Driven"
                description="Turning your traffic into a predictable revenue stream. Data-backed strategies that scale your business efficiently."
                color="#030303"
                index={3}
            >
                <LeadGenVisual inView={true} />
            </ServiceCard>

            {/* Social Proof Ticker */}
            <div className="py-12 md:py-20 bg-black border-t border-white/10 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10" />
                <div className="flex space-x-12 md:space-x-20 animate-marquee whitespace-nowrap opacity-30 text-2xl md:text-4xl font-bold uppercase text-transparent stroke-white" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.2)" }}>
                    <span>Google</span> <span>Nike</span> <span>Spotify</span> <span>Tesla</span> <span>Adobe</span> <span>Google</span> <span>Nike</span> <span>Spotify</span> <span>Tesla</span> <span>Adobe</span>
                </div>
            </div>
        </div>
    );
};
