'use client';

import React, { useState, useRef, useEffect } from 'react';
import { formatThaiDate, getBEYear } from '@/lib/dateUtils';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface ThaiDatePickerProps {
    value: string; // YYYY-MM-DD
    onChange: (value: string) => void;
    label?: string;
    mode?: 'day' | 'month' | 'year';
    min?: string; // YYYY-MM-DD
    max?: string; // YYYY-MM-DD
}

const THAI_MONTHS = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

const THAI_DAYS_SHORT = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];

export default function ThaiDatePicker({ value, onChange, label, mode = 'day', min, max }: ThaiDatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(() => {
        const d = value ? new Date(value) : new Date();
        return isNaN(d.getTime()) ? new Date() : d;
    });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Sync viewDate when opening
    useEffect(() => {
        if (isOpen && value) {
            const d = new Date(value);
            if (!isNaN(d.getTime())) {
                setViewDate(d);
            }
        }
    }, [isOpen, value]);

    const handleDateClick = (day: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        // Format as YYYY-MM-DD (AD) for the state/database
        const yyyy = newDate.getFullYear();
        const mm = String(newDate.getMonth() + 1).padStart(2, '0');
        const dd = String(newDate.getDate()).padStart(2, '0');
        onChange(`${yyyy}-${mm}-${dd}`);
        setIsOpen(false);
    };

    const changeMonth = (offset: number) => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1));
    };

    const changeYear = (yearBE: number) => {
        setViewDate(new Date(yearBE - 543, viewDate.getMonth(), 1));
    };

    const renderCalendar = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const days = [];
        // Empty slots for previous month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} style={{ width: '40px', height: '40px' }} />);
        }
        
        // Days of current month
        const selectedDateObj = value ? new Date(value) : null;
        const isSelected = (d: number) => 
            selectedDateObj && 
            selectedDateObj.getDate() === d && 
            selectedDateObj.getMonth() === month && 
            selectedDateObj.getFullYear() === year;

        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isOutOfRange = (min && dateStr < min) || (max && dateStr > max);

            days.push(
                <button
                    key={d}
                    onClick={() => !isOutOfRange && handleDateClick(d)}
                    disabled={!!isOutOfRange}
                    style={{
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        border: 'none',
                        cursor: isOutOfRange ? 'not-allowed' : 'pointer',
                        backgroundColor: isSelected(d) ? '#059669' : 'transparent',
                        color: isSelected(d) ? 'white' : isOutOfRange ? '#d1d5db' : '#374151',
                        fontWeight: isSelected(d) ? 'bold' : 'normal',
                        transition: 'all 0.2s',
                        opacity: isOutOfRange ? 0.5 : 1
                    }}
                    className={!isOutOfRange ? "hover:bg-green-50" : ""}
                >
                    {d}
                </button>
            );
        }
        
        return days;
    };

    return (
        <div ref={containerRef} style={{ position: 'relative', display: 'inline-block' }}>
            {label && <label style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.25rem', color: '#374151' }}>{label}</label>}
            
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(!isOpen);
                }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    minWidth: '180px',
                    textAlign: 'left'
                }}
            >
                <CalendarIcon size={18} color="#6b7280" />
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {value ? (
                        mode === 'year' ? `ปี พ.ศ. ${getBEYear(value)}` :
                        mode === 'month' ? formatThaiDate(value, { month: 'long', year: 'numeric' }) : 
                        formatThaiDate(value)
                    ) : 'เลือกวันที่'}
                </span>
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '0.5rem',
                    backgroundColor: 'white',
                    borderRadius: '1rem',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #e5e7eb',
                    padding: '1rem',
                    zIndex: 1000,
                    width: '320px'
                }}>
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <button onClick={() => changeMonth(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
                            <ChevronLeft size={20} color="#374151" />
                        </button>
                        
                        <div style={{ display: 'flex', gap: '0.25rem', fontWeight: 'bold', fontSize: '1rem', alignItems: 'center' }}>
                            {mode !== 'year' && (
                                mode === 'month' ? (
                                    <select 
                                        value={viewDate.getMonth()} 
                                        onChange={(e) => {
                                            const m = parseInt(e.target.value);
                                            const newDate = new Date(viewDate.getFullYear(), m, 1);
                                            const yyyy = newDate.getFullYear();
                                            const mm = String(newDate.getMonth() + 1).padStart(2, '0');
                                            onChange(`${yyyy}-${mm}-01`);
                                            setViewDate(newDate);
                                            setIsOpen(false);
                                        }}
                                        style={{ border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', background: 'none' }}
                                    >
                                        {THAI_MONTHS.map((m, idx) => (
                                            <option key={m} value={idx}>{m}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <span>{THAI_MONTHS[viewDate.getMonth()]}</span>
                                )
                            )}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>พ.ศ.</span>
                                <select 
                                    value={getBEYear(viewDate)} 
                                    onChange={(e) => {
                                        const y = parseInt(e.target.value);
                                        changeYear(y);
                                        if (mode === 'year') {
                                            onChange(`${y - 543}-01-01`);
                                            setIsOpen(false);
                                        }
                                    }}
                                    style={{ border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', background: 'none' }}
                                >
                                    {Array.from({ length: 21 }, (_, i) => getBEYear() - 10 + i).map(y => (
                                        <option key={y} value={y}>{y}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button onClick={() => changeMonth(1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem' }}>
                            <ChevronRight size={20} color="#374151" />
                        </button>
                    </div>

                    {mode === 'day' && (
                        <>
                            {/* Days Header */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '0.5rem' }}>
                                {THAI_DAYS_SHORT.map(d => (
                                    <div key={d} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: 'bold', color: '#9ca3af' }}>
                                        {d}
                                    </div>
                                ))}
                            </div>

                            {/* Days Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                                {renderCalendar()}
                            </div>
                        </>
                    )}

                    {/* Footer */}
                    <div style={{ marginTop: '1rem', textAlign: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '0.5rem' }}>
                        <button 
                            onClick={() => {
                                const today = new Date();
                                const yyyy = today.getFullYear();
                                const mm = String(today.getMonth() + 1).padStart(2, '0');
                                const dd = String(today.getDate()).padStart(2, '0');
                                const dateStr = `${yyyy}-${mm}-${dd}`;
                                
                                if ((min && dateStr < min) || (max && dateStr > max)) {
                                    // Today is out of range, just go to today's month view but don't select
                                    setViewDate(today);
                                } else {
                                    onChange(dateStr);
                                    setViewDate(today);
                                    setIsOpen(false);
                                }
                            }}
                            style={{ background: 'none', border: 'none', color: '#059669', fontWeight: 600, cursor: 'pointer', fontSize: '0.875rem' }}
                        >
                            วันนี้
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
