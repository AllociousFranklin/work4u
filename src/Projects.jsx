/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, useMotionValue, animate } from 'framer-motion';
import { Group } from './Group';
import { CustomCursor } from './CustomCursor';
import SEO from "./SEO";

// --- Shared Assets ---

const OnyxBackground = () => (
    <div className="fixed inset-0 z-[-1] bg-[#050505]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000000_100%)] opacity-80" />
        <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
    </div>
);

// --- Components ---

const DataStat = ({ value, label, delay }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const numberPart = value.match(/\d+/)?.[0] || 0;
    const suffix = value.replace(/\d+/, '');
    const prefix = value.startsWith('#') ? '#' : '';
    const cleanSuffix = suffix.replace('#', '');

    // Animate when in view
    React.useEffect(() => {
        if (isInView) {
            const controls = animate(0, parseInt(numberPart), {
                duration: 2.5,
                ease: [0.22, 1, 0.36, 1],
                onUpdate: value => {
                    if (ref.current) {
                        ref.current.textContent = (prefix + Math.floor(value) + cleanSuffix);
                    }
                }
            });
            return () => controls.stop();
        }
    }, [isInView, numberPart, prefix, cleanSuffix]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay, duration: 1.0 }}
            className="flex flex-col"
        >
            <span ref={ref} className="text-4xl md:text-5xl font-light text-white tracking-tight" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                0{cleanSuffix}
            </span>
            <span className="text-[10px] md:text-xs text-[#D4AF37] uppercase tracking-[0.2em] mt-2 font-bold" style={{ fontFamily: '"Lexend Peta", sans-serif' }}>
                {label}
            </span>
        </motion.div>
    );
};

