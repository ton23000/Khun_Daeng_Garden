'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface ParallaxSectionProps {
    children: ReactNode;
    speed?: number;
    className?: string;
    style?: React.CSSProperties;
}

export function ParallaxSection({
    children,
    speed = 0.5,
    className = '',
    style = {}
}: ParallaxSectionProps) {
    const [offsetY, setOffsetY] = useState(0);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (ref.current) {
                // Disable parallax on mobile to prevent severe overlap
                if (window.innerWidth < 768) {
                    setOffsetY(0);
                    return;
                }

                const rect = ref.current.getBoundingClientRect();
                const scrolled = window.pageYOffset;
                const elementTop = rect.top + scrolled;
                const offset = (scrolled - elementTop) * speed;
                setOffsetY(offset);
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Add resize listener to handle orientation changes
        window.addEventListener('resize', handleScroll);
        handleScroll(); // Initial call

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, [speed]);

    return (
        <div
            ref={ref}
            className={className}
            style={{
                ...style,
                transform: `translateY(${offsetY}px)`,
                transition: 'transform 0.1s ease-out'
            }}
        >
            {children}
        </div>
    );
}
