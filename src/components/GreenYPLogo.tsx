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
        <g transform="rotate(90, 25, 25)">
          {/* Main leaf shape */}
          <path 
            d="M25 5C25 5 10 15 10 30C10 40 17 47 25 47C33 47 40 40 40 30C40 15 25 5 25 5Z" 
            fill="url(#leafGradient)"
          />
          {/* Center vein */}
          <path 
            d="M25 12V42" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round"
            opacity="0.6"
          />
          {/* Side veins */}
          <path 
            d="M25 20L18 26M25 28L16 34M25 36L19 40" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinecap="round"
            opacity="0.4"
          />
          <path 
            d="M25 20L32 26M25 28L34 34M25 36L31 40" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinecap="round"
            opacity="0.4"
          />
        </g>
        <defs>
          <linearGradient id="leafGradient" x1="25" y1="5" x2="25" y2="47" gradientUnits="userSpaceOnUse">
            <stop stopColor="#22c55e"/>
            <stop offset="1" stopColor="#15803d"/>
          </linearGradient>
        </defs>
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
        <g transform="rotate(90, 25, 25)">
          {/* Main leaf shape */}
          <path 
            d="M25 5C25 5 10 15 10 30C10 40 17 47 25 47C33 47 40 40 40 30C40 15 25 5 25 5Z" 
            fill="url(#leafGradientFull)"
          />
          {/* Center vein */}
          <path 
            d="M25 12V42" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round"
            opacity="0.6"
          />
          {/* Side veins */}
          <path 
            d="M25 20L18 26M25 28L16 34M25 36L19 40" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinecap="round"
            opacity="0.4"
          />
          <path 
            d="M25 20L32 26M25 28L34 34M25 36L31 40" 
            stroke="white" 
            strokeWidth="1.5" 
            strokeLinecap="round"
            opacity="0.4"
          />
        </g>
        <defs>
          <linearGradient id="leafGradientFull" x1="25" y1="5" x2="25" y2="47" gradientUnits="userSpaceOnUse">
            <stop stopColor="#22c55e"/>
            <stop offset="1" stopColor="#15803d"/>
          </linearGradient>
        </defs>
      </svg>
      <span 
        className="font-bold" 
        style={{ fontSize: config.text }}
      >
        <span className="text-green-700">Green</span>
        <span className="text-green-500">YP</span>
      </span>
    </div>
  );
};

export default GreenYPLogo;
