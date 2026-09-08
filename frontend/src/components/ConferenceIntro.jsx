import React, { useEffect, useRef, useState, useCallback } from 'react';
import '../styles/ConferenceIntro.css';

// In-memory session tracker: intro plays on initial page load / full reload,
// but does not repeat on internal SPA route transitions.
let hasPlayedInSession = false;

export const ConferenceIntro = ({ onComplete }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const videoRef = useRef(null);
  const isFinishedRef = useRef(false);

  // Check prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Single Guaranteed Finish & Exit Handler
  const handleFinish = useCallback(() => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;
    hasPlayedInSession = true;
    setIsFadingOut(true);

    if (videoRef.current) {
      try {
        videoRef.current.pause();
      } catch (e) {
        // ignore
      }
    }

    setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 450);
  }, [onComplete]);

  // Video Autoplay & Safety Lifecycle
  useEffect(() => {
    if (prefersReducedMotion) {
      const quickTimer = setTimeout(() => {
        handleFinish();
      }, 500);
      return () => clearTimeout(quickTimer);
    }

    const video = videoRef.current;
    if (video) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.warn('Intro video autoplay prevented or failed:', error);
          setTimeout(handleFinish, 1200);
        });
      }
    }

    // Safety timeout: guaranteed navigation if video stalls or fails
    const safetyTimeout = setTimeout(() => {
      handleFinish();
    }, 10000);

    // Keyboard listener (Escape / Space / Enter to skip immediately)
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        handleFinish();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(safetyTimeout);
    };
  }, [handleFinish, prefersReducedMotion]);

  return (
    <div
      className={`conference-intro-overlay ${isFadingOut ? 'intro-fade-out' : ''}`}
      aria-label="ICCCNS-2027 Conference Introduction Video"
      role="region"
    >
      {/* 16:9 Responsive Video Wrapper */}
      <div className="intro-video-wrapper">
        {/* Cinematic MP4 Intro Video Layer */}
        <video
          ref={videoRef}
          className="intro-video"
          src="/videos/Animation.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={handleFinish}
          onError={(e) => {
            console.warn('Intro video failed to load, proceeding to home:', e);
            handleFinish();
          }}
        />
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

