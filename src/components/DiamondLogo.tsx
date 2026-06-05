/**
 * Diamond Jewels - SVG Logo Component
 * Elegant diamond logo with brand name
 */

interface DiamondLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  withText?: boolean;
  className?: string;
}

const sizeMaps = {
  sm: { width: 32, height: 32, textSize: '12px' },
  md: { width: 48, height: 48, textSize: '14px' },
  lg: { width: 80, height: 80, textSize: '18px' },
  xl: { width: 120, height: 120, textSize: '24px' },
};

/**
 * DiamondLogo Component
 * Renders the Diamond Jewels logo as SVG
 * @param size - Logo size ('sm', 'md', 'lg', 'xl')
 * @param withText - Include brand name text
 * @param className - Additional CSS classes
 */
export const DiamondLogo = ({ size = 'md', withText = false, className = '' }: DiamondLogoProps) => {
  const sizeConfig = sizeMaps[size];
  const w = sizeConfig.width;
  const h = sizeConfig.height;

  // SVG viewBox dimensions for scalability
  const svgSize = 120;

  return (
    <svg
      width={w}
      height={withText ? w * 1.4 : h}
      viewBox={`0 0 ${svgSize} ${withText ? svgSize * 1.4 : svgSize}`}
      xmlns="http://www.w3.org/2000/svg"
      className={`diamond-logo ${className}`}
      data-testid="diamond-logo"
    >
      {/* Logo Group */}
      <g transform={`translate(${svgSize / 2}, ${withText ? svgSize / 2 : svgSize / 2})`}>
        {/* Outer Diamond Shape - Light Gray Outline */}
        <path
          d="M 0 -35 L 25 -10 L 25 20 L 0 35 L -25 20 L -25 -10 Z"
          fill="none"
          stroke="#C0C0C0"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Inner Diamond Grid Lines - Light Gray */}
        {/* Horizontal lines */}
        <line x1="-20" y1="-20" x2="20" y2="-20" stroke="#D3D3D3" strokeWidth="1" opacity="0.6" />
        <line x1="-25" y1="0" x2="25" y2="0" stroke="#D3D3D3" strokeWidth="1" opacity="0.6" />
        <line x1="-20" y1="20" x2="20" y2="20" stroke="#D3D3D3" strokeWidth="1" opacity="0.6" />

        {/* Vertical lines */}
        <line x1="0" y1="-35" x2="0" y2="35" stroke="#D3D3D3" strokeWidth="1" opacity="0.6" />
        <line x1="-15" y1="-25" x2="-15" y2="25" stroke="#D3D3D3" strokeWidth="1" opacity="0.5" />
        <line x1="15" y1="-25" x2="15" y2="25" stroke="#D3D3D3" strokeWidth="1" opacity="0.5" />

        {/* Diagonal lines for depth */}
        <line x1="-12" y1="-15" x2="12" y2="15" stroke="#D3D3D3" strokeWidth="0.8" opacity="0.4" />
        <line x1="12" y1="-15" x2="-12" y2="15" stroke="#D3D3D3" strokeWidth="0.8" opacity="0.4" />

        {/* Gold/Brown Center Accent - Curved */}
        <path
          d="M -18 -8 Q -10 0 0 8 Q 10 0 18 -8"
          fill="none"
          stroke="#B8860B"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />

        {/* Gold/Brown Accent Curved Down */}
        <path
          d="M -15 10 Q 0 5 15 10"
          fill="none"
          stroke="#C69C6D"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Shine/Sparkle Effect - Top Point */}
        <g>
          {/* Main sparkle lines */}
          <line x1="0" y1="-38" x2="0" y2="-45" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
          <line x1="-4" y1="-36" x2="-8" y2="-40" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          <line x1="4" y1="-36" x2="8" y2="-40" stroke="#FFD700" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        </g>

        {/* Center Diamond - Bright Shine */}
        <circle cx="0" cy="-3" r="4" fill="#FFD700" opacity="0.8" />
        <circle cx="0" cy="-3" r="2.5" fill="#FFFFFF" opacity="0.6" />
      </g>

      {/* Brand Text */}
      {withText && (
        <g transform={`translate(${svgSize / 2}, ${svgSize + 25})`} textAnchor="middle">
          {/* Brand Name */}
          <text
            fontSize={sizeConfig.textSize}
            fontFamily="Georgia, serif"
            fontWeight="300"
            fill="currentColor"
            letterSpacing="2"
            dy="0.3em"
          >
            Diamond Jewels
          </text>
          {/* Tagline */}
          <text
            fontSize={`${parseInt(sizeConfig.textSize) * 0.6}px`}
            fontFamily="Georgia, serif"
            fill="currentColor"
            opacity="0.6"
            dy="1.8em"
            letterSpacing="1"
          >
            LUXURY COLLECTION
          </text>
        </g>
      )}
    </svg>
  );
};

/**
 * Simple Diamond Favicon Logo
 * Minimal version for favicons
 */
export const DiamondLogoMini = ({ className = '' }: { className?: string }) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
      className={`diamond-logo-mini ${className}`}
    >
      {/* Minimal Diamond Shape */}
      <path
        d="M 16 2 L 24 10 L 24 20 L 16 28 L 8 20 L 8 10 Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.5"
      />
      {/* Shine */}
      <circle cx="16" cy="12" r="2" fill="white" opacity="0.7" />
    </svg>
  );
};

export default DiamondLogo;
