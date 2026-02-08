
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

const RadarChart: React.FC<RadarChartProps> = ({ scores, size = 320 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Calculate dimensions
    const padding = 55; // Padding for labels
    const centerX = size / 2;
    const centerY = size / 2;
    const maxRadius = (size - padding * 2) / 2;

    // Element configuration (Order: Fire, Wood, Water, Metal, Earth clockwise)
    const elements = [
      { name: 'FIRE', key: 'fire', color: '#ff6b6b', angle: -90 },
      { name: 'WOOD', key: 'wood', color: '#95e1d3', angle: -18 },
      { name: 'WATER', key: 'water', color: '#4ecdc4', angle: 54 },
      { name: 'METAL', key: 'metal', color: '#e0e0e0', angle: 126 },
      { name: 'EARTH', key: 'earth', color: '#c7956d', angle: 198 }
    ];

    // Helper function: angle to radians
    const toRadians = (deg: number) => deg * (Math.PI / 180);

    // Helper function: get point position
    const getPoint = (angle: number, radius: number) => ({
      x: centerX + radius * Math.cos(toRadians(angle)),
      y: centerY + radius * Math.sin(toRadians(angle))
    });

    // Step 1: Draw grid (concentric pentagons)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let level = 1; level <= 5; level++) {
      const radius = (maxRadius / 5) * level;
      ctx.beginPath();
      elements.forEach((el, i) => {
        const point = getPoint(el.angle, radius);
        if (i === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.closePath();
      ctx.stroke();
    }

    // Step 2: Draw axis lines from center to corners
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    elements.forEach(el => {
      const point = getPoint(el.angle, maxRadius);
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
    });

    // Step 3: Calculate data points based on scores
    const dataPoints = elements.map(el => {
      const score = (scores as any)[el.key] || 20;
      // Map 0-100 score to radius
      const radius = (score / 100) * maxRadius;
      return { ...el, ...getPoint(el.angle, radius), score };
    });

    // Step 4: Draw data polygon (fill)
    ctx.fillStyle = 'rgba(78, 205, 196, 0.2)';
    ctx.beginPath();
    dataPoints.forEach((point, i) => {
      if (i === 0) ctx.moveTo(point.x, point.y);
      else ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
    ctx.fill();

    // Step 5: Draw data polygon outline
    ctx.strokeStyle = '#4ecdc4';
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.stroke();

    // Step 6: Draw data point circles
    dataPoints.forEach(point => {
      ctx.fillStyle = point.color;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    // Step 7: Draw labels and scores
    // Using simple font for canvas, pixel font rendering can be tricky on small sizes
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    dataPoints.forEach(point => {
      const labelRadius = maxRadius + 28;
      const labelPoint = getPoint(point.angle, labelRadius);
      
      // Shadow for text depth
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 4;
      
      // Element Name
      ctx.fillStyle = point.color;
      ctx.fillText(point.name, labelPoint.x, labelPoint.y - 7);
      
      // Score value
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '8px monospace';
      ctx.fillText(point.score.toString(), labelPoint.x, labelPoint.y + 7);
      
      // Reset
      ctx.shadowBlur = 0;
      ctx.font = 'bold 9px monospace';
    });

  }, [scores, size]);

  return (
    <div className="relative flex items-center justify-center py-6">
      <canvas
        ref={canvasRef}
        className="mx-auto"
        style={{
          filter: 'drop-shadow(0 0 15px rgba(78, 205, 196, 0.15))',
        }}
      />
    </div>
  );
};

export default RadarChart;
