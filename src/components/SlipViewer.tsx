'use client';

import { Button } from '@/components/ui/Button';

interface SlipViewerProps {
    isOpen: boolean;
    onClose: () => void;
    slipUrl: string | null;
}

export default function SlipViewer({ isOpen, onClose, slipUrl }: SlipViewerProps) {
    if (!isOpen || !slipUrl) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60
        }} onClick={onClose}>
            <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }} onClick={e => e.stopPropagation()}>
                <img src={slipUrl} alt="Payment Slip" style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '0.5rem' }} />
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                    <Button variant="outline" onClick={onClose} style={{ backgroundColor: 'white' }}>ปิด</Button>
                </div>
            </div>
        </div>
    );
}
