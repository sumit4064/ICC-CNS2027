import React from 'react';

/**
 * HeroBackground Component
 * 
 * "FLOWING ACADEMIC AURORA" Design Concept
 * 
 * An elegant, abstract, and premium background for ICC-CNS 2027.
 * Replaces all legacy network/hexagon/circuit imagery with smooth,
 * flowing translucent ribbon waves, soft glass-like gradients,
 * and luminous atmospheric light fields.
 * 
 * 4 Layers of Depth:
 * 1. Base Luminous Atmosphere (Soft white/cyan lighting)
 * 2. Flowing Translucent Aurora Waves (Smooth sweeping ribbons)
 * 3. Luminous Glass Light Arcs (Delicate edge reflections)
 * 4. Micro Optical Reflections (Subtle gradient depth)
 */
export const HeroBackground = () => {
  return (
    <div className="hero-aurora-bg" aria-hidden="true">
      {/* LAYER 1: ATMOSPHERIC LIGHT FIELDS */}
      <div className="aurora-orb aurora-orb-1" />
      <div className="aurora-orb aurora-orb-2" />
      <div className="aurora-orb aurora-orb-3" />
      <div className="aurora-vignette" />

      {/* LAYER 2 & 3: FLOWING TRANSLUCENT AURORA WAVES & LIGHT ARCS */}
      <svg
        className="hero-aurora-svg"
        viewBox="0 0 1440 720"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <defs>
          {/* Aurora Ribbon Gradient 1 (Cyan / Teal Flow) */}
          <linearGradient id="auroraWaveGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00A8D6" stopOpacity="0.07" />
            <stop offset="45%" stopColor="#00C7E8" stopOpacity="0.04" />
            <stop offset="85%" stopColor="#14B8D4" stopOpacity="0.015" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.00" />
          </linearGradient>

          {/* Aurora Ribbon Gradient 2 (Deep Soft Aqua) */}
          <linearGradient id="auroraWaveGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00C7E8" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#00A8D6" stopOpacity="0.035" />
            <stop offset="100%" stopColor="#EFFBFD" stopOpacity="0.00" />
          </linearGradient>

          {/* Aurora Ribbon Gradient 3 (Lower Base Sweep) */}
          <linearGradient id="auroraWaveGrad3" x1="20%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#00A8D6" stopOpacity="0.05" />
            <stop offset="60%" stopColor="#00C7E8" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#00A8D6" stopOpacity="0.00" />
          </linearGradient>

          {/* Luminous Leading Edge Stroke Gradient */}
          <linearGradient id="auroraStrokeGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00A8D6" stopOpacity="0.00" />
            <stop offset="25%" stopColor="#00C7E8" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#00A8D6" stopOpacity="0.45" />
            <stop offset="85%" stopColor="#00C7E8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#00A8D6" stopOpacity="0.00" />
          </linearGradient>

          {/* Secondary Delicate Edge Stroke Gradient */}
          <linearGradient id="auroraStrokeGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00C7E8" stopOpacity="0.00" />
            <stop offset="40%" stopColor="#00A8D6" stopOpacity="0.30" />
            <stop offset="75%" stopColor="#00C7E8" stopOpacity="0.20" />
            <stop offset="100%" stopColor="#00A8D6" stopOpacity="0.00" />
          </linearGradient>

          {/* Soft Glow Filter for Highlighted Reflection Arcs */}
          <filter id="auroraSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* LAYER 2: TRANSLUCENT FLOWING AURORA RIBBONS */}
        <g className="aurora-ribbon-layers">
          {/* Upper Diagonal Flowing Wave */}
          <path
            d="M 540,0 C 720,80 890,60 1120,160 C 1300,240 1400,180 1440,210 L 1440,0 Z"
            fill="url(#auroraWaveGrad1)"
          />

          {/* Main Diagonal Aurora Wave (Sweeping behind the sponsorship card) */}
          <path
            d="M 520,380 C 760,260 980,180 1200,290 C 1350,360 1410,480 1440,550 L 1440,720 L 980,720 C 820,680 660,540 520,380 Z"
            fill="url(#auroraWaveGrad2)"
          />

          {/* Lower Harmonic Wave (Soft Grounding Flow) */}
          <path
            d="M 680,720 C 820,580 1020,520 1240,610 C 1360,660 1410,700 1440,720 Z"
            fill="url(#auroraWaveGrad3)"
          />

          {/* Mid-Ambient Diagonal Sheen Panel */}
          <path
            d="M 800,0 C 960,140 1140,290 1440,410 L 1440,280 C 1200,190 1040,80 890,0 Z"
            fill="url(#auroraWaveGrad1)"
            opacity="0.75"
          />
        </g>

        {/* LAYER 3: LUMINOUS GLASS LIGHT ARCS & REFLECTION PATHS */}
        <g className="aurora-edge-strokes">
          {/* Main Crest Edge Reflection Line */}
          <path
            d="M 560,360 C 780,240 990,170 1210,280 C 1340,345 1400,450 1440,520"
            stroke="url(#auroraStrokeGrad1)"
            strokeWidth="1.3"
            vectorEffect="non-scaling-stroke"
          />

          {/* Upper Crest Secondary Edge Line */}
          <path
            d="M 580,20 C 740,95 910,75 1130,170 C 1280,235 1380,190 1440,215"
            stroke="url(#auroraStrokeGrad2)"
            strokeWidth="1.0"
            vectorEffect="non-scaling-stroke"
          />

          {/* Lower Harmonic Edge Line */}
          <path
            d="M 720,690 C 850,565 1040,510 1250,600 C 1355,645 1405,680 1440,700"
            stroke="url(#auroraStrokeGrad1)"
            strokeWidth="1.1"
            vectorEffect="non-scaling-stroke"
          />

          {/* Subtle Outer Floating Curve (Guiding toward center-right) */}
          <path
            d="M 860,20 C 1010,150 1180,295 1440,405"
            stroke="url(#auroraStrokeGrad2)"
            strokeWidth="0.85"
            strokeDasharray="6 8"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>
    </div>
  );
};
