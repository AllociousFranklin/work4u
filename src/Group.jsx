import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Group = ({ className = "" }) => {
    // Check if we are being forced into a "mobile specific" layout by parent (e.g. legacy frame props), 
    // but primarily we detect mobile via window width or parent intent.
    // However, the best approach for the user's request "mobile version" is to effectively SPLIT the logic.
    // If the className contains specific mobile flags, we render the mobile hamburger.

    // We'll actually use a responsive logic: 
    // If className has 'hidden md:block', it's desktop only.
    // But the user wants a mobile burger. 
    // Let's make this component responsive: Default = Desktop Bar. Mobile = Hamburger.
    // We can use a simple state to toggle menu.

    const [isOpen, setIsOpen] = useState(false);

    // Desktop Layout (The Long Pill)
    // We wrap this in a hidden/block logic for responsiveness

    return (
        <>
            {/* --- DESKTOP VIEW (Hidden on Mobile) --- */}
            <div className={`hidden md:block relative w-[800px] xl:w-[920px] h-[54px] ${className}`}>
                {/* Desktop Background */}
                <div className="absolute w-full h-full top-0 left-0 bg-white/[0.05] rounded-[50px] border-[2px] border-white/20 backdrop-blur-[15px] shadow-lg" />
                {/* Desktop Links */}
                <div className="absolute w-full h-full top-0 left-0 flex items-center justify-evenly px-16 z-10">
                    {[
                        { name: "Home", path: "/" },
                        { name: "Services", path: "/services" },
                        { name: "Projects", path: "/projects" },
                        { name: "Contact", path: "/contact" }
                    ].map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className="text-white text-[17px] font-medium tracking-widest hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer bg-transparent border-none outline-none shadow-none hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] no-underline"
                            style={{ fontFamily: '"Montserrat", sans-serif' }}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </div>

            {/* --- MOBILE HAMBURGER (Visible on Mobile) --- */}
            <div className="md:hidden fixed z-[9999] top-6 right-6">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-12 h-12 flex flex-col items-center justify-center gap-1.5 bg-black/50 backdrop-blur-md rounded-full border border-white/20"
                >
                    <motion.div animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 6 : 0 }} className="w-6 h-[2px] bg-white origin-center" />
                    <motion.div animate={{ opacity: isOpen ? 0 : 1 }} className="w-6 h-[2px] bg-white" />
                    <motion.div animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -6 : 0 }} className="w-6 h-[2px] bg-white origin-center" />
                </button>
            </div>

            {/* --- MOBILE FULLSCREEN MENU OVERLAY --- */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-[9998] bg-[#020202]/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 md:hidden"
                    >
                        {[
                            { name: "Home", path: "/" },
                            { name: "Services", path: "/services" },
                            { name: "Projects", path: "/projects" },
                            { name: "Contact", path: "/contact" }
                        ].map((item, i) => (
                            <Link
                                km={item.name} // Key moved to map
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className="text-white text-3xl font-light tracking-[0.2em] uppercase"
                                style={{ fontFamily: '"Montserrat", sans-serif' }}
                            >
                                {item.name}
                            </Link>
                        ))}
                        {/* Close Note or Footer in Menu */}
                        <div className="absolute bottom-10 text-white/30 text-[10px] tracking-widest uppercase">
                            Onyx Studio Mobile
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
