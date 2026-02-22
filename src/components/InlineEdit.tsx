'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Pencil, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface InlineEditProps {
    settingKey: string;
    initialValue: string;
    renderAs?: 'h1' | 'h2' | 'h3' | 'span' | 'p' | 'div';
    style?: React.CSSProperties;
    className?: string;
    multiline?: boolean;
    useSpecialTitleFormat?: boolean;
}

export default function InlineEdit({
    settingKey,
    initialValue,
    renderAs = 'span',
    style,
    className,
    multiline = false,
    useSpecialTitleFormat = false
}: InlineEditProps) {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);
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

        if (value === initialValue) {
            setIsEditing(false);
            return;
        }

        setIsSaving(true);
        try {
            // Get userId from localStorage (same as the rest of the app)
            const storedUser = localStorage.getItem('khun_daeng_user');
            const userId = storedUser ? JSON.parse(storedUser).id : null;

            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(userId ? { 'x-user-id': userId } : {})
                },
                body: JSON.stringify({ [settingKey]: value })
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
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setValue(initialValue);
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
                            border: '2px solid var(--primary)',
                            borderRadius: '0.375rem',
                            backgroundColor: 'white',
                            color: 'black',
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
                            border: '2px solid var(--primary)',
                            borderRadius: '0.375rem',
                            backgroundColor: 'white',
                            color: 'black',
                            fontFamily: 'inherit',
                            fontSize: 'inherit',
                            fontWeight: 'inherit',
                            lineHeight: 'inherit',
                            outline: 'none'
                        }}
                        className={className}
                    />
                )}

                <div style={{ position: 'absolute', right: '0', top: '-30px', display: 'flex', gap: '0.25rem' }}>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        style={{
                            backgroundColor: '#16a34a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: isSaving ? 0.7 : 1
                        }}
                        title="บันทึก (Enter)"
                    >
                        <Check size={16} />
                    </button>
                    <button
                        onClick={handleCancel}
                        disabled={isSaving}
                        style={{
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: isSaving ? 0.7 : 1
                        }}
                        title="ยกเลิก (Esc)"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        );
    }

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
                    color: 'var(--primary)',
                    display: 'inline-block'
                }}>{value.split('|')[1]}</span>
            </>
        );
    }

    if (!isAdmin) {
        return <Tag style={style} className={className}>{content}</Tag>;
    }

    return (
        <div style={{ position: 'relative', display: 'inline-block', width: '100%' }} className="group">
            <Tag style={{ ...style, display: 'block' }} className={className}>
                {content}
            </Tag>

            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsEditing(true);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    transform: 'translate(50%, -50%)',
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
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    zIndex: 10
                }}
                title="คลิกเพื่อแก้ไขข้อความนี้"
            >
                <Pencil size={14} />
            </button>
        </div>
    );
}
