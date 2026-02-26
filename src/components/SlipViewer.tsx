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

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 99999,
            overflow: isZoomed ? 'auto' : 'hidden'
        }} onClick={() => { setIsZoomed(false); onClose(); }}>
            <div
                style={{
                    position: 'relative',
                    maxWidth: isZoomed ? 'none' : '90%',
                    maxHeight: isZoomed ? 'none' : '90%',
                    cursor: isZoomed ? 'zoom-out' : 'zoom-in',
                    transition: 'all 0.3s ease-in-out'
                }}
                onClick={e => {
                    e.stopPropagation();
                    setIsZoomed(!isZoomed);
                }}
            >
                <img
                    src={slipUrl}
                    alt="Payment Slip"
                    style={{
                        maxWidth: isZoomed ? 'none' : '100%',
                        maxHeight: isZoomed ? 'none' : '80vh',
                        width: isZoomed ? '100vw' : 'auto',
                        objectFit: 'contain',
                        borderRadius: '0.5rem',
                        transition: 'all 0.3s ease-in-out',
                        transformOrigin: 'center center'
                    }}
                />

                {!isZoomed && (
                    <div style={{ marginTop: '1rem', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                        <Button variant="outline" onClick={onClose} style={{ backgroundColor: 'white' }}>ปิด</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
