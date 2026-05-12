'use client';
import { useEffect, useState } from 'react';

interface SlipViewerProps {
    isOpen: boolean;
    onClose: () => void;
    /** ทุก URL สลีปของ booking นั้น */
    slipUrls: string[];
    /** index ของรูปที่คลิก */
    startIndex?: number;
    /** ถ้ามี → แสดงปุ่มลบ */
    onDelete?: (index: number) => void;
}

export default function SlipViewer({
    isOpen,
    onClose,
    slipUrls,
    startIndex = 0,
    onDelete,
}: SlipViewerProps) {
    const [current, setCurrent] = useState(startIndex);

    // ซิงค์ index เมื่อเปิดใหม่
    useEffect(() => {
        if (isOpen) setCurrent(startIndex);
    }, [isOpen, startIndex]);

    // กด Esc ปิด / arrow ซ้าย-ขวา
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') setCurrent(c => Math.max(0, c - 1));
            if (e.key === 'ArrowRight') setCurrent(c => Math.min(slipUrls.length - 1, c + 1));
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose, slipUrls.length]);

    if (!isOpen || slipUrls.length === 0) return null;

    const url = slipUrls[current];
    const total = slipUrls.length;

    const handleDelete = () => {
        if (!onDelete) return;
        if (!confirm(`ลบสลีปรูปที่ ${current + 1} ออก?`)) return;
        onDelete(current);
        // ถ้าลบรูปสุดท้าย ให้เลื่อนกลับ
        if (current >= total - 1) {
            if (total - 1 === 0) {
                onClose();
            } else {
                setCurrent(total - 2);
            }
        }
    };

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0,0,0,0.92)',
                zIndex: 99999,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
            }}
        >
            {/* ── Top bar ── */}
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 1.25rem',
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)',
                    zIndex: 10,
                }}
            >
                {/* ตัวนับ */}
                <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', fontWeight: 600 }}>
                    สลีป {current + 1} / {total}
                </span>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {/* ปุ่มลบ */}
                    {onDelete && (
                        <button
                            onClick={handleDelete}
                            style={{
                                padding: '0.4rem 0.9rem',
                                borderRadius: '0.5rem',
                                border: 'none',
                                backgroundColor: '#ef4444',
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                            }}
                        >
                            🗑️ ลบรูปนี้
                        </button>
                    )}
                    {/* ปุ่มปิด */}
                    <button
                        onClick={onClose}
                        style={{
                            width: 36, height: 36,
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            color: 'white',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                    >✕</button>
                </div>
            </div>

            {/* ── รูปหลัก ── */}
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100vh',
                    padding: '4.5rem 4rem',
                    boxSizing: 'border-box',
                }}
            >
                {/* ลูกศรซ้าย */}
                {total > 1 && (
                    <button
                        onClick={() => setCurrent(c => Math.max(0, c - 1))}
                        disabled={current === 0}
                        style={{
                            position: 'fixed', left: '0.75rem',
                            top: '50%', transform: 'translateY(-50%)',
                            width: 44, height: 44,
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: current === 0 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.25)',
                            color: 'white', fontSize: '1.3rem',
                            cursor: current === 0 ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'background 0.2s',
                        }}
                    >‹</button>
                )}

                <img
                    key={url}
                    src={url}
                    alt={`สลีป ${current + 1}`}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain',
                        borderRadius: '0.5rem',
                        boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
                        animation: 'slipFadeIn 0.2s ease',
                        display: 'block',
                    }}
                />

                {/* ลูกศรขวา */}
                {total > 1 && (
                    <button
                        onClick={() => setCurrent(c => Math.min(total - 1, c + 1))}
                        disabled={current === total - 1}
                        style={{
                            position: 'fixed', right: '0.75rem',
                            top: '50%', transform: 'translateY(-50%)',
                            width: 44, height: 44,
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: current === total - 1 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.25)',
                            color: 'white', fontSize: '1.3rem',
                            cursor: current === total - 1 ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'background 0.2s',
                        }}
                    >›</button>
                )}
            </div>

            {/* ── Thumbnail bar ── */}
            {total > 1 && (
                <div
                    onClick={e => e.stopPropagation()}
                    style={{
                        position: 'fixed',
                        bottom: '1rem',
                        left: '50%', transform: 'translateX(-50%)',
                        display: 'flex', gap: '0.5rem',
                        padding: '0.5rem 0.75rem',
                        backgroundColor: 'rgba(0,0,0,0.55)',
                        borderRadius: '9999px',
                        backdropFilter: 'blur(6px)',
                    }}
                >
                    {slipUrls.map((u, i) => (
                        <img
                            key={i}
                            src={u}
                            alt={`thumb ${i + 1}`}
                            onClick={() => setCurrent(i)}
                            style={{
                                width: 46, height: 46,
                                objectFit: 'cover',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                                border: i === current ? '2px solid white' : '2px solid transparent',
                                opacity: i === current ? 1 : 0.55,
                                transition: 'all 0.2s',
                            }}
                        />
                    ))}
                </div>
            )}

            <style>{`
                @keyframes slipFadeIn {
                    from { opacity: 0; transform: scale(0.96); }
                    to   { opacity: 1; transform: scale(1); }
                }
            `}</style>
        </div>
    );
}