const ProjectCaseStudy = ({ index, category, title, description, stats, mediaUrl, youtubeId, videoSrc, alignRight, isActive }) => {
    const containerRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    // Determine mobile state
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Local in-view detection for mobile
    const isInternalInView = useInView(containerRef, { amount: 0.25 });

    // Decide playback: Desktop uses parent isActive, Mobile uses local in-view
    const shouldPlay = isMobile ? isInternalInView : isActive;

    return (
        <section ref={containerRef} className="w-full md:h-screen md:sticky md:top-0 flex flex-col items-center justify-center relative bg-[#050505] border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-0">
            <div className={`w-full max-w-7xl px-6 md:px-12 flex flex-col lg:flex-row ${alignRight ? 'lg:flex-row-reverse' : ''} gap-16 items-center`}>

                {/* Content Side */}
                <motion.div
                    initial={{ opacity: 0, x: alignRight ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full lg:w-1/2 flex flex-col space-y-8"
                >
                    <div className="flex flex-col gap-2">
                        <span className="text-[#D4AF37] text-xs font-bold tracking-[0.4em] uppercase" style={{ fontFamily: '"Lexend Peta", sans-serif' }}>
                            CASE STUDY 0{index + 1} — {category}
                        </span>
                        <h2 className="text-white text-4xl md:text-6xl font-light leading-tight" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                            {title}
                        </h2>
                    </div>

                    <div className="w-20 h-[1px] bg-white/20" />

                    <p className="text-white/70 text-base md:text-lg leading-relaxed font-light whitespace-pre-line" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                        {description}
                    </p>

                    <div className="grid grid-cols-2 gap-8 pt-4">
                        {stats.map((s, i) => (
                            <DataStat key={i} value={s.value} label={s.label} delay={0.2 + (i * 0.1)} />
                        ))}
                    </div>

                    <button className="w-fit text-white text-xs tracking-[0.2em] uppercase border-b border-[#D4AF37] pb-1 hover:text-[#D4AF37] transition-colors mt-4">
                        View Full Case Study
                    </button>
                </motion.div>

                {/* Media Side */}
                <div className="w-full lg:w-1/2">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full aspect-video bg-zinc-900 rounded-xl overflow-hidden border border-white/10 relative group shadow-2xl"
                    >
                        {(shouldPlay && youtubeId) ? (
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=0&loop=1&playlist=${youtubeId}&controls=0&showinfo=0&modestbranding=1`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="absolute inset-0 w-full h-full object-cover"
                            ></iframe>
                        ) : (shouldPlay && videoSrc) ? (
                            <video
                                className="absolute inset-0 w-full h-full object-cover"
                                autoPlay
                                loop
                                muted
                                playsInline
                                src={videoSrc}
                            />
                        ) : (
                            <>
                                {/* Placeholder for Video/Image */}
                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                    style={{ backgroundImage: `url(${mediaUrl})` }}
                                />
                                {/* Overlay Gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                {/* Play Button / Action Indicator */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform cursor-pointer">
                                        <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[12px] border-l-white border-b-[6px] border-b-transparent ml-1" />
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>

            </div>
        </section>
    );
};

export const ProjectsPage = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const h = window.innerHeight;
            // Use slightly closer threshold (e.g. 0.4) to trigger earlier or ensure previous stops
            const scrollPos = window.scrollY + (h * 0.5);
            const index = Math.floor(scrollPos / h);
            setActiveIndex(index);
        };
        window.addEventListener('scroll', handleScroll);
        // Initial call
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="w-full bg-[#050505] min-h-screen text-white relative selection:bg-[#D4AF37] selection:text-black">
            <SEO
                title="Elite Projects & Case Studies"
                description="View our portfolio of high-performance digital executions, including professional video editing, strategic social media, and elite branding."
            />
            <CustomCursor />
            <OnyxBackground />

            {/* Navbar Placeholder */}
            <div className="fixed top-0 left-0 w-full z-50 flex justify-center pt-8 pointer-events-none">
                <div className="pointer-events-auto">
                    <Group className="scale-75 origin-top" />
                </div>
            </div>

            {/* Page Hero */}
            <section className="min-h-screen w-full flex flex-col items-center justify-center text-center px-6 md:sticky md:top-0 bg-[#050505] z-0">
                <motion.span
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    className="text-[#D4AF37] text-xs font-bold tracking-[0.6em] uppercase mb-6"
                    style={{ fontFamily: '"Lexend Peta", sans-serif' }}
                >
                    SELECTED WORKS
                </motion.span>
                <motion.h1
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                    className="text-5xl md:text-8xl font-thin tracking-tighter mb-8"
                    style={{ fontFamily: '"Clesmont", sans-serif' }}
                >
                    STRATEGIC<br />ARCHIVES
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/50 text-xs md:text-sm tracking-[0.3em] uppercase max-w-lg leading-loose"
                    style={{ fontFamily: '"Lexend Peta", sans-serif' }}
                >
                    A collection of high-performance digital executions.
                </motion.p>
            </section>

            {/* Projects List - Clean Vertical Scroll */}
            {/* 1. Video Editing */}
            <ProjectCaseStudy
                isActive={activeIndex === 1}
                index={0}
                category="VIDEO EDITING"
                title="Leven Real Estate"
                description={`Transforming raw footage into high-conversion emotional assets. We specialize in rhythmic editing and precision color grading to align property listings with luxury brand goals.
                    
                    The result is a narrative that increases buyer intent.`}
                stats={[
                    { value: "40%", label: "Increase in Views" },
                    { value: "20%", label: "Sales Velocity" }
                ]}
                youtubeId="x_XKCNiBEVM"
                mediaUrl="" // Fallback or unused
                alignRight={false}
            />

            {/* 2. Social Media */}
            <ProjectCaseStudy
                isActive={activeIndex === 2}
                index={1}
                category="SOCIAL MEDIA"
                title="Byson Real Estate"
                description={`Orchestrating comprehensive digital strategies that elevate brand visibility. We helped Razor Sharp Barbershop grow its clientele through targeted content and community engagement.`}
                stats={[
                    { value: "30%", label: "New Bookings" },
                    { value: "50%", label: "Traffic Hike" }
                ]}
                youtubeId="H4wjjXOWrgE"
                mediaUrl=""
                alignRight={true}
            />

            {/* 3. SEO */}
            <ProjectCaseStudy
                isActive={activeIndex === 3}
                index={2}
                category="LEAD GENERATION"
                title="ArchiVision Architects"
                description={`Achieving top-tier rankings through strategic SEO and data-backed lead capture. We positioned ArchiVision as the #1 authority in their niche.`}
                stats={[
                    { value: "60%", label: "Organic Traffic" },
                    { value: "#1", label: "Page Rank" }
                ]}
                youtubeId="XhwemRc9_28"
                mediaUrl=""
                alignRight={false}
            />

            {/* 4. Web Design */}
            <ProjectCaseStudy
                isActive={activeIndex === 4}
                index={3}
                category="WEB DESIGN"
                title="Work4U Internal"
                description={`A deep dive into high-fidelity user experiences. We built a platform where aesthetic meets performance, turning passive traffic into predictable revenue.`}
                stats={[
                    { value: "80%", label: "Keywords Ranked" },
                    { value: "60%", label: "Lead Growth" }
                ]}
                youtubeId="IkrOdcF-hN0"
                mediaUrl=""
                alignRight={true}
            />

            {/* Elite Footer CTA */}
            <section className="w-full min-h-screen md:sticky md:top-0 flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-[#050505] to-black z-10 relative">
                <span className="text-[#D4AF37] text-xs font-bold tracking-[0.4em] uppercase mb-8" style={{ fontFamily: '"Lexend Peta", sans-serif' }}>THE INNER CIRCLE</span>
                <h2 className="text-4xl md:text-6xl font-thin tracking-tight text-white mb-12" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                    READY TO SECURE<br />YOUR GROWTH?
                </h2>

                <div className="w-full max-w-md relative group">
                    <input
                        type="email"
                        placeholder="Enter your email..."
                        className="w-full bg-transparent border-b border-white/20 py-4 text-center text-xl text-white outline-none focus:border-[#D4AF37] transition-colors font-light placeholder:text-white/20"
                    />
                    <button className="absolute right-0 bottom-4 text-[#D4AF37] text-xs uppercase tracking-widest font-bold opacity-50 group-hover:opacity-100 transition-opacity">
                        JOIN
                    </button>
                </div>
            </section>

        </div>
    );
};
