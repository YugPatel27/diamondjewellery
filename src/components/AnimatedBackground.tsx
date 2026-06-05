import { useMemo } from 'react';

interface AnimatedBackgroundProps {
  type: 'ring' | 'bespoke' | 'bracelet' | 'wedding-ring' | 'ring-collab' | 'solitaire' | 'earring' | 'diamond';
  className?: string;
}

const AnimatedBackground = ({ type, className = "" }: AnimatedBackgroundProps) => {

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Gradient overlay only - particles removed */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-background/60" />
    </div>
  );
};

export default AnimatedBackground;
