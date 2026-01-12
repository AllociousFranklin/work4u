import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor = () => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const moveCursor = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });

            // Check for interactive elements
            const target = e.target;
            const interactive =
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.tagName === 'INPUT' ||
                target.closest('button') ||
                target.closest('a') ||
                target.closest('.interactive') ||
                target.closest('.interactive-hover');

            setIsHovering(!!interactive);
        };

        window.addEventListener("mousemove", moveCursor);
        return () => window.removeEventListener("mousemove", moveCursor);
    }, []);

    return (
        <motion.div
            className="fixed top-0 left-0 w-4 h-4 rounded-full border border-white/80 pointer-events-none z-[10000] mix-blend-difference flex items-center justify-center bg-transparent"
            animate={{
                x: mousePos.x - 8, // Offset by half width
                y: mousePos.y - 8,
                scale: isHovering ? 2.5 : 1,
                backgroundColor: isHovering ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)",
                borderColor: isHovering ? "rgba(255,255,255,0)" : "rgba(255,255,255,0.8)"
            }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
                mass: 0.1
            }}
        />
    );
};
