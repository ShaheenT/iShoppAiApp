import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className = '' }) => {
  const sizeClasses = {
    sm: 'w-7 h-7 rounded-xl',
    md: 'w-9 h-9 rounded-2xl',
    lg: 'w-12 h-12 rounded-2xl',
    xl: 'w-16 h-16 rounded-3xl',
    '2xl': 'w-20 h-20 rounded-3xl',
  };

  const textClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
    '2xl': 'text-4xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`} id="app-logo">
      {/* Exact representation of official iShopp logo (coral-to-rose squircle badge with white bag outline & solid white heart) */}
      <div
        className={`${sizeClasses[size]} shadow-md flex items-center justify-center p-1.5 transition-transform hover:scale-105 shrink-0`}
        style={{
          background: 'linear-gradient(180deg, #FF6B42 0%, #FF3366 50%, #FF1A75 100%)',
        }}
      >
        <svg
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-xs"
        >
          {/* Shopping bag handle arch */}
          <path
            d="M42 49 C42 27 50 18 60 18 C70 18 78 27 78 49"
            stroke="#FFFFFF"
            strokeWidth="5.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Handle attachment rivets */}
          <circle cx="42" cy="50" r="4.2" fill="#FFFFFF" />
          <circle cx="78" cy="50" r="4.2" fill="#FFFFFF" />

          {/* Shopping bag trapezoid outline */}
          <path
            d="M27 49 H93 L97.5 96 C97.8 99 95.5 101.5 92.5 101.5 H27.5 C24.5 101.5 22.2 99 22.5 96 L27 49 Z"
            stroke="#FFFFFF"
            strokeWidth="5.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            fill="none"
          />

          {/* Solid pure white heart */}
          <path
            d="M60 91.5 C60 91.5 43 78.5 43 65 C43 58 48.5 52.5 55.5 52.5 C58.2 52.5 60 54.2 60 54.2 C60 54.2 61.8 52.5 64.5 52.5 C71.5 52.5 77 58 77 65 C77 78.5 60 91.5 60 91.5 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight text-slate-900 ${textClasses[size]}`}>
              iShopp
            </span>
            <span className="bg-emerald-500 text-white font-bold text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider">
              AI
            </span>
          </div>
          <span className="text-[10px] font-medium tracking-wide text-slate-500 -mt-1 hidden sm:inline">
            Retail Intelligence Network
          </span>
        </div>
      )}
    </div>
  );
};
