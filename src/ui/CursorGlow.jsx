import React, { useEffect, useState } from 'react';

export function CursorGlow() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [dotPos, setDotPos] = useState({ x: -100, y: -100 });
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    let animId;
    let targetX = -100;
    let targetY = -100;

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setDotPos({ x: e.clientX, y: e.clientY });

      // Check if hovering clickable element
      const target = e.target;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.classList.contains('interactive-item')
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    // Smooth lerp for outer ring
    let currentX = -100;
    let currentY = -100;

    const loop = () => {
      currentX += (targetX - currentX) * 0.22;
      currentY += (targetY - currentY) * 0.22;
      setPos({ x: currentX, y: currentY });
      animId = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  if (pos.x === -100) return null;

  return (
    <>
      <div
        className="custom-cursor"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: hovered ? '38px' : '24px',
          height: hovered ? '38px' : '24px',
          borderColor: hovered ? 'var(--accent-gold)' : 'var(--accent-cyan)',
        }}
      />
      <div
        className="custom-cursor-dot"
        style={{
          left: `${dotPos.x}px`,
          top: `${dotPos.y}px`,
          background: hovered ? 'var(--accent-gold)' : 'var(--accent-cyan)',
        }}
      />
    </>
  );
}
