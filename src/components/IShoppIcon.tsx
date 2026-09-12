import React from 'react';

interface IShoppIconProps {
  size?: number | string;
  className?: string;
  withGlow?: boolean;
}

/**
 * Exact vector graphic reproduction of the official iShopp logo badge
 * as provided in IMG-20260912-WA0001.jpg
 * - Gradient background (Coral-Red to Deep Pink)
 * - White shopping bag outline with handle arch & rivets
 * - Solid pure white heart in the center
 */
export const IShoppIcon: React.FC<IShoppIconProps> = ({
  size = 40,
  className = '',
  withGlow = false,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        height: typeof size === 'number' ? `${size}px` : size,
      }}
    >
      {withGlow && (
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FF6B42] via-[#FF3366] to-[#FF1A75] opacity-50 blur-md -z-10 animate-pulse"
        />
      )}

      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xs"
      >
        <defs>
          <linearGradient id="ishoppIconGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF6B42" />
            <stop offset="50%" stopColor="#FF3366" />
            <stop offset="100%" stopColor="#FF1A75" />
          </linearGradient>
        </defs>

        {/* Squircle Badge Background with rounded corners */}
        <rect width="120" height="120" rx="30" fill="url(#ishoppIconGradient)" />

        {/* Shopping bag handle arch */}
        <path
          d="M42 49 C42 27 50 18 60 18 C70 18 78 27 78 49"
          stroke="#FFFFFF"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Handle rivets / attachment eyelets */}
        <circle cx="42" cy="50" r="4.5" fill="#FFFFFF" />
        <circle cx="78" cy="50" r="4.5" fill="#FFFFFF" />

        {/* Shopping bag body trapezoid outline */}
        <path
          d="M27 49 H93 L97.5 96 C97.8 99 95.5 101.5 92.5 101.5 H27.5 C24.5 101.5 22.2 99 22.5 96 L27 49 Z"
          stroke="#FFFFFF"
          strokeWidth="6"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />

        {/* Solid white heart centered inside bag */}
        <path
          d="M60 91.5 C60 91.5 43 78.5 43 65 C43 58 48.5 52.5 55.5 52.5 C58.2 52.5 60 54.2 60 54.2 C60 54.2 61.8 52.5 64.5 52.5 C71.5 52.5 77 58 77 65 C77 78.5 60 91.5 60 91.5 Z"
          fill="#FFFFFF"
        />
      </svg>
    </div>
  );
};
