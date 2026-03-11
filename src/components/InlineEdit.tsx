'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Pencil, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface InlineEditProps {
    settingKey: string;
    initialValue: string;
    renderAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'a';
    className?: string;
    style?: React.CSSProperties;
    multiline?: boolean;
    allowStyleEdit?: boolean;
    initialColor?: string;
    initialBgColor?: string;
    initialFontSize?: string;
    useSpecialTitleFormat?: boolean;
    children?: React.ReactNode;
}

export default function InlineEdit({
    settingKey,
    initialValue,
    renderAs = 'p',
    className = '',
    style = {},
    multiline = false,
    useSpecialTitleFormat = false,
    allowStyleEdit = false,
    initialColor = '',
    initialBgColor = '',
    initialFontSize = '',
    children
}: InlineEditProps) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);
    const [color, setColor] = useState(initialColor);
    const [bgColor, setBgColor] = useState(initialBgColor);
    const [fontSize, setFontSize] = useState(initialFontSize);
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    const isAdmin = !isLoading && user?.role === 'admin';

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            // Move cursor to end
            const length = inputRef.current.value.length;
            inputRef.current.setSelectionRange(length, length);
        }
    }, [isEditing]);

    const handleSave = async (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (value === initialValue && color === initialColor && bgColor === initialBgColor && fontSize === initialFontSize) {
            setIsEditing(false);
            return;
        }

        setIsSaving(true);
        try {
            // Get userId from localStorage (same as the rest of the app)
            const storedUser = localStorage.getItem('khun_daeng_user');
            const userId = storedUser ? JSON.parse(storedUser).id : null;

            const payload: Record<string, string> = { [settingKey]: value };
            if (allowStyleEdit) {
                if (color) payload[`${settingKey}_color`] = color;
                if (bgColor) payload[`${settingKey}_bgColor`] = bgColor;
                if (fontSize) payload[`${settingKey}_fontSize`] = fontSize;
            }

            const res = await fetch('/api/settings', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    ...(userId ? { 'x-user-id': userId } : {})
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setIsEditing(false);
                router.refresh();
            } else {
                alert('Failed to save settings');
            }
        } catch (error) {
            console.error('Error saving:', error);
            alert('Error saving settings');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setValue(initialValue);
        setColor(initialColor);
        setBgColor(initialBgColor);
        setFontSize(initialFontSize);
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setValue(initialValue);
            setColor(initialColor);
            setBgColor(initialBgColor);
            setFontSize(initialFontSize);
            setIsEditing(false);
        } else if (e.key === 'Enter' && !multiline) {
            e.preventDefault();
            handleSave();
        }
    };

    if (isEditing) {
        return (
            <div style={{ position: 'relative', display: 'inline-block', width: '100%', zIndex: 50 }} onClick={e => e.stopPropagation()}>
                {multiline ? (
                    <textarea
                        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{
                            ...style,
                            width: '100%',
                            minHeight: '100px',
                            padding: '0.5rem',
                            border: '2px dashed rgba(0,0,0,0.2)',
                            borderRadius: '0.375rem',
                            background: bgColor === 'transparent' ? 'rgba(255,255,255,0.2)' : (bgColor || 'rgba(255,255,255,0.8)'),
                            color: color === 'transparent' ? 'inherit' : (color || 'inherit'),
                            fontFamily: 'inherit',
                            fontSize: 'inherit',
                            fontWeight: 'inherit',
                            lineHeight: 'inherit',
                            outline: 'none'
                        }}
                        className={className}
                    />
                ) : (
                    <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{
                            ...style,
                            width: '100%',
                            padding: '0.25rem 0.5rem',
                            border: '2px dashed rgba(0,0,0,0.2)',
                            borderRadius: '0.375rem',
                            background: bgColor === 'transparent' ? 'rgba(255,255,255,0.2)' : (bgColor || 'rgba(255,255,255,0.8)'),
                            color: color === 'transparent' ? 'inherit' : (color || 'inherit'),
                            fontFamily: 'inherit',
                            fontSize: 'inherit',
                            fontWeight: 'inherit',
                            lineHeight: 'inherit',
                            outline: 'none'
                        }}
                        className={className}
                    />
                )}

                {allowStyleEdit && (
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', flexWrap: 'wrap', backgroundColor: '#f9fafb', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #e5e7eb' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#374151' }}>
                            สีข้อความ:
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <input type="color" value={color === 'transparent' ? '#000000' : (color && /^#[0-9A-Fa-f]{6}$/i.test(color) ? color : '#000000')} onChange={e => setColor(e.target.value)} style={{ cursor: 'pointer', height: '28px', width: '36px', padding: 0, border: 'none', opacity: color === 'transparent' ? 0.3 : 1 }} />
                                <button type="button" onClick={() => setColor(color === 'transparent' ? '#000000' : 'transparent')} style={{ fontSize: '0.75rem', padding: '0.2rem 0.4rem', border: '1px solid #d1d5db', borderRadius: '4px', background: color === 'transparent' ? '#e5e7eb' : 'white', cursor: 'pointer' }}>ไม่มีสี</button>
                            </div>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#374151' }}>
                            สีพื้นหลัง:
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <input type="color" value={bgColor === 'transparent' ? '#ffffff' : (bgColor && /^#[0-9A-Fa-f]{6}$/i.test(bgColor) ? bgColor : '#ffffff')} onChange={e => setBgColor(e.target.value)} style={{ cursor: 'pointer', height: '28px', width: '36px', padding: 0, border: 'none', opacity: bgColor === 'transparent' ? 0.3 : 1 }} />
                                <button type="button" onClick={() => setBgColor(bgColor === 'transparent' ? '#ffffff' : 'transparent')} style={{ fontSize: '0.75rem', padding: '0.2rem 0.4rem', border: '1px solid #d1d5db', borderRadius: '4px', background: bgColor === 'transparent' ? '#e5e7eb' : 'white', cursor: 'pointer' }}>ไม่มีสี</button>
                            </div>
                        </label>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#374151' }}>
                            ขนาด (เช่น 2rem, 32px):
                            <input type="text" value={fontSize} onChange={e => setFontSize(e.target.value)} placeholder="เช่น 2rem หรือ 32px" style={{ padding: '0.25rem 0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', width: '150px' }} />
                        </label>
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        style={{
                            backgroundColor: '#16a34a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: isSaving ? 0.7 : 1,
                            fontSize: '0.875rem'
                        }}
                        title="บันทึก (Enter)"
                    >
                        <Check size={16} style={{ marginRight: '4px' }}/> บันทึก
                    </button>
                    <button
                        onClick={handleCancel}
                        disabled={isSaving}
                        style={{
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '6px 12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: isSaving ? 0.7 : 1,
                            fontSize: '0.875rem'
                        }}
                        title="ยกเลิก (Esc)"
                    >
                        <X size={16} style={{ marginRight: '4px' }}/> ยกเลิก
                    </button>
                </div>
            </div>
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Tag = renderAs as any;

    let content: React.ReactNode = value;
    if (useSpecialTitleFormat && value.includes('|')) {
        content = (
            <>
                {value.split('|')[0]}
                <br className="hidden-mobile" />
                <span style={{
                    fontStyle: 'italic',
                    fontWeight: '400',
                    color: color || 'var(--primary)',
                    display: 'inline-block'
                }}>{value.split('|')[1]}</span>
            </>
        );
    }

    const appliedStyle = { ...style };
    if (allowStyleEdit) {
        if (color) appliedStyle.color = color;
        if (bgColor) appliedStyle.background = bgColor;
        if (fontSize) appliedStyle.fontSize = fontSize;
    }

    if (!isAdmin) {
        return (
            <Tag style={appliedStyle} className={className}>
                {content}
                {children}
            </Tag>
        );
    }

    return (
        <Tag
            onClick={(e: React.MouseEvent) => {
                // If it's a link parent, prevent it from triggering when clicking inside InlineEdit
                // ONLY if the click was not on an explicitly interactive child like a button or link
                const target = e.target as HTMLElement;
                const isInteractiveChild = target.closest('button, a, [role="button"]');
                if (!isInteractiveChild) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }}
            style={{ 
                position: 'relative', 
                cursor: 'default', 
                display: renderAs === 'span' || renderAs === 'a' ? 'inline-block' : undefined,
                ...appliedStyle 
            }}
            className={`group ${className || ''}`}
        >
            {content}
            {children}

            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsEditing(true);
                }}
                className="opacity-0 group-hover:opacity-100 transition-all duration-200"
                style={{
                    position: 'absolute',
                    top: '-12px',
                    right: '-12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    color: '#166534',
                    border: '1px solid #dcfce7',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                    zIndex: 20
                }}
                title="คลิกเพื่อแก้ไขข้อความนี้"
            >
                <Pencil size={14} />
            </button>
        </Tag>
    );
}
