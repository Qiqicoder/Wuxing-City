
import React, { useMemo } from 'react';

const Meteor: React.FC<{ startX: string; delay: string; duration: string }> = ({ startX, delay, duration }) => {
  // Tail pixel opacities: 1.0 → 0.9 → 0.7 → 0.5 → 0.3 → 0.1
  const tailPixels = [
    { offset: 6, opacity: 0.9, size: 2 },
    { offset: 12, opacity: 0.7, size: 2 },
    { offset: 18, opacity: 0.5, size: 2 },
    { offset: 24, opacity: 0.3, size: 2 },
    { offset: 30, opacity: 0.1, size: 2 },
  ];

  return (
    <div 
      className="animate-meteor absolute"
      style={{
        top: '-100px',
        left: startX,
        '--delay': delay,
        '--duration': duration,
      } as React.CSSProperties}
    >
      <div className="relative" style={{ transform: 'rotate(-45deg)' }}>
        {/* Head: 6px solid square */}
        <div className="w-[6px] h-[6px] bg-white absolute top-0 left-0" />
        
        {/* Tail: Individual pixel squares trail */}
        {tailPixels.map((p, i) => (
          <div 
            key={i}
            className="bg-white absolute"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `-${p.offset}px`,
              top: `${(6 - p.size) / 2}px`, // Centered vertically relative to head
              opacity: p.opacity,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const Starfield: React.FC = () => {
  const stars = useMemo(() => {
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: 0.5 + Math.random() * 0.3,
      duration: `${5 + Math.random() * 5}s`,
      delay: `${Math.random() * 5}s`,
    }));
  }, []);

  // One meteor every 6-9 seconds, parallel at -45 degrees
  const meteors = useMemo(() => {
    return [
      { id: 1, startX: '10vw', delay: '0s', duration: '3s' },
      { id: 2, startX: '35vw', delay: '6s', duration: '2.8s' },
      { id: 3, startX: '60vw', delay: '12s', duration: '2.6s' },
      { id: 4, startX: '85vw', delay: '18s', duration: '3s' },
      { id: 5, startX: '95vw', delay: '24s', duration: '2.7s' },
    ];
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Background Static/Floating Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="animate-star-float absolute bg-white"
          style={{
            top: star.top,
            left: star.left,
            width: '2px',
            height: '2px',
            opacity: star.opacity,
            '--duration': star.duration,
            '--delay': star.delay,
          } as React.CSSProperties}
        />
      ))}

      {/* Monument Valley Parallel Meteor Layer */}
      {meteors.map((m) => (
        <Meteor 
          key={m.id} 
          startX={m.startX}
          delay={m.delay} 
          duration={m.duration} 
        />
      ))}

      {/* Global Scanlines */}
      <div className="scanline-overlay absolute inset-0 z-40 opacity-20" />
    </div>
  );
};

export default Starfield;
