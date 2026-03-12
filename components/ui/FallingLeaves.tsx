'use client'

import { useEffect, useState, useId } from 'react'

interface Leaf {
    id: number
    left: number
    size: number
    duration: number
    delay: number
    startRotation: number
    swayDir: number
    opacity: number
    colorSet: number
}

const LEAF_COUNT = 22

function rand(min: number, max: number) {
    return Math.random() * (max - min) + min
}

/** Three sets of light/mid/dark for natural variation */
const COLOR_SETS = [
    { light: '#86efac', mid: '#22c55e', dark: '#15803d', vein: '#14532d' }, // fresh green
    { light: '#6ee7b7', mid: '#10b981', dark: '#065f46', vein: '#064e3b' }, // emerald
    { light: '#a3e635', mid: '#65a30d', dark: '#365314', vein: '#1a2e05' }, // lime
]

function generateLeaves(): Leaf[] {
    return Array.from({ length: LEAF_COUNT }, (_, i) => ({
        id: i,
        left: rand(0, 97),
        size: rand(28, 52),
        duration: rand(10, 24),
        delay: rand(0, 18),
        startRotation: rand(-70, 70),
        swayDir: Math.random() > 0.5 ? 1 : -1,
        opacity: rand(0.72, 1),
        colorSet: Math.floor(Math.random() * COLOR_SETS.length),
    }))
}

interface LeafSVGProps {
    uid: string
    colors: typeof COLOR_SETS[number]
}

/**
 * A realistic single garden leaf:
 * - Gradient fill (light center → dark edges)
 * - Organic bezier outline — pointed tip, widest at ~40%, tapers to stem
 * - Curved lateral veins fanning from midrib
 * - Rounded stem
 */
function LeafSVG({ uid, colors }: LeafSVGProps) {
    const gradId = `lg-${uid}`
    return (
        <svg
            viewBox="0 0 60 108"
            xmlns="http://www.w3.org/2000/svg"
            style={{ display: 'block', width: '100%', height: '100%', overflow: 'visible' }}
        >
            <defs>
                {/* Radial gradient: bright core → rich dark edges */}
                <radialGradient id={gradId} cx="50%" cy="38%" r="58%">
                    <stop offset="0%" stopColor={colors.light} />
                    <stop offset="58%" stopColor={colors.mid} />
                    <stop offset="100%" stopColor={colors.dark} />
                </radialGradient>
            </defs>

            {/* ── Leaf body ──────────────────────────────────────────────
                Organic shape: sharp pointed tip → widest ~y40 → narrows
                to a rounded base at y88                                  */}
            <path
                d={`
                    M 30 3
                    C 44 8,  56 22, 56 40
                    C 56 56, 48 72, 38 82
                    C 34 86, 31 88, 30 88
                    C 29 88, 26 86, 22 82
                    C 12 72,  4 56,  4 40
                    C  4 22, 16  8, 30 3
                    Z
                `}
                fill={`url(#${gradId})`}
                stroke={colors.dark}
                strokeWidth="0.6"
                strokeLinejoin="round"
            />

            {/* ── Midrib ─────────────────────────────────────────────── */}
            <path
                d="M 30 5 Q 29 46, 30 86"
                fill="none"
                stroke={colors.vein}
                strokeWidth="1.2"
                strokeLinecap="round"
            />

            {/* ── Left lateral veins ─────────────────────────────────── */}
            <path d="M 29 22 Q 21 26, 12 27" fill="none" stroke={colors.vein} strokeWidth="0.75" strokeLinecap="round" opacity="0.8" />
            <path d="M 29 34 Q 19 39, 9  40" fill="none" stroke={colors.vein} strokeWidth="0.75" strokeLinecap="round" opacity="0.8" />
            <path d="M 29 46 Q 19 51, 10 53" fill="none" stroke={colors.vein} strokeWidth="0.7" strokeLinecap="round" opacity="0.75" />
            <path d="M 29 58 Q 21 62, 14 65" fill="none" stroke={colors.vein} strokeWidth="0.65" strokeLinecap="round" opacity="0.7" />
            <path d="M 29 70 Q 23 73, 18 75" fill="none" stroke={colors.vein} strokeWidth="0.6" strokeLinecap="round" opacity="0.65" />

            {/* ── Right lateral veins ────────────────────────────────── */}
            <path d="M 31 22 Q 39 26, 48 27" fill="none" stroke={colors.vein} strokeWidth="0.75" strokeLinecap="round" opacity="0.8" />
            <path d="M 31 34 Q 41 39, 51 40" fill="none" stroke={colors.vein} strokeWidth="0.75" strokeLinecap="round" opacity="0.8" />
            <path d="M 31 46 Q 41 51, 50 53" fill="none" stroke={colors.vein} strokeWidth="0.7" strokeLinecap="round" opacity="0.75" />
            <path d="M 31 58 Q 39 62, 46 65" fill="none" stroke={colors.vein} strokeWidth="0.65" strokeLinecap="round" opacity="0.7" />
            <path d="M 31 70 Q 37 73, 42 75" fill="none" stroke={colors.vein} strokeWidth="0.6" strokeLinecap="round" opacity="0.65" />

            {/* ── Stem ───────────────────────────────────────────────── */}
            <path
                d="M 30 88 Q 31 96, 30 105"
                fill="none"
                stroke="#15803d"
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    )
}

export default function FallingLeaves() {
    const uid = useId().replace(/:/g, '')
    const [leaves, setLeaves] = useState<Leaf[]>([])

    useEffect(() => {
        setLeaves(generateLeaves())
    }, [])

    if (leaves.length === 0) return null

    return (
        <>
            <style>{`
                @keyframes leafFall {
                    0% {
                        top: -70px;
                        transform: rotate(var(--r)) translateX(0px);
                        opacity: 0;
                    }
                    5% { opacity: var(--lo); }
                    25% {
                        transform: rotate(calc(var(--r) + 90deg))
                                   translateX(calc(var(--sd) * 80px));
                    }
                    50% {
                        transform: rotate(calc(var(--r) + 190deg))
                                   translateX(0px);
                    }
                    75% {
                        transform: rotate(calc(var(--r) + 280deg))
                                   translateX(calc(var(--sd) * 60px));
                    }
                    93% { opacity: var(--lo); }
                    100% {
                        top: 110vh;
                        transform: rotate(calc(var(--r) + 370deg))
                                   translateX(0px);
                        opacity: 0;
                    }
                }
            `}</style>

            <div
                aria-hidden="true"
                className="pointer-events-none fixed inset-0"
                style={{ zIndex: 40, overflow: 'hidden' }}
            >
                {leaves.map((leaf) => (
                    <div
                        key={leaf.id}
                        style={{
                            position: 'absolute',
                            left: `${leaf.left}%`,
                            top: -70,
                            width: leaf.size,
                            /* taller than wide — like a real leaf */
                            height: Math.round(leaf.size * 1.9),
                            animation: `leafFall ${leaf.duration}s ${leaf.delay}s cubic-bezier(0.4,0,0.6,1) infinite`,
                            '--r': `${leaf.startRotation}deg`,
                            '--sd': leaf.swayDir,
                            '--lo': leaf.opacity,
                        } as React.CSSProperties}
                    >
                        <LeafSVG
                            uid={`${uid}-${leaf.id}`}
                            colors={COLOR_SETS[leaf.colorSet]}
                        />
                    </div>
                ))}
            </div>
        </>
    )
}
