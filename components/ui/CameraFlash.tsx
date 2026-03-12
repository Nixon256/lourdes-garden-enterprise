'use client'

import { useEffect, useState } from 'react'

/**
 * CameraFlash (Leaf Aperture Edition)
 * ──────────────────────────────────────────────────────────────────
 * A professional photography-themed shutter effect where stylized 
 * green leaf blades form a mechanical aperture.
 * 
 * 1. Shutter: 8 Leaf Blades rotate and slide in to close the aperture.
 * 2. Flash: A sophisticated radial gradient light burst.
 * 3. Reveal: The blades snap back with a mechanical bounce.
 */
export default function CameraFlash({ trigger }: { trigger?: number }) {
    const [phase, setPhase] = useState<'idle' | 'shutter' | 'flash' | 'fade' | 'done'>('idle')

    useEffect(() => {
        setPhase('shutter')

        // Accurate mechanical timings
        const t2 = setTimeout(() => setPhase('flash'), 220)
        const t3 = setTimeout(() => setPhase('fade'), 300)
        const t4 = setTimeout(() => setPhase('done'), 850)

        return () => {
            clearTimeout(t2)
            clearTimeout(t3)
            clearTimeout(t4)
        }
    }, [trigger])

    if (phase === 'done') return null

    return (
        <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 9999 }}>
            <style>{`
                @keyframes leafApertureClose {
                    0%   { transform: rotate(var(--rot)) translateY(-100%) scale(0.5); opacity: 0; }
                    100% { transform: rotate(var(--rot)) translateY(0%) scale(1);    opacity: 1; }
                }
                @keyframes leafApertureOpen {
                    0%   { transform: rotate(var(--rot)) translateY(0%) scale(1);    opacity: 1; }
                    100% { transform: rotate(var(--rot)) translateY(-110%) scale(0.8); opacity: 0; }
                }
                @keyframes flashBurst {
                    0%   { opacity: 0; transform: scale(0.5); }
                    20%  { opacity: 1; transform: scale(1); }
                    100% { opacity: 0; transform: scale(1.5); }
                }
                @keyframes softFade {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
            `}</style>

            {/* ── Flash Burst Layer ── */}
            {(phase === 'flash' || phase === 'fade') && (
                <div
                    className="absolute inset-0 z-50 flex items-center justify-center bg-white"
                    style={{
                        animation: phase === 'flash'
                            ? 'flashBurst 400ms cubic-bezier(0.2, 1, 0.3, 1) forwards'
                            : 'softFade 500ms ease-out forwards',
                        background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 40%, rgba(255,255,255,0) 100%)'
                    }}
                />
            )}

            {/* ── Leaf Aperture Blades ── */}
            <div className="absolute inset-0 flex items-center justify-center">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute origin-center transition-all"
                        style={{
                            width: '120vw',
                            height: '120vh',
                            '--rot': `${i * 45}deg`,
                            animation: phase === 'shutter' || phase === 'flash'
                                ? 'leafApertureClose 250ms cubic-bezier(0.2, 0, 0, 1) forwards'
                                : 'leafApertureOpen 500ms cubic-bezier(0.4, 0, 1, 1) forwards'
                        } as React.CSSProperties}
                    >
                        {/* The "Blade" — an organic leaf-inspired shape */}
                        <svg
                            viewBox="0 0 100 200"
                            className="w-full h-full opacity-95"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M 50 0 C 100 40, 100 160, 50 200 C 0 160, 0 40, 50 0 Z"
                                fill="url(#leafBladeGrad)"
                            />
                        </svg>
                    </div>
                ))}
            </div>

            <svg width="0" height="0">
                <defs>
                    <linearGradient id="leafBladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#064e3b" /> {/* emerald-950 */}
                        <stop offset="50%" stopColor="#14532d" /> {/* green-950 */}
                        <stop offset="100%" stopColor="#022c22" /> {/* teal-950 */}
                    </linearGradient>
                </defs>
            </svg>
        </div>
    )
}
