/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera, MeshTransmissionMaterial, Environment, Float } from '@react-three/drei';
import { Group } from './Group';
import * as THREE from 'three';

// --- Shared Assets & Utilities (Onyx Studio Theme) ---

const NoiseOverlay = () => (
    <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
    />
);

const StudioBackdrop = () => (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-black">
        <div className="absolute inset-0 bg-[#080808]" />
        <div className="absolute inset-0 bg-radial-vignette opacity-100" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none" />
    </div>
);

const BlueprintGrid = () => (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.08]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="projectsGrid" width="120" height="120" patternUnits="userSpaceOnUse">
                    <path d="M 120 0 L 0 0 0 120" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#projectsGrid)" />
        </svg>
    </div>
);

const CustomCursor = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const moveCursor = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
            const target = e.target;
            const interactive = target.closest('.project-card') || target.closest('button') || target.closest('a');
            setIsHovering(!!interactive);
        };
        window.addEventListener("mousemove", moveCursor);
        return () => window.removeEventListener("mousemove", moveCursor);
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 w-8 h-8 rounded-full border border-white/20 pointer-events-none z-[10000] mix-blend-difference flex items-center justify-center bg-white/0"
            animate={{
                x: mousePos.x - 16,
                y: mousePos.y - 16,
                scale: isHovering ? 2.5 : 1,
                borderColor: isHovering ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.2)",
                backgroundColor: isHovering ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0)"
            }}
            transition={{ type: "spring", stiffness: 250, damping: 25, mass: 0.1 }}
        >
            <AnimatePresence>
                {isHovering && (
                    <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-[3px] font-bold uppercase tracking-[0.5em] text-white"
                        style={{ fontFamily: '"Lexend Peta", sans-serif' }}
                    >
                        ENTER
                    </motion.span>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// --- Specialized Components ---

const CounterOrb = ({ value, label, suffix = "%" }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const duration = 2000;
            const step = value / (duration / 16);
            const timer = setInterval(() => {
                start += step;
                if (start >= value) {
                    setCount(value);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);
            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (count / 100) * circumference;

    return (
        <div ref={ref} className="flex flex-col items-center gap-4">
            <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                    <circle cx="64" cy="64" r="45" stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="none" />
                    <motion.circle
                        cx="64" cy="64" r="45" stroke="#D4AF37" strokeWidth="2" fill="none"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: isInView ? offset : circumference }}
                        transition={{ duration: 2, ease: "easeOut" }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold text-white tracking-tighter" style={{ fontFamily: '"Montserrat", sans-serif' }}>{count}{suffix}</span>
                </div>
            </div>
            <span className="text-[9px] text-white/40 tracking-[0.4em] uppercase text-center max-w-[100px]" style={{ fontFamily: '"Lexend Peta", sans-serif' }}>{label}</span>
        </div>
    );
};

const ProjectCard = ({ title, data, label, visual, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="project-card relative w-full aspect-[4/5] md:aspect-[16/11] bg-white/[0.01] border border-white/5 rounded-[24px] md:rounded-[32px] overflow-hidden group backdrop-blur-3xl shadow-2xl"
        >
            <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-100 transition-opacity duration-1000">
                {visual}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />

            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 z-20">
                <div className="flex flex-col gap-4">
                    <span className="text-[#D4AF37] text-[10px] md:text-xs font-bold tracking-[0.6em] uppercase" style={{ fontFamily: '"Lexend Peta", sans-serif' }}>{label}</span>
                    <h3 className="text-white text-3xl md:text-5xl font-extralight tracking-tight" style={{ fontFamily: '"Montserrat", sans-serif' }}>{title}</h3>
                    <div className="flex items-center gap-8 mt-4">
                        {data.map((item, i) => (
                            <div key={i} className="flex flex-col">
                                <span className="text-white text-lg md:text-xl font-bold tracking-tighter" style={{ fontFamily: '"Montserrat", sans-serif' }}>{item.val}</span>
                                <span className="text-white/40 text-[8px] md:text-[9px] tracking-widest uppercase font-mono">{item.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Refraction Simulation Overlay */}
            <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-[24px] md:rounded-[32px] group-hover:border-white/20 transition-all duration-700" />
        </motion.div>
    );
};

// 3D Background - Para-refractive Asset
const Hero3DScene = () => {
    const meshRef = useRef();
    const { mouse } = useThree();

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, mouse.x * 0.2, 0.05);
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -mouse.y * 0.2, 0.05);
        meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    });

    return (
        <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
            <mesh ref={meshRef} position={[2, 0, 0]}>
                <boxGeometry args={[4, 1.2, 2.5]} />
                <meshPhysicalMaterial
                    color="#C5A028"
                    metalness={1}
                    roughness={0.2}
                    clearcoat={1}
                    reflectivity={1}
                />
            </mesh>
            <mesh position={[2, 0, 1]}>
                <planeGeometry args={[10, 10]} />
                <MeshTransmissionMaterial
                    backside
                    thickness={1}
                    roughness={0.1}
                    transmission={1}
                    samples={8}
                    resolution={256}
                    ior={1.2}
                    distortion={0.4}
                />
            </mesh>
        </Float>
    );
};

// --- Page Component ---

export const ProjectsPage = () => {
    const { scrollYProgress } = useScroll();
    const titleTracking = useTransform(scrollYProgress, [0, 0.2], ["1em", "0.2em"]);
    const titleOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

    useEffect(() => {
        // Debugging log for routing confirmation
        console.log("Projects Page Mounted");
    }, []);

    return (
        <div className="w-full bg-[#020202] text-white selection:bg-[#D4AF37] selection:text-black min-h-screen relative overflow-x-hidden cursor-none">
            <StudioBackdrop />
            <BlueprintGrid />
            <NoiseOverlay />
            <CustomCursor />

            {/* Navigation / Logo */}
            <div className="fixed top-0 left-0 w-full z-50 flex justify-center pt-8 pointer-events-none">
                <div className="pointer-events-auto">
                    <Group className="scale-75 origin-top" />
                </div>
            </div>

            {/* Step 1: Cinematic Header */}
            <section className="relative w-full h-[80vh] flex flex-col items-center justify-center px-8">
                <motion.div
                    style={{ opacity: titleOpacity }}
                    className="text-center z-10"
                >
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[#D4AF37] text-[10px] md:text-xs font-bold tracking-[1em] uppercase block mb-6"
                        style={{ fontFamily: '"Lexend Peta", sans-serif' }}
                    >
                        ARCHIVE CATALOG v2.4
                    </motion.span>
                    <motion.h1
                        style={{ letterSpacing: titleTracking }}
                        className="text-white text-6xl md:text-[140px] font-thin tracking-tighter leading-tight"
                        style={{ fontFamily: '"Montserrat", sans-serif' }}
                    >
                        SELECTED ARCHIVES
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-white/40 text-[11px] md:text-sm tracking-[0.6em] uppercase mt-8"
                        style={{ fontFamily: '"Lexend Peta", sans-serif' }}
                    >
                        2024 — 2026 Strategy & Execution
                    </motion.p>
                </motion.div>

                {/* Background 3D Accent */}
                <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 10], fov: 35 }} gl={{ powerPreference: "high-performance" }}>
                        <ambientLight intensity={0.5} />
                        <spotLight position={[10, 10, 10]} intensity={1} color="#D4AF37" />
                        <Suspense fallback={null}>
                            <Hero3DScene />
                            <Environment preset="studio" />
                        </Suspense>
                    </Canvas>
                </div>
            </section>

            {/* Step 2: Main Project - Leven Real Estate */}
            <section className="relative w-full py-32 px-4 sm:px-8 md:px-20 flex flex-col items-center">
                <div className="w-full max-w-[1400px] flex flex-col md:flex-row gap-12 md:gap-24">

                    {/* Strategy Column */}
                    <div className="w-full md:w-5/12 flex flex-col justify-center space-y-10">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-4"
                        >
                            <span className="text-[#D4AF37] text-xs font-bold tracking-[0.5em] uppercase" style={{ fontFamily: '"Lexend Peta", sans-serif' }}>LEVEN REAL ESTATE</span>
                            <h2 className="text-white text-5xl md:text-8xl font-extralight tracking-tighter leading-none" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                                Cinematic Real Estate Narrative
                            </h2>
                        </motion.div>

                        <p className="text-white/60 text-lg md:text-xl leading-relaxed font-light" style={{ fontFamily: '"Montserrat", sans-serif' }}>
                            Transforming raw property footage into high-conversion emotional assets.
                            We focused on lighting texture and rhythmic editing to increase buyer intent.
                        </p>

                        <div className="flex gap-12 pt-8">
                            <CounterOrb value={40} label="Increase in Views" />
                            <CounterOrb value={20} label="Sales Velocity" />
                        </div>
                    </div>

                    {/* Media Column */}
                    <div className="w-full md:w-7/12 aspect-[16/10] bg-white/[0.02] border border-white/10 rounded-[40px] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors duration-1000 z-10" />
                        {/* Mock Cinematic Video */}
                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black animate-pulse" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-full opacity-60 group-hover:opacity-100 transition-opacity duration-1000" style={{ backgroundImage: 'url(https://framerusercontent.com/images/1mmewAvBFU9a5XFIcaDMfJ9bL4.webp)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                        </div>

                        {/* Live Recording UI */}
                        <div className="absolute top-8 left-8 z-20 flex items-center gap-4">
                            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.8)]" />
                            <span className="text-white/60 text-[10px] font-mono tracking-[0.4em] uppercase">REC ● ONYX_LOG_4K</span>
                        </div>
                        <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-[40px]" />
                    </div>
                </div>
            </section>

            {/* Step 3: Secondary Project Grid Archive */}
            <section className="relative w-full py-32 px-4 sm:px-8 md:px-20 flex flex-col items-center">
                <div className="w-full max-w-[1400px] mb-20 text-center md:text-left">
                    <span className="text-[#D4AF37] text-xs font-bold tracking-[0.8em] uppercase block mb-4" style={{ fontFamily: '"Lexend Peta", sans-serif' }}>THE VAULT</span>
                    <h2 className="text-white text-5xl md:text-7xl font-extralight tracking-tighter" style={{ fontFamily: '"Montserrat", sans-serif' }}>Systemic Portfolios</h2>
                </div>

                <div className="w-full max-w-[1400px] grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <ProjectCard
                        index={0}
                        label="BYSON REAL ESTATE"
                        title="Social Media Architecture"
                        data={[
                            { val: "30%", desc: "Surge" },
                            { val: "50%", desc: "Traffic" }
                        ]}
                        visual={
                            <div className="w-full h-full flex flex-col justify-end p-12 opacity-40 group-hover:opacity-100 transition-opacity duration-700">
                                <div className="flex items-end gap-1 h-20">
                                    {[20, 60, 45, 90, 70, 30, 80].map((h, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            whileInView={{ height: `${h}%` }}
                                            className="w-full bg-[#D4AF37] opacity-60"
                                        />
                                    ))}
                                </div>
                            </div>
                        }
                    />
                    <ProjectCard
                        index={1}
                        label="ARCHIVISION ARCHITECTS"
                        title="SEO Strategic Ranking"
                        data={[
                            { val: "#1", desc: "Google Rank" },
                            { val: "60%", desc: "Organic Growth" }
                        ]}
                        visual={
                            <div className="w-full h-full p-20 flex items-center justify-center opacity-30 group-hover:opacity-70 transition-opacity">
                                <svg width="100%" height="100%" viewBox="0 0 200 100" fill="none">
                                    <motion.path
                                        d="M0,100 Q40,90 80,40 T160,10 L200,0"
                                        stroke="#D4AF37"
                                        strokeWidth="1"
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        transition={{ duration: 2 }}
                                    />
                                </svg>
                            </div>
                        }
                    />
                    <ProjectCard
                        index={2}
                        label="WORK4U BRAND IDENTITY"
                        title="Web Development & Logic"
                        data={[
                            { val: "80%", desc: "Dominance" },
                            { val: "60%", desc: "Lead Growth" }
                        ]}
                        visual={
                            <div className="w-full h-full flex items-center justify-center opacity-20 group-hover:opacity-50 transition-opacity p-20">
                                <div className="w-full h-full border border-white/20 rounded-xl relative">
                                    <div className="absolute top-4 left-4 w-12 h-[2px] bg-white/40" />
                                    <div className="absolute bottom-4 right-4 w-32 h-20 border border-white/20 rounded-md" />
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-[1px] bg-[#D4AF37] animate-pulse shadow-[0_0_10px_#D4AF37]" />
                                </div>
                            </div>
                        }
                    />
                    {/* Placeholder for symmetry or extra project */}
                    <div className="hidden md:flex flex-col items-center justify-center p-20 text-center opacity-20 hover:opacity-100 transition-opacity">
                        <span className="text-[10px] tracking-widest text-white/40 mb-4" style={{ fontFamily: '"Lexend Peta", sans-serif' }}>SCANNING ARCHIVES...</span>
                        <p className="text-white text-base">New connections being established weekly.</p>
                    </div>
                </div>
            </section>

            {/* Step 5: The Vault - Newsletter CTA */}
            <section className="relative w-full py-40 flex flex-col items-center px-4">
                <div className="w-full max-w-4xl text-center space-y-12">
                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-white text-5xl md:text-8xl font-thin tracking-tighter"
                        style={{ fontFamily: '"Montserrat", sans-serif' }}
                    >
                        READY TO SECURE<br />YOUR GROWTH?
                    </motion.h3>

                    <div className="flex flex-col items-center gap-8">
                        <p className="text-white/40 tracking-[0.4em] uppercase text-[10px] md:text-sm" style={{ fontFamily: '"Lexend Peta", sans-serif' }}>JOIN THE STRATEGIC INNER CIRCLE</p>
                        <div className="w-full max-w-md relative flex items-center">
                            <input
                                type="email"
                                placeholder="Communications email..."
                                className="w-full bg-transparent border-b border-white/10 py-4 text-xl font-light focus:border-[#D4AF37] outline-none transition-colors"
                            />
                            <button className="absolute right-0 bottom-4 text-[10px] text-[#D4AF37] font-bold tracking-widest uppercase hover:text-white transition-colors">ACCESS BRIEF</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Style Ticker */}
            <div className="py-20 bg-black border-t border-white/10 overflow-hidden relative opacity-20">
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10" />
                <div className="flex space-x-20 animate-marquee whitespace-nowrap text-2xl font-bold uppercase text-transparent stroke-white" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.2)" }}>
                    <span>ONYX STUDIO</span> <span>PROJECTS</span> <span>2024</span> <span>ARCHIVES</span> <span>STRATEGY</span> <span>ONYX STUDIO</span> <span>PROJECTS</span> <span>2024</span>
                </div>
            </div>

            {/* Inline CSS for Vignette */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .bg-radial-vignette {
                    background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,1) 85%);
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 20s linear infinite;
                }
            ` }} />
        </div>
    );
};
