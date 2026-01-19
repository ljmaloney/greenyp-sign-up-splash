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
        {/* Book/Pages base shape */}
        <path 
          d="M5 10C5 7 7 5 10 5H35C38 5 40 7 40 10V40C40 43 38 45 35 45H10C7 45 5 43 5 40V10Z" 
          fill="#22c55e"
        />
        {/* Page lines */}
        <path 
          d="M12 15H33M12 23H33M12 31H28" 
          stroke="white" 
          strokeWidth="2.5" 
          strokeLinecap="round"
        />
        {/* Leaf accent on top-right */}
        <path 
          d="M32 3C32 3 44 1 48 10C48 10 45 5 38 5C38 5 41 12 36 17" 
          stroke="#15803d" 
          strokeWidth="3" 
          strokeLinecap="round" 
          fill="none"
        />
        <circle cx="48" cy="10" r="2.5" fill="#15803d"/>
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
        {/* Book/Pages base shape */}
        <path 
          d="M5 10C5 7 7 5 10 5H35C38 5 40 7 40 10V40C40 43 38 45 35 45H10C7 45 5 43 5 40V10Z" 
          fill="#22c55e"
        />
        {/* Page lines */}
        <path 
          d="M12 15H33M12 23H33M12 31H28" 
          stroke="white" 
          strokeWidth="2.5" 
          strokeLinecap="round"
        />
        {/* Leaf accent on top-right */}
        <path 
          d="M32 3C32 3 44 1 48 10C48 10 45 5 38 5C38 5 41 12 36 17" 
          stroke="#15803d" 
          strokeWidth="3" 
          strokeLinecap="round" 
          fill="none"
        />
        <circle cx="48" cy="10" r="2.5" fill="#15803d"/>
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
