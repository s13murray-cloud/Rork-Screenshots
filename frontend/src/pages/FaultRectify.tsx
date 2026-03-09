import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { faultStore } from '../data/mockFaults';
import type { Fault } from '../data/mockFaults';
import { Button } from '../components/Button';
import { CheckCircle2, Camera } from 'lucide-react';
import { SubpageLayout } from '../layouts/SubpageLayout';

export function FaultRectify() {
    const { faultId } = useParams();
    const navigate = useNavigate();
    const [fault, setFault] = useState<Fault | null>(null);
    const [rectificationNote, setRectificationNote] = useState('');
    const [rectificationPhoto, setRectificationPhoto] = useState<string | undefined>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        if (faultId) {
            const f = faultStore.getFault(faultId);
            if (f) {
                setFault(f);
            } else {
                navigate('/faults');
            }
        }
    }, [faultId, navigate]);

    if (!fault) return (
        <SubpageLayout title="Fault Details" showBack>
            <div style={{ padding: 'var(--spacing-md)' }}><p>Loading...</p></div>
        </SubpageLayout>
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!rectificationNote.trim()) return;

        setIsSubmitting(true);

        setTimeout(() => {
            faultStore.rectifyFault(fault.id, rectificationNote, rectificationPhoto);
            setIsSubmitting(false);
            setShowSuccessModal(true);

            setTimeout(() => {
                navigate('/faults');
            }, 1500);
        }, 600);
    };

    return (
        <SubpageLayout title="Rectify Fault" showBack>
            <div className="animate-fade-in" style={{ padding: 'var(--spacing-md)', paddingBottom: '80px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div className="card" style={{ marginBottom: '2rem', borderTop: '4px solid var(--danger)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fault Details</span>
                            <h3 style={{ fontSize: '1.125rem', marginTop: '0.25rem', marginBottom: '0' }}>{fault.checklistItem}</h3>
                        </div>
                    </div>

                    <div style={{ backgroundColor: 'var(--surface-color)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                        <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>"{fault.note}"</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Equipment:</span>
                            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{fault.equipmentName} ({fault.equipmentId})</span>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Fault History</h3>

                    <div style={{ position: 'relative', borderLeft: fault.status === 'rectified' ? '2px solid var(--success)' : '2px solid var(--border-color)', marginLeft: '12px', paddingLeft: '20px', paddingBottom: fault.status === 'rectified' ? '1.5rem' : '0' }}>
                        <div style={{ position: 'absolute', left: '-7px', top: '0', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--danger)' }} />
                        <h4 style={{ margin: 0, fontSize: '1rem' }}>Fault Reported</h4>
                        <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>
                            {new Date(fault.dateReported).toLocaleString()} by {fault.reportedBy}
                        </p>
                    </div>

                    {fault.status === 'rectified' && (
                        <div style={{ position: 'relative', borderLeft: '2px solid transparent', marginLeft: '12px', paddingLeft: '20px' }}>
                            <div style={{ position: 'absolute', left: '-7px', top: '0', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'var(--success)' }} />
                            <h4 style={{ margin: 0, fontSize: '1rem' }}>Fault Rectified</h4>
                            <p className="text-muted" style={{ margin: 0, fontSize: '0.85rem' }}>
                                {fault.rectifiedAt ? new Date(fault.rectifiedAt).toLocaleString() : ''} by {fault.rectifiedBy}
                            </p>
                            <div style={{ marginTop: '0.5rem', backgroundColor: 'var(--surface-color)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                                <p style={{ margin: 0, fontSize: '0.875rem' }}>"{fault.rectificationNote}"</p>
                            </div>
                            {fault.rectificationPhoto && (
                                <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                                    <Camera size={16} /> <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Repair Photo Attached</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {fault.status === 'open' && (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                            <label className="form-label" style={{ fontSize: '1rem' }}>Rectification Note <span className="text-danger">*</span></label>
                            <textarea
                                className="form-input"
                                placeholder="Detail the work performed to rectify this fault..."
                                value={rectificationNote}
                                onChange={(e) => setRectificationNote(e.target.value)}
                                rows={3}
                                style={{ fontSize: '1rem', padding: '1rem' }}
                            />
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <button
                                type="button"
                                className="btn btn-outline btn-full"
                                onClick={() => setRectificationPhoto(rectificationPhoto ? undefined : 'mock_photo_url.jpg')}
                                style={{ height: '56px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', borderColor: rectificationPhoto ? 'var(--primary)' : 'var(--border-color)', color: rectificationPhoto ? 'var(--primary)' : 'var(--text-main)' }}
                            >
                                <Camera size={24} /> {rectificationPhoto ? 'Photo Added (Tap to remove)' : 'Add Repair Photo'}
                            </button>
                        </div>

                        <div style={{ flex: 1 }} />
                        <div className="sticky-footer" style={{ bottom: '72px' }}>
                            <Button
                                type="submit"
                                fullWidth
                                size="large"
                                disabled={!rectificationNote.trim()}
                                isLoading={isSubmitting}
                                style={{ height: '56px', fontSize: '1.125rem' }}
                            >
                                Mark as Rectified
                            </Button>
                        </div>
                    </form>
                )}

                {/* Success Modal Overlay */}
                {showSuccessModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        animation: 'fadeIn 0.2s ease-out'
                    }}>
                        <div className="card" style={{
                            margin: '2rem', padding: '2rem', textAlign: 'center', maxWidth: '300px',
                            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}>
                            <CheckCircle2 size={64} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Fault Rectified</h3>
                            <p className="text-muted" style={{ fontSize: '0.875rem' }}>The fault has been marked as rectified and removed from the active list.</p>
                        </div>
                    </div>
                )}
            </div>
        </SubpageLayout>
    );
}
