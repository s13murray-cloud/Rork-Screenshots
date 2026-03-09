import { useState, useEffect, useRef } from 'react';
import { Check, X, Minus, Camera, ChevronDown, ChevronUp, Mic, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { useDrag } from '@use-gesture/react';

export type ChecklistStatus = 'ok' | 'fault' | 'na' | null;

interface ChecklistItemProps {
    id: string;
    title: string;
    description?: string;
    status: ChecklistStatus;
    notes?: string;
    photoAttached?: boolean;
    isCriticalFault?: boolean;
    onChangeStatus: (id: string, status: ChecklistStatus) => void;
    onChangeNotes: (id: string, notes: string) => void;
    onAttachPhoto?: (id: string) => void; // Placeholder for future photo upload
    onChangeCritical?: (id: string, isCritical: boolean) => void;
    isActive?: boolean;
    onDone?: () => void;
    onActivate?: () => void;
}

export function ChecklistItem({
    id,
    title,
    description,
    status,
    notes,
    photoAttached,
    isCriticalFault = false,
    isActive = false,
    onDone,
    onActivate,
    onChangeStatus,
    onChangeNotes,
    onAttachPhoto,
    onChangeCritical
}: ChecklistItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [swipeOffset, setSwipeOffset] = useState(0);
    const cardRef = useRef<HTMLDivElement>(null);

    // Expand automatically when marked as fault, collapse on OK/NA
    useEffect(() => {
        if (status === 'fault') {
            setIsExpanded(true);
        } else {
            setIsExpanded(false);
        }
    }, [status]);

    const handleDone = () => {
        if (!notes || notes.trim() === '') return;
        setIsExpanded(false);
        if (onDone) onDone();
    };

    // Haptics helper
    const triggerHaptic = () => {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(50); // Light tap
        }
    };

    // Centralized status change to trigger haptics
    const handleStatusUpdate = (newStatus: ChecklistStatus) => {
        if (newStatus !== status) {
            triggerHaptic();
            onChangeStatus(id, newStatus);
        }
    };

    // Voice Dictation helper
    const handleDictate = () => {
        // Checking for web speech api support
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            triggerHaptic();
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                onChangeNotes(id, (notes ? notes + ' ' : '') + transcript);
            };

            recognition.start();
        } else {
            alert("Voice dictation is not supported in this browser.");
        }
    };

    // Gesture Binding
    const bind = useDrag(({ down, movement: [mx] }) => {
        // Only allow swiping if it's not currently expanded as a fault, or we are swiping directly on the header
        if (isExpanded) return;

        if (down) {
            // Apply resistance
            setSwipeOffset(mx * 0.5);
        } else {
            // Threshold for triggering status change (e.g. 100px)
            if (mx > 100) {
                handleStatusUpdate('ok');
            } else if (mx < -100) {
                handleStatusUpdate('fault');
            }
            setSwipeOffset(0);
        }
    }, {
        axis: 'x',
        filterTaps: true
    });

    return (
        <div id={`item-${id}`} onClick={() => { if (!isActive && onActivate) onActivate(); }}>
            <div
                {...bind()}
                ref={cardRef}
                className="card animate-fade-in"
                style={{
                    padding: '1.25rem',
                    border: isActive ? '2px solid #f97316' : '1px solid var(--border-color)',
                    backgroundColor: 'var(--surface-color)',
                    boxShadow: isActive ? '0 0 0 4px rgba(249, 115, 22, 0.15), var(--shadow-md)' : 'var(--shadow-sm)',
                    transition: swipeOffset === 0 ? 'all 0.3s ease' : 'none',
                    transform: isActive ? `translateX(${swipeOffset}px) scale(1.02)` : `translateX(${swipeOffset}px) scale(1)`,
                    touchAction: 'pan-y', // Extremely important to allow vertical scrolling while catching horizontal swipes
                    zIndex: isActive ? 5 : 1,
                    position: 'relative'
                }}
            >
                <div className="flex-between">
                    <div>
                        <h3 style={{ fontSize: '1.05rem', marginBottom: description ? '0.25rem' : '1rem' }}>{title}</h3>
                        {description && <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>{description}</p>}
                    </div>
                    {status === 'fault' && !isExpanded && (
                        <button
                            onClick={() => setIsExpanded(true)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', padding: '0.25rem', cursor: 'pointer' }}
                        >
                            <ChevronDown size={28} />
                        </button>
                    )}
                    {status === 'fault' && isExpanded && (
                        <button
                            onClick={() => setIsExpanded(false)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', padding: '0.25rem', cursor: 'pointer' }}
                        >
                            <ChevronUp size={28} />
                        </button>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: isExpanded ? '1.25rem' : '0' }}>
                    <button
                        type="button"
                        onClick={() => handleStatusUpdate('ok')}
                        style={{
                            flex: 1,
                            padding: '1rem 0.5rem',
                            minHeight: '80px',
                            borderRadius: 'var(--radius-md)',
                            border: status === 'ok' ? '2px solid transparent' : '2px solid #bbf7d0',
                            backgroundColor: status === 'ok' ? '#16a34a' : 'white',
                            color: status === 'ok' ? 'white' : '#4ade80',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.25rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        <Check size={32} strokeWidth={status === 'ok' ? 3 : 2} />
                        <span style={{ fontSize: '0.875rem', fontWeight: status === 'ok' ? 700 : 500 }}>OK</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleStatusUpdate('fault')}
                        style={{
                            flex: 1,
                            padding: '1rem 0.5rem',
                            minHeight: '80px',
                            borderRadius: 'var(--radius-md)',
                            border: status === 'fault' ? '2px solid transparent' : '2px solid #fecaca',
                            backgroundColor: status === 'fault' ? '#dc2626' : 'white',
                            color: status === 'fault' ? 'white' : '#f87171',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.25rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        <X size={32} strokeWidth={status === 'fault' ? 3 : 2} />
                        <span style={{ fontSize: '0.875rem', fontWeight: status === 'fault' ? 700 : 500 }}>Fault</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleStatusUpdate('na')}
                        style={{
                            flex: 1,
                            padding: '1rem 0.5rem',
                            minHeight: '80px',
                            borderRadius: 'var(--radius-md)',
                            border: status === 'na' ? '2px solid transparent' : '2px solid #e5e7eb',
                            backgroundColor: status === 'na' ? '#4b5563' : 'white',
                            color: status === 'na' ? 'white' : '#9ca3af',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.25rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                        }}
                    >
                        <Minus size={32} strokeWidth={status === 'na' ? 3 : 2} />
                        <span style={{ fontSize: '0.875rem', fontWeight: status === 'na' ? 700 : 500 }}>N/A</span>
                    </button>
                </div>

                {/* Fault summary when collapsed but has data */}
                {status === 'fault' && !isExpanded && notes && (
                    <div style={{ marginTop: '0.75rem', padding: '0.75rem', backgroundColor: 'var(--danger-bg)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--danger)' }}>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', margin: 0 }}><strong>Fault Note:</strong> {notes}</p>
                        {photoAttached && <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.25rem', fontWeight: 600 }}>Photo attached</p>}
                    </div>
                )}

                {/* Expanded Camera-First Fault Capture Area */}
                {status === 'fault' && isExpanded && (
                    <div className="animate-fade-in" style={{
                        marginTop: '1rem',
                        paddingTop: '1rem',
                        borderTop: '1px dashed var(--border-color)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        {/* Camera Primary */}
                        <div>
                            <button
                                type="button"
                                onClick={() => onAttachPhoto && onAttachPhoto(id)}
                                style={{
                                    width: '100%',
                                    border: photoAttached ? '2px solid var(--primary)' : '2px dashed var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: '1.25rem',
                                    minHeight: '80px', // Easy hit
                                    backgroundColor: photoAttached ? 'rgba(249, 115, 22, 0.05)' : '#f8fafc',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.75rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    color: photoAttached ? 'var(--primary)' : 'var(--text-main)'
                                }}
                            >
                                <Camera size={28} />
                                <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                                    {photoAttached ? 'Retake Photo' : 'Capture Fault Photo'}
                                </span>
                            </button>
                            {photoAttached && (
                                <p style={{ fontSize: '0.875rem', color: 'var(--success)', marginTop: '0.5rem', textAlign: 'center', fontWeight: 600 }}>
                                    ✓ Photo attached successfully
                                </p>
                            )}
                        </div>

                        <div className="form-group" style={{ marginBottom: '0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label className="form-label" style={{ margin: 0 }}>Fault Description <span className="text-danger">*</span></label>
                                <button
                                    type="button"
                                    onClick={handleDictate}
                                    style={{
                                        background: 'var(--surface-color)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 'var(--radius-full)',
                                        padding: '0.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--primary)',
                                        boxShadow: 'var(--shadow-sm)'
                                    }}
                                    title="Dictate note"
                                >
                                    <Mic size={20} />
                                </button>
                            </div>
                            <textarea
                                className="form-input"
                                placeholder="Describe the issue... (or tap mic to speak)"
                                value={notes || ''}
                                onChange={(e) => onChangeNotes(id, e.target.value)}
                                rows={3}
                                style={{
                                    fontSize: '1rem',
                                    padding: '1rem',
                                    borderColor: (!notes || notes.trim() === '') ? 'var(--danger)' : 'var(--border-color)',
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#fff', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                            <input
                                type="checkbox"
                                id={`critical-${id}`}
                                checked={isCriticalFault}
                                onChange={(e) => onChangeCritical && onChangeCritical(id, e.target.checked)}
                                style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--danger)' }}
                            />
                            <label htmlFor={`critical-${id}`} style={{ fontWeight: 700, color: 'var(--danger)', fontSize: '0.95rem', cursor: 'pointer', flex: 1 }}>
                                Critical Fault / Out of Service
                            </label>
                        </div>

                        {isCriticalFault && (
                            <div className="animate-fade-in" style={{ backgroundColor: 'var(--danger-bg)', border: '2px solid var(--danger)', borderRadius: 'var(--radius-md)', padding: '1rem', marginTop: '0.5rem', color: 'var(--danger-dark)' }}>
                                <h4 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                                    <AlertCircle size={20} />
                                    CRITICAL FAULT RECORDED
                                </h4>
                                <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', fontWeight: 500 }}>
                                    <li>This equipment must be placed Out of Service.</li>
                                    <li>Attach a physical Out of Service tag to the equipment before leaving it unattended.</li>
                                    <li>Do not operate equipment until the fault has been rectified and the equipment has been cleared for service.</li>
                                </ul>
                            </div>
                        )}

                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleDone}
                            disabled={!notes || notes.trim() === ''}
                            style={{ minHeight: '60px', marginTop: '0.5rem' }}
                        >
                            Save & Collapse
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
