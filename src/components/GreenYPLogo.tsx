import React from 'react';

interface GreenYPLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const sizeConfig = {
  sm: { icon: 24, text: 16, height: 24 },
  md: { icon: 32, text: 20, height: 32 },
  lg: { icon: 40, text: 26, height: 40 },
  xl: { icon: 48, text: 32, height: 48 },
};

const GreenYPLogo: React.FC<GreenYPLogoProps> = ({ 
  size = 'md', 
  showText = true,
  className = '' 
}) => {
  const config = sizeConfig[size];
  
  if (!showText) {
    // Icon only version
    return (
      <svg 
        width={config.icon} 
        height={config.icon} 
        viewBox="0 0 50 50" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Circular background */}
        <circle cx="25" cy="25" r="24" fill="#134e2a"/>
        <circle cx="25" cy="25" r="22" fill="#1a5c34" stroke="#0d3d20" strokeWidth="1"/>
        
        {/* Leaf shape - rotated 90 degrees pointing right */}
        <g transform="rotate(90, 25, 25)">
          <path 
            d="M25 10C25 10 14 18 14 29C14 37 19 42 25 42C31 42 36 37 36 29C36 18 25 10 25 10Z" 
            fill="#2d8a4e"
          />
          {/* Leaf highlight */}
          <path 
            d="M25 12C25 12 17 19 17 28C17 34 20 38 25 38" 
            fill="#3da864"
            opacity="0.6"
          />
          {/* Center vein */}
          <path 
            d="M25 15V38" 
            stroke="#134e2a" 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
          {/* Side veins */}
          <path 
            d="M25 20L20 24M25 26L18 30M25 32L21 35" 
            stroke="#134e2a" 
            strokeWidth="1" 
            strokeLinecap="round"
            opacity="0.7"
          />
          <path 
            d="M25 20L30 24M25 26L32 30M25 32L29 35" 
            stroke="#134e2a" 
            strokeWidth="1" 
            strokeLinecap="round"
            opacity="0.7"
          />
        </g>
      </svg>
    );
  }

  // Full logo with text
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg 
        width={config.icon} 
        height={config.icon} 
        viewBox="0 0 50 50" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Circular background */}
        <circle cx="25" cy="25" r="24" fill="#134e2a"/>
        <circle cx="25" cy="25" r="22" fill="#1a5c34" stroke="#0d3d20" strokeWidth="1"/>
        
        {/* Leaf shape - rotated 90 degrees pointing right */}
        <g transform="rotate(90, 25, 25)">
          <path 
            d="M25 10C25 10 14 18 14 29C14 37 19 42 25 42C31 42 36 37 36 29C36 18 25 10 25 10Z" 
            fill="#2d8a4e"
          />
          {/* Leaf highlight */}
          <path 
            d="M25 12C25 12 17 19 17 28C17 34 20 38 25 38" 
            fill="#3da864"
            opacity="0.6"
          />
          {/* Center vein */}
          <path 
            d="M25 15V38" 
            stroke="#134e2a" 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
          {/* Side veins */}
          <path 
            d="M25 20L20 24M25 26L18 30M25 32L21 35" 
            stroke="#134e2a" 
            strokeWidth="1" 
            strokeLinecap="round"
            opacity="0.7"
          />
          <path 
            d="M25 20L30 24M25 26L32 30M25 32L29 35" 
            stroke="#134e2a" 
            strokeWidth="1" 
            strokeLinecap="round"
            opacity="0.7"
          />
        </g>
      </svg>
      <span 
        className="font-bold" 
        style={{ fontSize: config.text }}
      >
        <span style={{ color: '#134e2a' }}>Green</span>
        <span style={{ color: '#2d8a4e' }}>YP</span>
      </span>
    </div>
  );
};

export default GreenYPLogo;
