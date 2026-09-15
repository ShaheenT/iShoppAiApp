import React from 'react';

export type SupportedRetailerId =
  | 'checkers'
  | 'picknpay'
  | 'woolworths'
  | 'shoprite'
  | 'spar'
  | 'dischem'
  | 'clicks'
  | 'boxer'
  | 'makro'
  | 'game';

export interface RetailerBrandInfo {
  id: SupportedRetailerId;
  name: string;
  shortName: string;
  tagline: string;
  primaryColor: string;
  accentColor: string;
  bgGradient: string;
}

export const LEADING_RETAILERS: RetailerBrandInfo[] = [
  {
    id: 'checkers',
    name: 'CHECKERS',
    shortName: 'Checkers',
    tagline: 'Better and Better',
    primaryColor: '#00833E',
    accentColor: '#F58220',
    bgGradient: 'from-emerald-600/20 to-emerald-950/40',
  },
  {
    id: 'picknpay',
    name: 'PICK N PAY',
    shortName: 'Pick n Pay',
    tagline: 'Smart Shopper',
    primaryColor: '#003876',
    accentColor: '#E31B23',
    bgGradient: 'from-blue-700/20 to-red-950/30',
  },
  {
    id: 'woolworths',
    name: 'WOOLWORTHS',
    shortName: 'Woolworths',
    tagline: 'The Difference',
    primaryColor: '#111827',
    accentColor: '#10B981',
    bgGradient: 'from-zinc-700/30 to-black',
  },
  {
    id: 'shoprite',
    name: 'SHOPRITE',
    shortName: 'Shoprite',
    tagline: 'Lower Prices You Can Trust',
    primaryColor: '#ED1C24',
    accentColor: '#FFCC00',
    bgGradient: 'from-red-600/20 to-amber-950/30',
  },
  {
    id: 'spar',
    name: 'SPAR',
    shortName: 'SPAR',
    tagline: 'Better Together',
    primaryColor: '#007A3D',
    accentColor: '#E30613',
    bgGradient: 'from-emerald-700/20 to-red-950/30',
  },
  {
    id: 'dischem',
    name: 'DIS-CHEM',
    shortName: 'Dis-Chem',
    tagline: 'Pharmacies',
    primaryColor: '#008542',
    accentColor: '#10B981',
    bgGradient: 'from-emerald-600/20 to-teal-950/30',
  },
  {
    id: 'clicks',
    name: 'CLICKS',
    shortName: 'CLICKS',
    tagline: 'Feel Good Pay Less',
    primaryColor: '#004B87',
    accentColor: '#00A4E4',
    bgGradient: 'from-sky-600/20 to-blue-950/40',
  },
];

interface RetailerLogoProps {
  retailerId: string;
  size?: number;
  className?: string;
}

/**
 * High-definition vector logos for South Africa's premier supermarket and pharmacy giants.
 */
