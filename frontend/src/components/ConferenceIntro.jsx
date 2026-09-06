import React, { useEffect, useRef, useState, useCallback } from 'react';
import '../styles/ConferenceIntro.css';

// In-memory session tracker: intro plays on initial page load / full reload,
// but does not annoy users on internal SPA route transitions.
let hasPlayedInSession = false;

export const ConferenceIntro = ({ onComplete }) => {
  const [phase, setPhase] = useState(0); // 0: start, 1: network, 2: brain, 3: branding, 4: title, 5: fading
  const [isFadingOut, setIsFadingOut] = useState(false);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const timeoutsRef = useRef([]);

  // Check prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleFinish = useCallback(() => {
    hasPlayedInSession = true;
    setIsFadingOut(true);

    const finishTimeout = setTimeout(() => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (onComplete) {
        onComplete();
      }
    }, 400);

    timeoutsRef.current.push(finishTimeout);
  }, [onComplete]);

  useEffect(() => {
    // If reduced motion is requested, complete quickly with a subtle fade
    if (prefersReducedMotion) {
      const quickTimer = setTimeout(() => {
        handleFinish();
      }, 700);
      timeoutsRef.current.push(quickTimer);
      return () => {
        clearTimeout(quickTimer);
      };
    }

    // Exact timeline sequence (Total ~3.8s)
    // Phase 1 (0.0s): Dark background + initial particles
    setPhase(1);

    // Phase 2 (0.7s): Network formation begins
    const t1 = setTimeout(() => setPhase(2), 700);

    // Phase 3 (1.5s): Cognitive brain neural silhouette illuminates
    const t2 = setTimeout(() => setPhase(3), 1500);

    // Phase 4 (2.3s): "ICC-CNS 2027" reveals
    const t3 = setTimeout(() => setPhase(4), 2300);

    // Phase 5 (2.85s): Full conference title reveals
    const t4 = setTimeout(() => setPhase(5), 2850);

    // Phase 6 (3.55s): Transition & fade out into homepage
    const t5 = setTimeout(() => {
      handleFinish();
    }, 3550);

    timeoutsRef.current.push(t1, t2, t3, t4, t5);

    // Keyboard listener (Escape / Space / Enter to skip)
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      timeoutsRef.current.forEach((t) => clearTimeout(t));
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleFinish, prefersReducedMotion]);

  // High-DPI Canvas Brain Silhouette & Neural Network Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Handle high DPI
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      if (!canvas) return;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', handleResize);

    // Normalized coordinates for an abstract technological human brain silhouette profile
    const rawBrainNodes = [
      // Frontal lobe outline
      { nx: -0.68, ny: -0.05, type: 'cyan' },
      { nx: -0.74, ny: 0.18, type: 'cyan' },
      { nx: -0.66, ny: 0.42, type: 'orange' },
      { nx: -0.52, ny: 0.66, type: 'cyan' },
      { nx: -0.32, ny: 0.82, type: 'cyan' },

      // Parietal & Superior cortex
      { nx: -0.08, ny: 0.93, type: 'cyan' },
      { nx: 0.16, ny: 0.95, type: 'orange' },
      { nx: 0.42, ny: 0.88, type: 'cyan' },
      { nx: 0.62, ny: 0.72, type: 'cyan' },

      // Occipital lobe
      { nx: 0.78, ny: 0.48, type: 'cyan' },
      { nx: 0.85, ny: 0.22, type: 'orange' },
      { nx: 0.82, ny: -0.02, type: 'cyan' },
      { nx: 0.70, ny: -0.22, type: 'cyan' },

      // Cerebellum
      { nx: 0.64, ny: -0.46, type: 'orange' },
      { nx: 0.45, ny: -0.64, type: 'cyan' },
      { nx: 0.26, ny: -0.58, type: 'cyan' },
      { nx: 0.12, ny: -0.42, type: 'cyan' },

      // Brainstem / Neural pathway
      { nx: 0.04, ny: -0.76, type: 'orange' },
      { nx: -0.02, ny: -0.94, type: 'cyan' },
      { nx: -0.08, ny: -0.68, type: 'cyan' },

      // Temporal lobe & Sylvian boundary
      { nx: -0.22, ny: -0.36, type: 'cyan' },
      { nx: -0.48, ny: -0.28, type: 'orange' },
      { nx: -0.60, ny: -0.12, type: 'cyan' },
      { nx: -0.36, ny: -0.08, type: 'cyan' },

      // Deep Cortical & Thalamic Neural Hubs
      { nx: -0.32, ny: 0.38, type: 'cyan' },
      { nx: -0.12, ny: 0.52, type: 'cyan' },
      { nx: 0.20, ny: 0.46, type: 'orange' },
      { nx: 0.44, ny: 0.32, type: 'cyan' },
      { nx: -0.12, ny: 0.18, type: 'orange' },
      { nx: 0.18, ny: 0.12, type: 'cyan' },
      { nx: 0.36, ny: -0.14, type: 'cyan' },
      { nx: 0.02, ny: -0.12, type: 'orange' },
      { nx: -0.35, ny: 0.16, type: 'cyan' },
      { nx: 0.05, ny: 0.70, type: 'cyan' },
      { nx: 0.52, ny: 0.08, type: 'cyan' }
    ];

    // Synaptic connections (indices connecting rawBrainNodes)
    const connections = [
      // Outer frontal/parietal outline
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8],
      // Occipital & Cerebellum
      [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 16],
      // Brainstem
      [16, 17], [17, 18], [18, 19], [19, 16],
      // Temporal
      [16, 20], [20, 21], [21, 22], [22, 0],
      // Internal neural web
      [24, 2], [24, 3], [24, 25], [25, 4], [25, 5], [25, 33], [33, 6], [33, 7],
      [26, 7], [26, 8], [26, 27], [27, 9], [27, 10], [27, 34], [34, 11], [34, 12],
      [28, 24], [28, 32], [32, 0], [32, 23], [28, 29], [29, 26], [29, 31],
      [31, 30], [30, 12], [30, 13], [31, 16], [31, 20], [23, 20], [23, 21],
      [25, 28], [26, 29], [27, 30]
    ];

    // Ambient floating network particles
    const ambientParticles = [];
    const ambientCount = 32;
    for (let i = 0; i < ambientCount; i++) {
      ambientParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.35 ? 'rgba(0, 229, 255, ' : 'rgba(255, 107, 53, ',
        baseAlpha: Math.random() * 0.45 + 0.25,
        pulseSpeed: Math.random() * 0.03 + 0.015,
        phaseOffset: Math.random() * Math.PI * 2
      });
    }

    // Synaptic pulses moving along brain connections
    const pulses = [];
    for (let i = 0; i < connections.length; i += 2) {
      pulses.push({
        connectionIdx: i,
        progress: Math.random(),
        speed: Math.random() * 0.012 + 0.008,
        color: i % 3 === 0 ? '#FF6B35' : '#00E5FF'
      });
    }

    const startTime = performance.now();

    const render = (now) => {
      const elapsed = (now - startTime) / 1000; // seconds

      ctx.clearRect(0, 0, width, height);

      // Center brain positioning
      // Position brain slightly above vertical center on desktop, balanced on mobile
      const brainCenterX = width * 0.5;
      const brainCenterY = height < 600 ? height * 0.38 : height * 0.35;
      const brainScale = Math.min(width * 0.22, height * 0.24, 150);

      // Phase 1 (0–0.7s): Fade in ambient particles and soft glowing background
      const globalParticleAlpha = Math.min(elapsed / 0.6, 1);

      // Draw ambient particles
      ambientParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const alpha =
          (p.baseAlpha + Math.sin(elapsed * 3 + p.phaseOffset) * 0.15) *
          globalParticleAlpha;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.max(0, alpha) + ')';
        ctx.shadowColor = p.color === 'rgba(255, 107, 53, ' ? '#FF6B35' : '#00E5FF';
        ctx.shadowBlur = 6;
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // Phase 2 (0.7s–1.7s): Draw connections progressively
      // Phase 3 (1.5s–2.5s): Brain illuminates with glowing nodes and orbital rings
      const lineProgress = Math.max(0, Math.min((elapsed - 0.5) / 1.0, 1));
      const brainAlpha = Math.max(0, Math.min((elapsed - 0.6) / 0.9, 1));

      if (lineProgress > 0) {
        // Calculate screen positions for brain nodes
        const nodes = rawBrainNodes.map((n, idx) => {
          // Subtle organic float animation
          const floatX = Math.cos(elapsed * 1.5 + idx) * 1.5;
          const floatY = Math.sin(elapsed * 1.5 + idx) * 1.5;
          return {
            x: brainCenterX + n.nx * brainScale + floatX,
            y: brainCenterY - n.ny * brainScale + floatY,
            type: n.type
          };
        });

        // 1. Draw connecting synaptic lines
        const linesToDraw = Math.floor(connections.length * lineProgress);
        ctx.lineWidth = 1.1;

        connections.slice(0, linesToDraw).forEach(([i1, i2], lineIdx) => {
          const n1 = nodes[i1];
          const n2 = nodes[i2];
          if (!n1 || !n2) return;

          // Draw line with subtle cyan/teal gradient
          const grad = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
          const isOrangeLine = lineIdx % 4 === 0;

          if (isOrangeLine) {
            grad.addColorStop(0, `rgba(0, 229, 255, ${0.45 * brainAlpha})`);
            grad.addColorStop(0.5, `rgba(255, 107, 53, ${0.65 * brainAlpha})`);
            grad.addColorStop(1, `rgba(0, 180, 216, ${0.45 * brainAlpha})`);
          } else {
            grad.addColorStop(0, `rgba(0, 180, 216, ${0.25 * brainAlpha})`);
            grad.addColorStop(0.5, `rgba(0, 229, 255, ${0.6 * brainAlpha})`);
            grad.addColorStop(1, `rgba(0, 180, 216, ${0.25 * brainAlpha})`);
          }

          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = grad;
          ctx.stroke();
        });

        // 2. Draw active pulses traveling through the cognitive neural network
        if (elapsed > 1.0) {
          pulses.forEach((pulse) => {
            pulse.progress += pulse.speed;
            if (pulse.progress > 1) {
              pulse.progress = 0;
              pulse.connectionIdx = (pulse.connectionIdx + 3) % connections.length;
            }

            const [i1, i2] = connections[pulse.connectionIdx] || [0, 1];
            const n1 = nodes[i1];
            const n2 = nodes[i2];
            if (!n1 || !n2) return;

            const px = n1.x + (n2.x - n1.x) * pulse.progress;
            const py = n1.y + (n2.y - n1.y) * pulse.progress;

            ctx.beginPath();
            ctx.arc(px, py, 2.2, 0, Math.PI * 2);
            ctx.fillStyle = pulse.color;
            ctx.shadowColor = pulse.color;
            ctx.shadowBlur = 8;
            ctx.fill();
          });
          ctx.shadowBlur = 0;
        }

        // 3. Draw brain network nodes
        nodes.forEach((n, idx) => {
          const isOrange = n.type === 'orange';
          const nodePulse = Math.sin(elapsed * 4 + idx * 0.7) * 0.5 + 0.5;
          const radius = (isOrange ? 3.2 : 2.5) + nodePulse * 0.8;

          // Outer halo
          ctx.beginPath();
          ctx.arc(n.x, n.y, radius * 2.2, 0, Math.PI * 2);
          ctx.fillStyle = isOrange
            ? `rgba(255, 107, 53, ${0.25 * brainAlpha * (0.6 + nodePulse * 0.4)})`
            : `rgba(0, 229, 255, ${0.22 * brainAlpha * (0.6 + nodePulse * 0.4)})`;
          ctx.fill();

          // Core node
          ctx.beginPath();
          ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = isOrange
            ? `rgba(255, 140, 66, ${0.95 * brainAlpha})`
            : `rgba(224, 247, 250, ${0.95 * brainAlpha})`;
          ctx.shadowColor = isOrange ? '#FF6B35' : '#00E5FF';
          ctx.shadowBlur = 10;
          ctx.fill();
        });
        ctx.shadowBlur = 0;

        // 4. Subtle holographic orbital synapse rings around frontal & thalamic centers
        if (elapsed > 1.3) {
          const ringAlpha = Math.min((elapsed - 1.3) / 0.8, 1) * 0.4 * brainAlpha;

          // Thalamic orbital ring
          const centerHub = nodes[28] || { x: brainCenterX, y: brainCenterY };
          ctx.save();
          ctx.translate(centerHub.x, centerHub.y);
          ctx.rotate(elapsed * 0.4);
          ctx.beginPath();
          ctx.ellipse(0, 0, 36, 18, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(0, 229, 255, ${ringAlpha})`;
          ctx.setLineDash([4, 6]);
          ctx.lineWidth = 1;
          ctx.stroke();

          // Orange accent orbital ring
          ctx.rotate(-elapsed * 0.8);
          ctx.beginPath();
          ctx.ellipse(0, 0, 48, 22, Math.PI / 4, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(255, 107, 53, ${ringAlpha * 0.8})`;
          ctx.setLineDash([3, 8]);
          ctx.stroke();
          ctx.restore();
        }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [prefersReducedMotion]);

  return (
    <div
      className={`conference-intro-overlay ${isFadingOut ? 'intro-fade-out' : ''}`}
      aria-label="ICC-CNS 2027 Conference Introduction Animation"
      role="region"
    >
      {/* Background HTML5 High-Performance Canvas */}
      <canvas ref={canvasRef} className="intro-canvas" aria-hidden="true" />

      {/* Atmospheric Glow Spheres */}
      <div className="intro-glow-core" aria-hidden="true" />
      <div className="intro-glow-accent" aria-hidden="true" />

      {/* Foreground Typography Content */}
      <div className="intro-content">
        {/* Visual spacer to align with canvas neural brain */}
        <div className="intro-visual-anchor" aria-hidden="true" />

        {/* Phase 4: ICC-CNS 2027 Branding Reveal */}
        <div className={`intro-branding-row ${phase >= 4 ? 'visible' : ''}`}>
          <div className="intro-brand-title">
            <span className="intro-text-white">ICC-</span>
            <span className="intro-text-orange">CNS</span>
            <span className="intro-text-white" style={{ marginLeft: '0.25em' }}>
              2027
            </span>
          </div>
        </div>

        {/* Phase 5: Full Conference Title Reveal */}
        <div className={`intro-title-block ${phase >= 5 ? 'visible' : ''}`}>
          <div className="intro-sub-prefix">International Conference on</div>
          <h1 className="intro-main-topic">
            <span className="topic-highlight">Cognitive Computing</span> and Networking Systems
          </h1>

          <div className="intro-meta-badge">
            <span className="intro-meta-dot" />
            <span>Vignan's University (VFSTR) • June 11–13, 2027</span>
          </div>
        </div>
      </div>

      {/* Accessible Skip Intro Button */}
      <button
        type="button"
        className="intro-skip-button"
        onClick={handleFinish}
        aria-label="Skip conference introduction"
      >
        <span>Skip Intro</span>
        <span className="intro-skip-arrow">→</span>
      </button>
    </div>
  );
};

export default ConferenceIntro;
