'use client';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';

interface SlipViewerProps {
    isOpen: boolean;
    onClose: () => void;
    slipUrl: string | null;
}

export default function SlipViewer({ isOpen, onClose, slipUrl }: SlipViewerProps) {
    const [isZoomed, setIsZoomed] = useState(false);

    if (!isOpen || !slipUrl) return null;

    let slipUrls: string[] = [];
    try {
        const parsed = JSON.parse(slipUrl);
        if (Array.isArray(parsed)) {
            slipUrls = parsed;
        } else {
            slipUrls = [slipUrl];
        }
    } catch {
        slipUrls = [slipUrl];
    }

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999,
            overflow: isZoomed ? 'auto' : 'hidden'
        }} onClick={() => { setIsZoomed(false); onClose(); }}>
            <div style={{
                display: 'flex', flexDirection: isZoomed ? 'column' : 'row', gap: '1rem', overflowX: isZoomed ? 'visible' : 'auto', maxWidth: '100%', padding: '1rem',
                alignItems: 'center',
            }}>
                {slipUrls.map((url, i) => (
                    <div
                        key={i}
                        style={{
                            position: 'relative',
                            maxWidth: isZoomed ? 'none' : '90vw',
                            maxHeight: isZoomed ? 'none' : '80vh',
                            cursor: isZoomed ? 'zoom-out' : 'zoom-in',
                            transition: 'all 0.3s ease-in-out',
                            flexShrink: 0
                        }}
                        onClick={e => {
                            e.stopPropagation();
                            setIsZoomed(!isZoomed);
                        }}
                    >
                        <img
                            src={url}
                            alt={`Payment Slip ${i + 1}`}
                            style={{
                                maxWidth: isZoomed ? '100vw' : '100%',
                                maxHeight: isZoomed ? 'none' : '80vh',
                                width: 'auto',
                                objectFit: 'contain',
                                borderRadius: '0.5rem',
                                transition: 'all 0.3s ease-in-out',
                                transformOrigin: 'center center'
                            }}
                        />
                    </div>
                ))}
            </div>

            {!isZoomed && (
                <div style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)' }} onClick={e => e.stopPropagation()}>
                    <Button variant="outline" onClick={onClose} style={{ backgroundColor: 'white' }}>ปิด</Button>
                </div>
            )}
        </div>
    );
}