export const RetailerLogo: React.FC<RetailerLogoProps> = ({
  retailerId,
  size = 32,
  className = '',
}) => {
  const normalizedId = retailerId.toLowerCase().replace(/[^a-z]/g, '');

  // 1. CHECKERS: Iconic teal/emerald roundel with white 'C' crest and orange flag flare
  if (normalizedId.includes('checker')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
      >
        <rect width="100" height="100" rx="24" fill="#00833E" />
        {/* Subtle checkered flag motif background */}
        <path d="M12 18h12v12H12zM36 18h12v12H36zM24 30h12v12H24z" fill="#006830" opacity="0.4" />
        {/* Golden-Orange swoosh */}
        <path
          d="M24 76c18 10 44 8 56-6"
          stroke="#F58220"
          strokeWidth="7"
          strokeLinecap="round"
        />
        {/* Iconic White Bold Double-C Motif */}
        <path
          d="M66 32c-6-6-15-8-23-4-10 5-15 16-14 27 1 11 9 20 20 21 8 0 16-4 20-10"
          stroke="#FFFFFF"
          strokeWidth="11"
          strokeLinecap="round"
        />
        <circle cx="68" cy="38" r="4.5" fill="#F58220" />
      </svg>
    );
  }

  // 2. PICK N PAY: Iconic navy squircle with stylized 'P' and vibrant red accent
  if (normalizedId.includes('pick') || normalizedId.includes('pnp')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
      >
        <rect width="100" height="100" rx="24" fill="#003876" />
        {/* Red brand flare in bottom corner */}
        <circle cx="86" cy="18" r="9" fill="#E31B23" />
        {/* Signature PnP 'P' monogram */}
        <path
          d="M30 76V24h24c11 0 19 8 19 18s-8 18-19 18H44v16H30z"
          fill="#FFFFFF"
        />
        <path
          d="M44 36v12h10c4.5 0 8-2.7 8-6s-3.5-6-8-6H44z"
          fill="#003876"
        />
        <rect x="58" y="58" width="16" height="18" rx="4" fill="#E31B23" />
        <path d="M63 67h6" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  // 3. WOOLWORTHS: Minimalist luxury jet-black squircle with razor-sharp geometric 'W'
  if (normalizedId.includes('wool') || normalizedId.includes('wrewards')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
      >
        <rect width="100" height="100" rx="24" fill="#0D0E12" stroke="#27272A" strokeWidth="2" />
        {/* Modern high-contrast luxury Woolworths 'W' */}
        <path
          d="M20 30L34 72L46 42L50 42L62 72L76 30"
          stroke="#FFFFFF"
          strokeWidth="7.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Distinctive Woolies green point */}
        <circle cx="50" cy="24" r="3.5" fill="#10B981" />
      </svg>
    );
  }

  // 4. SHOPRITE: Iconic crimson red roundel with yellow shopping swish and 'S'
  if (normalizedId.includes('shoprite')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
      >
        <rect width="100" height="100" rx="24" fill="#ED1C24" />
        {/* Yellow inner ring accent */}
        <circle cx="50" cy="50" r="41" stroke="#FFCC00" strokeWidth="4" opacity="0.9" />
        {/* Bold Shoprite 'S' / Cart monogram */}
        <path
          d="M66 35c-4-4-10-6-16-6-10 0-17 6-17 14 0 17 34 8 34 25 0 9-8 15-18 15-8 0-15-4-19-10"
          stroke="#FFFFFF"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M32 75l10-4M68 25l-8 4"
          stroke="#FFCC00"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // 5. SPAR: World-renowned SPAR green roundel with red ring and white/green fir tree
  if (normalizedId.includes('spar')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
      >
        {/* Outer Red Ring */}
        <rect width="100" height="100" rx="24" fill="#E30613" />
        {/* White Inner Circle */}
        <circle cx="50" cy="50" r="36" fill="#FFFFFF" />
        {/* SPAR Fir Tree in Deep Green */}
        <path
          d="M50 20L31 46h11L26 67h48L58 46h11L50 20z"
          fill="#007A3D"
        />
        {/* Trunk */}
        <rect x="46.5" y="67" width="7" height="9" fill="#007A3D" />
      </svg>
    );
  }

  // 6. DIS-CHEM: Iconic medical green cross with white Caduceus & pharmacy leaf
  if (normalizedId.includes('dischem') || normalizedId.includes('dis-chem')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
      >
        <rect width="100" height="100" rx="24" fill="#008542" />
        {/* Pharmacy Cross */}
        <path
          d="M38 18h24v20h20v24H62v20H38V62H18V38h20V18z"
          fill="#FFFFFF"
        />
        {/* Medical Caduceus / serpent wave inside */}
        <path
          d="M50 26v48M42 36c4-3 12-3 16 0M58 48c-4 3-12 3-16 0M42 60c4-3 12-3 16 0"
          stroke="#008542"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="50" cy="24" r="3" fill="#10B981" />
      </svg>
    );
  }

  // 7. CLICKS: Iconic blue and cyan rounded cross / petal pharmacy emblem
  if (normalizedId.includes('click')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
      >
        <rect width="100" height="100" rx="24" fill="#004B87" />
        {/* Clicks 4-Petal Rounded Cross in Cyan and White */}
        <circle cx="50" cy="32" r="14" fill="#00A4E4" />
        <circle cx="50" cy="68" r="14" fill="#00A4E4" />
        <circle cx="32" cy="50" r="14" fill="#00A4E4" />
        <circle cx="68" cy="50" r="14" fill="#00A4E4" />
        <rect x="36" y="36" width="28" height="28" rx="6" fill="#FFFFFF" />
        <path
          d="M57 43c-3-2-7-3-11-1-5 3-7 8-6 14 1 5 5 9 10 9 4 0 8-2 10-5"
          stroke="#004B87"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  // 8. BOXER SUPERSTORES
  if (normalizedId.includes('boxer')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
      >
        <rect width="100" height="100" rx="24" fill="#E30613" />
        <path
          d="M28 72V28h22c8 0 14 5 14 11 0 4-2 7-6 9 5 2 8 6 8 11 0 7-6 13-16 13H28zm14-28h8c3 0 5-2 5-4s-2-4-5-4h-8v8zm0 16h9c3 0 6-2 6-5s-3-5-6-5h-9v10z"
          fill="#FFFFFF"
        />
      </svg>
    );
  }

  // 9. MAKRO
  if (normalizedId.includes('makro')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
      >
        <rect width="100" height="100" rx="24" fill="#003399" />
        <rect x="14" y="66" width="72" height="10" rx="4" fill="#FFDF00" />
        <path
          d="M24 60V30l16 20 16-20v30M66 60V30h12"
          stroke="#FFFFFF"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // 10. GAME
  if (normalizedId.includes('game')) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 ${className}`}
      >
        <rect width="100" height="100" rx="24" fill="#EC008C" />
        <circle cx="50" cy="50" r="28" stroke="#FFFFFF" strokeWidth="8" />
        <path d="M50 34v16h14" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
      </svg>
    );
  }

  // Fallback generic retail cart
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <rect width="100" height="100" rx="24" fill="#334155" />
      <path
        d="M28 32h10l8 32h26l8-22H36"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="48" cy="74" r="5" fill="#FFFFFF" />
      <circle cx="70" cy="74" r="5" fill="#FFFFFF" />
    </svg>
  );
};

interface RetailerBrandItemProps {
  id: SupportedRetailerId;
  name: string;
  tagline?: string;
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Cohesive Brand Badge that presents the official vector logo alongside the bold brand name.
 */
export const RetailerBrandItem: React.FC<RetailerBrandItemProps> = ({
  id,
  name,
  tagline,
  theme = 'dark',
  size = 'md',
  showTagline = false,
  className = '',
  onClick,
}) => {
  const isDark = theme === 'dark';
  const logoSize = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;

  return (
    <div
      onClick={onClick}
      className={`group relative flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 border ${
        isDark
          ? 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 hover:border-white/20 text-white shadow-md shadow-black/40'
          : 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-900 shadow-sm hover:shadow-md'
      } ${onClick ? 'cursor-pointer active:scale-95' : ''} ${className}`}
    >
      {/* Brand Vector Logo */}
      <div className="shrink-0 transition-transform duration-200 group-hover:scale-105">
        <RetailerLogo retailerId={id} size={logoSize} />
      </div>

      {/* Brand Name & Optional Tagline */}
      <div className="flex flex-col min-w-0">
        <span
          className={`font-black tracking-wider uppercase leading-tight truncate ${
            size === 'sm'
              ? 'text-xs'
              : size === 'lg'
              ? 'text-base sm:text-lg'
              : 'text-sm sm:text-base'
          } ${isDark ? 'text-white' : 'text-slate-900'}`}
        >
          {name}
        </span>
        {showTagline && tagline && (
          <span
            className={`text-[10px] font-semibold tracking-normal mt-0.5 truncate ${
              isDark ? 'text-white/50' : 'text-slate-500'
            }`}
          >
            {tagline}
          </span>
        )}
      </div>
    </div>
  );
};
