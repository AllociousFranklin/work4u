/* eslint-disable react/no-unknown-property */
import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, PerspectiveCamera, MeshTransmissionMaterial, Environment } from '@react-three/drei';
import { Group } from './Group';
import * as THREE from 'three';

// --- Assets & Utilities ---

// 1. Studio Texture: Heavy Film Grain
const NoiseOverlay = () => (
    <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.05] mix-blend-overlay"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
    />
);

const CustomCursor = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const moveCursor = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
            const target = e.target;
            const interactive = target.closest('button') || target.closest('a') || target.closest('input') || target.closest('.interactive');
            setIsHovering(!!interactive);
        };
        window.addEventListener("mousemove", moveCursor);
        return () => window.removeEventListener("mousemove", moveCursor);
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 w-6 h-6 rounded-full border border-white/20 pointer-events-none z-[10000] mix-blend-difference flex items-center justify-center bg-white/0"
            animate={{
                x: mousePos.x - 12,
                y: mousePos.y - 12,
                scale: isHovering ? 2 : 1,
                borderColor: isHovering ? "rgba(255,255,255,0)" : "rgba(255,255,255,0.2)",
                backgroundColor: isHovering ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)"
            }}
            transition={{ type: "spring", stiffness: 250, damping: 25, mass: 0.1 }}
        >
            {isHovering && <div className="w-1 h-1 bg-black rounded-full" />}
        </motion.div>
    );
};

// 2. Blueprint Grid: Interactive Non-Uniform
const BlueprintGrid = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="grid" width="120" height="120" patternUnits="userSpaceOnUse">
                        <path d="M 120 0 L 0 0 0 120" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1" />
                        <circle cx="0" cy="0" r="1" fill="#D4AF37" opacity="0.2" />
                    </pattern>
                    <pattern id="subgrid" width="30" height="30" patternUnits="userSpaceOnUse">
                        <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.2" opacity="0.05" />
                    </pattern>
                    <radialGradient id="gridGradient" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                    </radialGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#subgrid)" />
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Dynamic Mouse Glow */}
                <motion.circle
                    cx={mouseX}
                    cy={mouseY}
                    r="300"
                    fill="url(#gridGradient)"
                    style={{ mixBlendMode: 'screen' }}
                />
            </svg>
        </div>
    );
};

// 3. Studio Backdrop: Physical Matte Vignette
const StudioBackdrop = () => (
    <div className="fixed inset-0 z-[-1] pointer-events-none bg-black">
        <div className="absolute inset-0 bg-[#080808]" />
        <div className="absolute inset-0 bg-radial-vignette opacity-100" />
        {/* Subtle Matte Floor Reflection */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none" />
    </div>
);

// 4. Kinetic Typography: Engraved Snap Reveal
const KineticText = ({ text, className, style, delay = 0 }) => {
    const letters = text.split("");
    return (
        <h3 className={className} style={style}>
            {letters.map((char, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, x: 20, filter: 'blur(10px)', letterSpacing: "1em" }}
                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)', letterSpacing: "normal" }}
                    transition={{
                        duration: 1.2,
                        delay: delay + (i * 0.03),
                        ease: [0.16, 1, 0.3, 1]
                    }}
                    className="inline-block"
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </h3>
    );
};

// --- 3. Material: Heavy Gold Ingot & Lens ---
const GoldIngot = ({ isSuccess, isTyping }) => {
    const meshRef = useRef();
    const { viewport, mouse } = useThree();

    useFrame((state, delta) => {
        if (!meshRef.current) return;

        const targetRotY = isSuccess ? state.clock.getElapsedTime() * 2 : mouse.x * 0.15;
        const targetRotX = isSuccess ? 0 : -mouse.y * 0.15;
        const targetZ = isSuccess ? 8 : -2; // Start deeper behind glass

        meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.03);
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.03);
        meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.03);

        if (!isSuccess) {
            meshRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.03;
        }
    });

    return (
        <group>
            <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
                <mesh ref={meshRef}>
                    <boxGeometry args={[4.5, 1.4, 2.8]} />
                    <meshPhysicalMaterial
                        color="#C5A028" // Deeper, more expensive gold
                        metalness={1}
                        roughness={0.25} // Heavier brushed look
                        emissive="#D4AF37"
                        emissiveIntensity={isTyping ? 0.3 : 0.05}
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                        reflectivity={1}
                    />
                </mesh>
            </Float>

            {/* Architectural Glass Layer (Lens Effect) */}
            <mesh position={[0, 0, 2]}>
                <planeGeometry args={[viewport.width * 2, viewport.height * 2]} />
                <MeshTransmissionMaterial
                    backside
                    samples={10}
                    resolution={512}
                    thickness={1.5}
                    roughness={0.1}
                    transmission={1}
                    ior={1.2}
                    chromaticAberration={0.06}
                    anisotropy={0.1}
                    distortion={0.5}
                    distortionScale={0.5}
                    temporalDistortion={0.1}
                    clearcoat={1}
                    attenuationDistance={0.5}
                    attenuationColor="#ffffff"
                    color="#ffffff"
                />
            </mesh>
        </group>
    );
};

