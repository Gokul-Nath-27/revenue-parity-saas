"use client";
import React, { useRef, useState } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  maxTilt?: number;
}

const TiltCard: React.FC<TiltCardProps> = ({ children, maxTilt = 6 }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();

    // Calculate the center of the card
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Calculate the mouse position relative to the center of the card
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    // Calculate rotation based on mouse position
    // Normalize by the size of the card and multiply by the maximum tilt
    const rotateY = (mouseX / (rect.width / 2)) * maxTilt;
    const rotateX = -((mouseY / (rect.height / 2)) * maxTilt);

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 });
  };

  const transformStyle = isHovering
    ? `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
    : 'perspective(1000px) rotateX(0deg) rotateY(0deg)';

  return (
    <div
      ref={cardRef}
      className="tilt-card relative transition-transform duration-300 ease-out"
      style={{ transform: transformStyle }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="tilt-card-content">
        {children}
      </div>
    </div>
  );
};

export default TiltCard;
