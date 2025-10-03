import { useState, useEffect } from 'react';

export const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
};

function getBreakpoint(width: number) {
    if (width < breakpoints.sm) return 'xs';
    if (width < breakpoints.md) return 'sm';
    if (width < breakpoints.lg) return 'md';
    if (width < breakpoints.xl) return 'lg';
    return 'xl';
}

export function useBreakpoint() {
    const [bp, setBp] = useState(() => getBreakpoint(window.innerWidth));
    useEffect(() => {
        const onResize = () => setBp(getBreakpoint(window.innerWidth));
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);
    return {
        breakpoint: bp,
        isMobile: bp === 'xs' || bp === 'sm',
        isTablet: bp === 'md',
        isDesktop: bp === 'lg' || bp === 'xl',
    };
}
