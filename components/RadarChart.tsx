import React, { useRef, useEffect } from 'react';

interface RadarChartProps {
  scores: {
    fire: number;
    water: number;
    wood: number;
    earth: number;
    metal: number;
  };
  size?: number;
}

const RadarChart: React.FC<RadarChartProps> = ({ scores, size = 360 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Dimensions
    const padding = 60; // Increased padding for larger labels
    const centerX = size / 2;
    const centerY = size / 2;
    const maxRadius = (size - padding * 2) / 2;

    // Element Config (Unified Starry Theme)
    // Blue-Purple-White palette
    const gridColor = 'rgba(139, 156, 255, 0.15)'; // #8B9CFF low opacity
    const axisColor = 'rgba(139, 156, 255, 0.1)';
    const polygonFillStart = 'rgba(139, 156, 255, 0.1)';
    const polygonFillEnd = 'rgba(196, 181, 253, 0.3)'; // #C4B5FD
    const polygonStroke = '#C4B5FD';
    const pointColor = '#FFFFFF';
    const textColor = '#AEB6C4';
    const scoreColor = '#FFFFFF';

    const elements = [
      { name: 'FIRE', key: 'fire', angle: -90 },
      { name: 'WOOD', key: 'wood', angle: -18 },
      { name: 'WATER', key: 'water', angle: 54 },
      { name: 'METAL', key: 'metal', angle: 126 },
      { name: 'EARTH', key: 'earth', angle: 198 }
    ];

    const toRadians = (deg: number) => deg * (Math.PI / 180);

    const getPoint = (angle: number, radius: number) => ({
      x: centerX + radius * Math.cos(toRadians(angle)),
      y: centerY + radius * Math.sin(toRadians(angle))
    });

    // 1. Draw Background Glow (Subtle)
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
    gradient.addColorStop(0, 'rgba(139, 156, 255, 0.05)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
    ctx.fill();

    // 2. Draw Grid (Concentric Pentagons)
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;

    // Draw 3 main levels (33%, 66%, 100%)
    [0.33, 0.66, 1].forEach(level => {
      const radius = maxRadius * level;
      ctx.beginPath();
      elements.forEach((el, i) => {
        const point = getPoint(el.angle, radius);
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.closePath();
      ctx.stroke();
    });

    // 3. Draw Axis Lines
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 0.5;
    elements.forEach(el => {
      const point = getPoint(el.angle, maxRadius);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    });

    // 4. Calculate Vertex Points and Identify Top Scores
    const dataPoints = elements.map(el => {
      const score = (scores as any)[el.key] || 20;
      const radius = (score / 100) * maxRadius;
      return { ...el, ...getPoint(el.angle, radius), score };
    });

    // Determine top 2 scores for highlighting
    const sortedPoints = [...dataPoints].sort((a, b) => b.score - a.score);
    const top2Keys = sortedPoints.slice(0, 2).map(p => p.key);

    // 5. Draw Filled Polygon (Gradient)
    const polyGradient = ctx.createLinearGradient(centerX - maxRadius, centerY - maxRadius, centerX + maxRadius, centerY + maxRadius);
    polyGradient.addColorStop(0, polygonFillStart);
    polyGradient.addColorStop(1, polygonFillEnd);

    ctx.fillStyle = polyGradient;
    ctx.beginPath();
    dataPoints.forEach((point, i) => {
      if (i === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
    ctx.fill();

    // 6. Draw Polygon Stroke
    ctx.strokeStyle = polygonStroke;
    ctx.lineWidth = 2;
    ctx.shadowColor = polygonStroke; // Glow effect
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0; // Reset shadow

    // 7. Draw Vertices (Dots)
    dataPoints.forEach(point => {
      const isTop2 = top2Keys.includes(point.key);
      ctx.fillStyle = isTop2 ? '#FFFFFF' : pointColor;
      ctx.beginPath();

      // Top 2 points are slightly larger
      ctx.arc(point.x, point.y, isTop2 ? 5 : 3, 0, Math.PI * 2);
      ctx.fill();

      // Add glow to top 2 points
      if (isTop2) {
        ctx.shadowColor = '#FFFFFF';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    });

    // 8. Draw Labels & Scores
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    dataPoints.forEach(point => {
      const isTop2 = top2Keys.includes(point.key);

      // Label placement
      const labelRadius = maxRadius + 35;
      const labelPoint = getPoint(point.angle, labelRadius);

      // Label text (Elements) - Larger Font
      ctx.fillStyle = isTop2 ? '#FFFFFF' : textColor;
      // Highlighting logic: bolder/brighter for top 2
      ctx.font = isTop2 ? 'bold 13px "Inter", sans-serif' : '600 12px "Inter", sans-serif';

      if (isTop2) {
        ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
        ctx.shadowBlur = 6;
      }
      ctx.fillText(point.name, labelPoint.x, labelPoint.y - 8);
      ctx.shadowBlur = 0;

      // Score Text - Larger Font
      ctx.fillStyle = isTop2 ? '#FFFFFF' : scoreColor;
      ctx.font = isTop2 ? 'bold 16px "Inter", sans-serif' : 'bold 14px "Inter", sans-serif';
      ctx.fillText(point.score.toString(), labelPoint.x, labelPoint.y + 8);
    });

  }, [scores, size]);

  return (
    <div className="relative flex items-center justify-center">
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          maxWidth: `${size}px`,
          height: 'auto',
        }}
      />
    </div>
  );
};

export default RadarChart;
