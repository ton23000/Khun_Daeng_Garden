'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface ScrollAnimationProps {
    children: ReactNode;
    animation?: 'fade-up' | 'slide-in-left' | 'slide-in-right' | 'fade-in';
    delay?: number;
    className?: string;
    style?: React.CSSProperties;
}

export function ScrollAnimation({
    children,
    animation = 'fade-up',
    delay = 0,
    className = '',
    style
}: ScrollAnimationProps) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    const animationStyles: Record<string, React.CSSProperties> = {
        'fade-up': {
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`
        },
        'slide-in-left': {
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateX(0)' : 'translateX(-50px)',
            transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`
        },
        'slide-in-right': {
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateX(0)' : 'translateX(50px)',
            transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`
        },
        'fade-in': {
            opacity: isVisible ? 1 : 0,
            transition: `opacity 0.8s ease-out ${delay}ms`
        }
    };

    return (
        <div ref={ref} style={{ ...animationStyles[animation], ...style }} className={className}>
            {children}
        </div>
    );
}
