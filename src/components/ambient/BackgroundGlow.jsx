import React, { useEffect, useRef, useState } from 'react';
import { useCurrentUser } from '../../store/useAppStore';

export default function BackgroundGlow() {
  const currentUser = useCurrentUser();
  const isWarm = currentUser?.theme === 'warm';
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: -500, y: -500 });

  // Handle subtle mouse glow follow
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Ambient twinkling stars canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate stars
    const starCount = Math.floor((window.innerWidth * window.innerHeight) / 9000);
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 1.3 + 0.3,
      alpha: Math.random() * 0.7 + 0.1,
      speed: Math.random() * 0.015 + 0.005,
      direction: Math.random() > 0.5 ? 1 : -1
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        star.alpha += star.speed * star.direction;
        if (star.alpha > 0.85) {
          star.alpha = 0.85;
          star.direction = -1;
        } else if (star.alpha < 0.1) {
          star.alpha = 0.1;
          star.direction = 1;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = isWarm
          ? `rgba(253, 224, 71, ${star.alpha * 0.6})`
          : `rgba(224, 215, 255, ${star.alpha * 0.75})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = isWarm ? '#eab308' : '#c084fc';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isWarm]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Dynamic Cursor Light Aura */}
      <div
        className="fixed w-[420px] h-[420px] rounded-full blur-[110px] pointer-events-none transition-transform duration-300 ease-out opacity-25"
        style={{
          transform: `translate(${mousePos.x - 210}px, ${mousePos.y - 210}px)`,
          background: isWarm
            ? 'radial-gradient(circle, rgba(245, 158, 11, 0.4) 0%, rgba(217, 70, 239, 0.15) 60%, transparent 80%)'
            : 'radial-gradient(circle, rgba(168, 85, 247, 0.45) 0%, rgba(99, 102, 241, 0.2) 60%, transparent 80%)'
        }}
      />

      {/* Floating Ambient Glowing Orbs */}
      <div
        className={`absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full blur-[140px] animate-float-slow ${
          isWarm ? 'bg-amber-600/15' : 'bg-purple-700/20'
        }`}
      />
      <div
        className={`absolute top-1/3 -right-40 w-[550px] h-[550px] rounded-full blur-[150px] animate-float-reverse ${
          isWarm ? 'bg-rose-700/15' : 'bg-indigo-700/20'
        }`}
      />
      <div
        className={`absolute -bottom-40 left-1/4 w-[700px] h-[500px] rounded-full blur-[160px] animate-pulse-glow ${
          isWarm ? 'bg-orange-800/15' : 'bg-fuchsia-900/15'
        }`}
      />

      {/* Twinkling Stars Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />

      {/* Noise Texture Grid Overlay */}
      <div className="absolute inset-0 bg-noise opacity-40 mix-blend-soft-light" />
    </div>
  );
}

