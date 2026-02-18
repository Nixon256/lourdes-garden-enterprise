'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export default function CustomCursor() {
    const [isMounted, setIsMounted] = useState(false)

    const cursorX = useMotionValue(-100)
    const cursorY = useMotionValue(-100)

    const springConfig = { damping: 25, stiffness: 700 }
    const cursorXSpring = useSpring(cursorX, springConfig)
    const cursorYSpring = useSpring(cursorY, springConfig)

    useEffect(() => {
        setIsMounted(true)
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX - 16)
            cursorY.set(e.clientY - 16)
        }

        window.addEventListener('mousemove', moveCursor)
        return () => window.removeEventListener('mousemove', moveCursor)
    }, [cursorX, cursorY])

    if (!isMounted) return null

    return (
        <motion.div
            className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9999] hidden lg:block"
            style={{
                translateX: cursorXSpring,
                translateY: cursorYSpring,
            }}
        >
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full" />

            {/* Botanical Cursor - Leaf shape */}
            <svg
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full text-green-600 dark:text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]"
            >
                <path
                    d="M16 4C16 4 16 12 8 20C4 24 8 28 12 28C16 28 20 25 24 20C32 12 32 4 32 4C32 4 24 4 16 12C12 16 16 20 16 20L16 32"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {/* Pointer Tip Dot */}
                <circle cx="16" cy="16" r="2" fill="currentColor" />
            </svg>
        </motion.div>
    )
}