// --- Form Components ---

const FloatingField = ({ label, value, onChange, placeholder, onKeyDown, autoFocus }) => {
    const [isFocused, setIsFocused] = useState(false);
    return (
        <div className="relative w-full max-w-3xl mb-10 md:mb-16">
            <label className={`block text-[10px] md:text-[11px] font-medium tracking-[0.6em] md:tracking-[0.8em] uppercase transition-all duration-500 mb-4 md:mb-6 ${isFocused || value ? 'opacity-100 text-[#D4AF37]' : 'opacity-0'}`} style={{ fontFamily: '"Lexend Peta", sans-serif' }}>
                {label}
            </label>
            <input
                type="text"
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={onKeyDown}
                placeholder={placeholder}
                autoFocus={autoFocus}
                className="w-full bg-transparent border-b border-white/10 py-4 md:py-6 text-2xl sm:text-3xl md:text-5xl font-extralight tracking-tight text-white placeholder-white/5 outline-none focus:border-[#D4AF37]/50 transition-all"
                style={{ fontFamily: '"Montserrat", sans-serif' }}
            />
            <motion.div
                className="absolute bottom-0 left-0 h-[1.5px] bg-[#D4AF37]"
                initial={{ width: "0%", boxShadow: "0 0 0px #D4AF37" }}
                animate={{
                    width: isFocused ? "100%" : "0%",
                    boxShadow: isFocused ? "0 0 15px #D4AF37" : "0 0 0px #D4AF37"
                }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
            {/* Igniting Glow Expansion */}
            <AnimatePresence>
                {isFocused && (
                    <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        exit={{ opacity: 0, scaleX: 0 }}
                        className="absolute -bottom-20 left-0 w-full h-40 bg-radial-gold-glow pointer-events-none opacity-5 z-[-1]"
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

const BookingCalendar = ({ onSelect }) => {
    const days = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
    const slots = ['10:00 AM', '02:00 PM', '04:30 PM'];
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState(null);

    return (
        <div className="w-full max-w-3xl flex flex-col items-center">
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 md:gap-6 mb-8 md:mb-12 w-full">
                {days.map(day => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`p-4 md:p-8 border rounded-[16px] md:rounded-[24px] transition-all duration-500 ${selectedDay === day ? 'bg-white text-black border-white' : 'bg-white/[0.02] border-white/5 text-white/40 hover:border-white/20'}`}
                    >
                        <span className="text-[10px] md:text-xs font-bold tracking-widest" style={{ fontFamily: '"Lexend Peta", sans-serif' }}>{day}</span>
                    </button>
                ))}
            </div>

            <AnimatePresence>
                {selectedDay && (
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-wrap justify-center gap-3 md:gap-6"
                    >
                        {slots.map(slot => (
                            <button
                                key={slot}
                                onClick={() => {
                                    setSelectedSlot(slot);
                                    onSelect(`${selectedDay} @ ${slot}`);
                                }}
                                className={`px-6 md:px-10 py-3 md:py-5 rounded-full border text-[9px] md:text-[11px] font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase transition-all ${selectedSlot === slot ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'bg-transparent border-white/10 text-white/40 hover:border-white/30'}`}
                                style={{ fontFamily: '"Montserrat", sans-serif' }}
                            >
                                {slot}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const ContactPage = () => {
    const [name, setName] = useState("");
    const [selectedService, setSelectedService] = useState(null);
    const [booking, setBooking] = useState(null);
    const [step, setStep] = useState(1);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef(null);

    const handleTextInput = (val) => {
        setName(val);
        setIsTyping(true);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 500);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && name.length > 2 && step === 1) setStep(2);
    };

    return (
        <div className="w-full h-screen bg-[#020202] relative overflow-hidden flex flex-col items-center text-white selection:bg-[#D4AF37] selection:text-black">
            <StudioBackdrop />
            <BlueprintGrid />
            <NoiseOverlay />
            <CustomCursor />

            {/* Header / Nav */}
            <div className="fixed top-0 left-0 w-full z-50 flex justify-center pt-8 pointer-events-none">
                <div className="pointer-events-auto">
                    <Group className="scale-75 origin-top" />
                </div>
            </div>

            {/* Background 3D Stage (The Ingot) */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
                <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 10], fov: 35 }} gl={{ powerPreference: "high-performance" }}>
                    <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#D4AF37" />
                    <pointLight position={[-10, -10, -10]} intensity={1} color="#ffffff" />
                    <Suspense fallback={null}>
                        <GoldIngot isSuccess={isSuccess} isTyping={isTyping} />
                        <Environment preset="studio" />
                    </Suspense>
                </Canvas>
            </div>

            {/* Main Interface: The Monolithic Glass Stage */}
            <div className="relative w-full min-h-screen flex flex-col items-center justify-center z-10 px-4 sm:px-8 py-24 md:py-0">

                <motion.div
                    animate={{
                        boxShadow: isTyping ? "0 0 60px rgba(212,175,55,0.05)" : "0 0 40px rgba(0,0,0,0.5)",
                        borderColor: isTyping ? "rgba(212,175,55,0.15)" : "rgba(255,255,255,0.05)"
                    }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-5xl md:h-[600px] min-h-[500px] bg-white/[0.01] border rounded-[24px] md:rounded-[40px] backdrop-blur-[40px] relative overflow-hidden flex items-center justify-center group"
                >
                    {/* Glass Refraction Layer (Simulation) */}
                    <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-[40px]" />

                    <AnimatePresence mode="wait">

                        {/* Step 1: Identify Partner */}
                        {!isSuccess && step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ x: -200, opacity: 0, filter: 'blur(20px)' }}
                                animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
                                exit={{ x: 200, opacity: 0, filter: 'blur(20px)' }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full flex flex-col items-center p-20"
                            >
                                <div className="text-center mb-10 md:mb-16 px-4">
                                    <span className="text-[9px] md:text-[11px] text-[#D4AF37] tracking-[0.6em] md:tracking-[1em] uppercase block mb-4 md:mb-6" style={{ fontFamily: '"Lexend Peta", sans-serif' }}>01 / PARTNER IDENTIFICATION</span>
                                    <KineticText
                                        text="Who leads this vision?"
                                        className="text-white text-3xl sm:text-5xl md:text-7xl font-extralight tracking-tighter leading-tight"
                                        style={{ fontFamily: '"Montserrat", sans-serif' }}
                                    />
                                </div>
                                <FloatingField
                                    label="Project Principal"
                                    placeholder="Full name..."
                                    value={name}
                                    onKeyDown={handleKeyDown}
                                    onChange={(e) => handleTextInput(e.target.value)}
                                    autoFocus
                                />
                                <p className={`mt-6 md:mt-10 text-[8px] md:text-[10px] text-white/20 tracking-[0.4em] md:tracking-[0.8em] uppercase text-center transition-opacity duration-700 ${name.length > 2 ? 'opacity-100' : 'opacity-0'}`} style={{ fontFamily: '"Lexend Peta", sans-serif' }}>
                                    Press Enter to Proceed
                                </p>
                            </motion.div>
                        )}

                        {/* Step 2: Strategic Focus */}
                        {!isSuccess && step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ x: 100, opacity: 0, filter: 'blur(20px)' }}
                                animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
                                exit={{ x: -100, opacity: 0, filter: 'blur(20px)' }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full flex flex-col items-center p-20"
                            >
                                <div className="text-center mb-10 md:mb-16 px-4">
                                    <span className="text-[9px] md:text-[11px] text-[#D4AF37] tracking-[0.6em] md:tracking-[1em] uppercase block mb-4 md:mb-6" style={{ fontFamily: '"Lexend Peta", sans-serif' }}>02 / VERTICAL IDENTIFICATION</span>
                                    <h3 className="text-white text-3xl sm:text-5xl md:text-6xl font-extralight tracking-tighter" style={{ fontFamily: '"Montserrat", sans-serif' }}>Strategic Focus</h3>
                                </div>
                                <div className="flex flex-wrap justify-center gap-4 md:gap-8 px-4">
                                    {['Web Design', 'Media', 'Editing', 'Lead Gen'].map((service) => (
                                        <button
                                            key={service}
                                            onClick={() => {
                                                setSelectedService(service);
                                                setStep(3);
                                            }}
                                            className="px-8 md:px-16 py-4 md:py-6 border border-white/5 bg-white/[0.02] rounded-full text-[10px] md:text-xs font-bold tracking-[0.2em] md:tracking-[0.4em] uppercase hover:bg-white hover:text-black transition-all duration-500"
                                            style={{ fontFamily: '"Lexend Peta", sans-serif' }}
                                        >
                                            {service}
                                        </button>
                                    ))}
                                </div>
                                <button onClick={() => setStep(1)} className="mt-12 md:mt-20 text-[9px] md:text-[10px] text-white/20 tracking-[0.4em] md:tracking-[0.6em] uppercase hover:text-white transition-colors" style={{ fontFamily: '"Montserrat", sans-serif' }}>← Back</button>
                            </motion.div>
                        )}

                        {/* Step 3: Global Strategy Booking */}
                        {!isSuccess && step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ x: -100, opacity: 0, filter: 'blur(20px)' }}
                                animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
                                exit={{ scale: 1.1, opacity: 0 }}
                                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full flex flex-col items-center p-16"
                            >
                                <div className="text-center mb-8 md:mb-12 px-4">
                                    <span className="text-[9px] md:text-[11px] text-[#D4AF37] tracking-[0.6em] md:tracking-[1em] uppercase block mb-4 md:mb-6" style={{ fontFamily: '"Lexend Peta", sans-serif' }}>03 / SECURE STRATEGY SESSION</span>
                                    <h3 className="text-white text-3xl sm:text-5xl md:text-6xl font-extralight tracking-tighter" style={{ fontFamily: '"Montserrat", sans-serif' }}>Finalize Brief</h3>
                                </div>
                                <BookingCalendar onSelect={setBooking} />
                                {booking && (
                                    <motion.button
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        onClick={() => setIsSuccess(true)}
                                        className="mt-12 md:mt-16 px-12 md:px-24 py-5 md:py-8 bg-white text-black font-black text-xs md:text-sm tracking-[0.6em] md:tracking-[0.8em] uppercase rounded-full shadow-[0_30px_90px_rgba(255,255,255,0.2)] hover:bg-[#D4AF37] transition-all"
                                        style={{ fontFamily: '"Lexend Peta", sans-serif' }}
                                    >
                                        Establish Connection
                                    </motion.button>
                                )}
                                <button onClick={() => setStep(2)} className="mt-8 md:mt-12 text-[9px] md:text-[10px] text-white/20 tracking-[0.4em] md:tracking-[0.6em] uppercase hover:text-white transition-colors" style={{ fontFamily: '"Montserrat", sans-serif' }}>← Modify Brief</button>
                            </motion.div>
                        )}

                        {/* Success State: Connection Established */}
                        {isSuccess && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="w-full flex flex-col items-center justify-center p-20"
                            >
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.5, duration: 1 }}
                                    className="text-center px-4"
                                >
                                    <h2 className="text-white text-4xl sm:text-6xl md:text-9xl font-thin tracking-tighter mb-6 md:mb-8 italic leading-tight" style={{ fontFamily: '"Clesmont", sans-serif' }}>
                                        Brief Received.
                                    </h2>
                                    <p className="text-[#D4AF37] text-sm md:text-lg font-mono tracking-[0.5em] md:tracking-[1.2em] uppercase mb-12 md:mb-20 opacity-80" style={{ fontFamily: '"Lexend Peta", sans-serif' }}>Connection Established</p>
                                    <button
                                        onClick={() => window.location.href = '/'}
                                        className="px-10 md:px-16 py-4 md:py-6 bg-white/[0.05] border border-white/10 text-white text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] md:tracking-[0.6em] rounded-full hover:bg-white hover:text-black transition-all"
                                        style={{ fontFamily: '"Lexend Peta", sans-serif' }}
                                    >
                                        Enter Portal
                                    </button>
                                </motion.div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </motion.div>

            </div>

            {/* Static Bottom Elements: Agency Blueprint */}
            <div className="fixed bottom-10 left-10 md:bottom-20 md:left-20 z-20 pointer-events-none scale-50 md:scale-75 origin-bottom-left transition-opacity duration-700 opacity-20 hover:opacity-100">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-[1px] bg-white/40" />
                        <span className="text-white/40 text-[8px] font-mono tracking-widest">ONYX STUDIO SYSTEM v1.08</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-[1px] bg-white/40 opacity-0" />
                        <span className="text-white/40 text-[8px] font-mono tracking-widest">ESTABLISHED 2024 / NYC GLOBAL</span>
                    </div>
                </div>
            </div>

            {/* Inline CSS for Vignette */}
            <style dangerouslySetInnerHTML={{
                __html: `
                .bg-radial-vignette {
                    background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,1) 85%);
                }
                .bg-radial-gold-glow {
                    background: radial-gradient(ellipse at center, rgba(212,175,55,0.4) 0%, transparent 70%);
                }
            ` }} />
        </div>
    );
};


