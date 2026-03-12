'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null)
    const dotRef = useRef<HTMLDivElement>(null)
    const rippleContainerRef = useRef<HTMLDivElement>(null)
    const [isHoveringInteractive, setIsHoveringInteractive] = useState(false)
    const [isHoveringCard, setIsHoveringCard] = useState(false)
    const [isVisible, setIsVisible] = useState(false)
    const [isMobile, setIsMobile] = useState(true)

    // Smooth follow positions
    const mousePos = useRef({ x: -200, y: -200 })
    const cursorPos = useRef({ x: -200, y: -200 })
    const rafRef = useRef<number>(0)
    const rotationRef = useRef(0)

    // Lerp helper
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    // Ripple on click
    const createRipple = useCallback((x: number, y: number) => {
        if (!rippleContainerRef.current) return
        const ripple = document.createElement('div')
        ripple.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: radial-gradient(circle, #FFE566 0%, #FFD84D 50%, transparent 100%);
            pointer-events: none;
            z-index: 9998;
            transform: translate(-50%, -50%) scale(1);
            animation: lemon-ripple 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        `
        rippleContainerRef.current.appendChild(ripple)
        setTimeout(() => ripple.remove(), 650)
    }, [])

    useEffect(() => {
        // Detect mobile / touch device
        const checkMobile = () => {
            setIsMobile(window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)

        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    useEffect(() => {
        if (isMobile) return

        const onMouseMove = (e: MouseEvent) => {
            mousePos.current = { x: e.clientX, y: e.clientY }
            if (!isVisible) setIsVisible(true)
        }

        const onMouseLeave = () => setIsVisible(false)
        const onMouseEnter = () => setIsVisible(true)

        const onMouseDown = (e: MouseEvent) => {
            createRipple(e.clientX, e.clientY)
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate(-50%, -50%) scale(0.82)`
                setTimeout(() => {
                    if (cursorRef.current) cursorRef.current.style.transform = `translate(-50%, -50%) scale(1)`
                }, 180)
            }
        }

        // Hover detection on interactive elements
        const onMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const isInteractive = target.closest('a, button, [role="button"], input, select, textarea, label')
            const isCard = target.closest('[data-testid^="product-article-"]')
            setIsHoveringInteractive(!!isInteractive)
            setIsHoveringCard(!!isCard && !isInteractive)
        }

        // Smooth animation loop
        let prevRotation = 0
        const animate = () => {
            const lerpT = 0.13
            cursorPos.current.x = lerp(cursorPos.current.x, mousePos.current.x, lerpT)
            cursorPos.current.y = lerp(cursorPos.current.y, mousePos.current.y, lerpT)

            // Slight rotation based on horizontal velocity
            const dx = mousePos.current.x - cursorPos.current.x
            const targetRotation = prevRotation + dx * 0.3
            rotationRef.current = lerp(rotationRef.current, targetRotation, 0.08)
            prevRotation = rotationRef.current

            if (cursorRef.current) {
                cursorRef.current.style.left = `${cursorPos.current.x}px`
                cursorRef.current.style.top = `${cursorPos.current.y}px`
                cursorRef.current.style.transform = `translate(-50%, -50%) rotate(${rotationRef.current}deg)`
            }
            if (dotRef.current) {
                dotRef.current.style.left = `${mousePos.current.x}px`
                dotRef.current.style.top = `${mousePos.current.y}px`
            }

            rafRef.current = requestAnimationFrame(animate)
        }

        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseleave', onMouseLeave)
        document.addEventListener('mouseenter', onMouseEnter)
        document.addEventListener('mousedown', onMouseDown)
        document.addEventListener('mouseover', onMouseOver)

        rafRef.current = requestAnimationFrame(animate)

        // Hide native cursor
        document.documentElement.style.cursor = 'none'

        return () => {
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseleave', onMouseLeave)
            document.removeEventListener('mouseenter', onMouseEnter)
            document.removeEventListener('mousedown', onMouseDown)
            document.removeEventListener('mouseover', onMouseOver)
            cancelAnimationFrame(rafRef.current)
            document.documentElement.style.cursor = ''
        }
    }, [isMobile, isVisible, createRipple])

    if (isMobile) return null

    const size = isHoveringInteractive ? 38 : isHoveringCard ? 42 : 30

    return (
        <>
            {/* Inject global styles */}
            <style>{`
                * { cursor: none !important; }
                @keyframes lemon-ripple {
                    0%   { transform: translate(-50%, -50%) scale(1); opacity: 0.9; }
                    100% { transform: translate(-50%, -50%) scale(7); opacity: 0; }
                }
                @keyframes lemon-float {
                    0%, 100% { transform: translate(-50%, -50%) translateY(0px) rotate(0deg); }
                    50%      { transform: translate(-50%, -50%) translateY(-2px) rotate(3deg); }
                }
            `}</style>

            {/* Ripple container */}
            <div ref={rippleContainerRef} className="fixed inset-0 pointer-events-none z-[9998]" />

            {/* Precision dot — stays exactly on cursor, no delay */}
            <div
                ref={dotRef}
                style={{
                    position: 'fixed',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#FFD84D',
                    pointerEvents: 'none',
                    zIndex: 10000,
                    transform: 'translate(-50%, -50%)',
                    opacity: isVisible ? 1 : 0,
                    transition: 'opacity 0.2s',
                    boxShadow: '0 0 6px 2px rgba(255,216,77,0.5)',
                }}
            />

            {/* Lemon slice cursor — follows with smooth lerp */}
            <div
                ref={cursorRef}
                style={{
                    position: 'fixed',
                    width: `${size}px`,
                    height: `${size}px`,
                    pointerEvents: 'none',
                    zIndex: 9999,
                    opacity: isVisible ? 1 : 0,
                    transition: `
                        opacity 0.2s ease,
                        width 0.25s cubic-bezier(0.22,1,0.36,1),
                        height 0.25s cubic-bezier(0.22,1,0.36,1)
                    `,
                    filter: isHoveringInteractive
                        ? 'drop-shadow(0 0 10px rgba(255,216,77,0.7)) drop-shadow(0 2px 6px rgba(0,0,0,0.25))'
                        : 'drop-shadow(0 2px 5px rgba(0,0,0,0.2))',
                    willChange: 'transform, left, top',
                }}
            >
                {/* Lemon slice SVG */}
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                    {/* Outer rind */}
                    <circle cx="16" cy="16" r="15" fill="#FFD84D" />
                    {/* Outer rind highlight arc */}
                    <circle cx="16" cy="16" r="15" fill="none" stroke="#F5C800" strokeWidth="1.5" />
                    {/* White pith ring */}
                    <circle cx="16" cy="16" r="13" fill="#FFFDE8" />
                    {/* Flesh background */}
                    <circle cx="16" cy="16" r="11.5" fill="#FFE566" />

                    {/* Segment dividers — 8 segments for a realistic slice */}
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                        const rad = (angle * Math.PI) / 180
                        const x2 = 16 + Math.cos(rad) * 11.5
                        const y2 = 16 + Math.sin(rad) * 11.5
                        return (
                            <line
                                key={i}
                                x1="16" y1="16"
                                x2={x2} y2={y2}
                                stroke="#F0C400"
                                strokeWidth="0.7"
                                strokeLinecap="round"
                                opacity="0.7"
                            />
                        )
                    })}

                    {/* Segment fill triangles (alternating slight tint for depth) */}
                    {[22.5, 112.5, 202.5, 292.5].map((angle, i) => {
                        const r = (angle * Math.PI) / 180
                        const r2 = ((angle + 45) * Math.PI) / 180
                        const x1 = 16 + Math.cos(r) * 11.5
                        const y1 = 16 + Math.sin(r) * 11.5
                        const x2 = 16 + Math.cos(r2) * 11.5
                        const y2 = 16 + Math.sin(r2) * 11.5
                        return (
                            <path
                                key={i}
                                d={`M16,16 L${x1},${y1} A11.5,11.5 0 0,1 ${x2},${y2} Z`}
                                fill="rgba(255,255,220,0.18)"
                            />
                        )
                    })}

                    {/* Center seed/pulp circle */}
                    <circle cx="16" cy="16" r="2.2" fill="#F0C400" opacity="0.9" />
                    <circle cx="16" cy="16" r="1" fill="#FFFCCC" opacity="0.8" />

                    {/* Tiny highlight glint — top-left */}
                    <circle cx="10" cy="10" r="1.8" fill="white" opacity="0.35" />
                </svg>

                {/* "View Story" label on product card hover */}
                {isHoveringCard && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '110%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'rgba(255,216,77,0.95)',
                            color: '#5a3d00',
                            fontSize: '8px',
                            fontWeight: '700',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            padding: '3px 7px',
                            borderRadius: '20px',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            pointerEvents: 'none',
                        }}
                    >
                        View Story
                    </div>
                )}
            </div>
        </>
    )
}
