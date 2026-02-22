'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
    endDate: string;
    style?: React.CSSProperties;
}

export default function CountdownTimer({ endDate, style }: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const calculateTime = () => {
            const now = new Date().getTime();
            const end = new Date(endDate).getTime();
            const diff = end - now;

            if (diff <= 0) {
                setIsExpired(true);
                return;
            }

            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000)
            });
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000);
        return () => clearInterval(timer);
    }, [endDate]);

    if (isExpired) {
        return null;
    }

    const timeBlocks = [
        { value: timeLeft.days, label: 'วัน' },
        { value: timeLeft.hours, label: 'ชม.' },
        { value: timeLeft.minutes, label: 'นาที' },
        { value: timeLeft.seconds, label: 'วินาที' }
    ];

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            ...style
        }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 'bold', marginRight: '0.25rem' }}>⏰ หมดเวลาใน:</span>
            {timeBlocks.map((block, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <div style={{
                        backgroundColor: '#1f2937',
                        color: 'white',
                        padding: '0.375rem 0.5rem',
                        borderRadius: '0.375rem',
                        minWidth: '36px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        fontVariantNumeric: 'tabular-nums'
                    }}>
                        {String(block.value).padStart(2, '0')}
                    </div>
                    <span style={{ fontSize: '0.625rem', color: '#6b7280' }}>{block.label}</span>
                    {i < timeBlocks.length - 1 && <span style={{ color: '#9ca3af', fontWeight: 'bold' }}>:</span>}
                </div>
            ))}
        </div>
    );
}
