
import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const StarSVG = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="2" width="4" height="4" fill="#ffd93d" />
    <rect x="12" y="6" width="8" height="2" fill="#ffd93d" />
    <rect x="2" y="12" width="4" height="4" fill="#ffd93d" />
    <rect x="6" y="10" width="2" height="8" fill="#ffd93d" />
    <rect x="26" y="12" width="4" height="4" fill="#ffd93d" />
    <rect x="24" y="10" width="2" height="8" fill="#ffd93d" />
    <rect x="10" y="10" width="12" height="12" fill="#ffd93d" />
    <rect x="8" y="22" width="4" height="4" fill="#ffd93d" />
    <rect x="10" y="26" width="2" height="2" fill="#ffd93d" />
    <rect x="20" y="22" width="4" height="4" fill="#ffd93d" />
    <rect x="20" y="26" width="2" height="2" fill="#ffd93d" />
    <rect x="13" y="13" width="6" height="6" fill="#fff9e6" />
  </svg>
);

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [textIndex, setTextIndex] = useState(0);
  const loadingMessages = [
    "Consulting the archives...",
    "Reading your cosmic signature...",
    "Calculating elemental balance...",
    "Aligning celestial coordinates...",
    "Unlocking city gateway...",
    "Almost there..."
  ];

  useEffect(() => {
    // Text rotation every 2 seconds
    const textInterval = setInterval(() => {
      setTextIndex((prev) => (prev < loadingMessages.length - 1 ? prev + 1 : prev));
    }, 2000);

    // Completion after exactly 8 seconds
    const completionTimeout = setTimeout(() => {
      onComplete();
    }, 8000);

    return () => {
      clearInterval(textInterval);
      clearTimeout(completionTimeout);
    };
  }, [onComplete]);

  // Tiny background stars (Step 1 style)
  const bgStars = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 5}s`,
    duration: `${4 + Math.random() * 4}s`,
  }));

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-b from-[#1a1a2e] to-[#0f0f1e] overflow-hidden select-none">
      {/* Subtle Background Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {bgStars.map((star) => (
          <div
            key={star.id}
            className="absolute bg-white animate-star-float"
            style={{
              width: '1px',
              height: '1px',
              top: star.top,
              left: star.left,
              opacity: 0.3 + Math.random() * 0.3,
              '--delay': star.delay,
              '--duration': star.duration,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Main Content Anchor (Progress Bar Container) */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-[400px] px-6">

        {/* Loading Text: 60px above progress bar */}
        <div className="absolute bottom-[84px] w-full text-center">
          <p className="text-[#e5e7eb] text-[16px] tracking-[1px] transition-opacity duration-300 opacity-90 font-mono">
            {loadingMessages[textIndex]}
          </p>
        </div>

        {/* Mario-style Star: 30px above progress bar */}
        <div className="absolute bottom-[54px] w-full pointer-events-none px-6">
          <div
            className="absolute"
            style={{
              animation: 'moveStar 8s cubic-bezier(0.1, 0.4, 0.2, 1) forwards',
              left: '0'
            }}
          >
            <div className="animate-star-spin-sparkle">
              <StarSVG />
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-[24px] border-[3px] border-[#4ecdc4] rounded-[4px] bg-[#1a1a3e] overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-[#4ecdc4] to-[#95e1d3]"
            style={{ animation: 'fillProgress 8s cubic-bezier(0.1, 0.4, 0.2, 1) forwards' }}
          />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes moveStar {
          from { transform: translateX(-16px); }
          to { transform: translateX(calc(100% - 16px)); }
        }
        @keyframes fillProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes starRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes starSparkle {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 1; }
        }
        .animate-star-spin-sparkle {
          animation: 
            starRotate 2s linear infinite,
            starSparkle 1s ease-in-out infinite;
        }
      `}} />
    </div>
  );
};

export default LoadingScreen;
