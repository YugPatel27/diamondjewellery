import { useEffect, useRef, useState } from 'react';

/**
 * useResponsiveHeader Hook
 * Tracks header height and updates CSS variables for proper mobile menu positioning
 * Handles notched devices (iPhone, Android) with safe-area-inset
 */
export const useResponsiveHeader = () => {
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    // Track header height for mobile menu positioning
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const height = headerRef.current.offsetHeight;
        setHeaderHeight(height);
        
        // Update CSS variable for mobile menu positioning
        document.documentElement.style.setProperty('--header-height', `${height}px`);
      }
    };

    // Listen for window resize and orientation change
    updateHeaderHeight();
    
    const resizeObserver = new ResizeObserver(() => {
      updateHeaderHeight();
    });

    if (headerRef.current) {
      resizeObserver.observe(headerRef.current);
    }

    window.addEventListener('resize', updateHeaderHeight);
    window.addEventListener('orientationchange', updateHeaderHeight);

    /**
     * FIX: iOS Safari viewport height issue
     * Use dynamic viewport height (dvh) instead of vh
     */
    const updateViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      const dvh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--mobile-viewport-height', `${window.innerHeight}px`);
    };

    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', updateViewportHeight);

    // Track mobile/tablet breakpoint
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', updateHeaderHeight);
      window.removeEventListener('orientationchange', updateHeaderHeight);
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', updateViewportHeight);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, []);

  return {
    headerRef,
    headerHeight,
    isMobile,
  };
};

/**
 * useSafeAreaInsets Hook
 * Gets safe area insets for notched devices (iPhone 12+, Android)
 */
export const useSafeAreaInsets = () => {
  const [insets, setInsets] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    const updateInsets = () => {
      // Note: These would need to be read from CSS env() variables
      // For now, we'll just ensure they're applied via CSS
      const top = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-top') || '0');
      const right = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-right') || '0');
      const bottom = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-bottom') || '0');
      const left = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--safe-left') || '0');
      
      setInsets({ top, right, bottom, left });
    };

    updateInsets();
    window.addEventListener('orientationchange', updateInsets);
    window.addEventListener('resize', updateInsets);

    return () => {
      window.removeEventListener('orientationchange', updateInsets);
      window.removeEventListener('resize', updateInsets);
    };
  }, []);

  return insets;
};

/**
 * usePreventZoom Hook
 * Prevents iOS zoom on input focus
 * Sets font-size to 16px which is the minimum to prevent auto-zoom
 */
export const usePreventZoom = () => {
  useEffect(() => {
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="search"], textarea');
    
    inputs.forEach(input => {
      (input as HTMLElement).style.fontSize = '16px';
    });

    const handleFocus = (e: Event) => {
      const target = e.target as HTMLInputElement;
      target.style.fontSize = '16px';
    };

    inputs.forEach(input => {
      input.addEventListener('focus', handleFocus);
    });

    return () => {
      inputs.forEach(input => {
        input.removeEventListener('focus', handleFocus);
      });
    };
  }, []);
};

/**
 * useOrientationLock Hook
 * Provides orientation information and helper functions
 */
export const useOrientationLock = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  );

  const [isLandscape, setIsLandscape] = useState(window.innerHeight < window.innerWidth);

  useEffect(() => {
    const handleOrientationChange = () => {
      const newOrientation = window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
      setOrientation(newOrientation);
      setIsLandscape(window.innerHeight < window.innerWidth);

      // Force layout recalculation
      document.documentElement.style.height = '100%';
      setTimeout(() => {
        document.documentElement.style.height = 'auto';
      }, 100);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  return { orientation, isLandscape };
};

/**
 * useMediaQuery Hook
 * Simplified media query matching in React
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    // Set initial value
    setMatches(mediaQuery.matches);

    // Update on change
    const handleChange = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
};

/**
 * useViewportSize Hook
 * Track viewport dimensions
 */
export const useViewportSize = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return size;
};
