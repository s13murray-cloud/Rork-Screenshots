import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, AlertTriangle, UploadCloud } from 'lucide-react';
import { Button } from '../components/Button';
import { SubpageLayout } from '../layouts/SubpageLayout';

export function FaultReport() {
    const navigate = useNavigate();
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate delay
        setTimeout(() => {
            setIsSubmitting(false);
            navigate('/success');
        }, 1000);
    };

    return (
        <SubpageLayout title="Report Fault" showBack>
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem', marginTop: '1rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        padding: '1.25rem',
                        backgroundColor: 'var(--danger-bg)',
                        borderRadius: '50%',
                        color: 'var(--danger)',
                        marginBottom: '1rem'
                    }}>
                        <AlertTriangle size={48} strokeWidth={1.5} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Report Fault</h2>
                    <p className="text-muted" style={{ padding: '0 1rem' }}>Please provide detailed evidence for the issues identified during inspection.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>

                    <div className="card" style={{ borderColor: 'var(--danger)', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.1)' }}>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label" style={{ fontWeight: 700, fontSize: '1rem' }}>Issue Description <span className="text-danger">*</span></label>
                            <textarea
                                className="form-input"
                                rows={4}
                                placeholder="Describe what is broken, leaking, or missing..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                disabled={isSubmitting}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label" style={{ fontWeight: 700, fontSize: '1rem' }}>Photo Evidence</label>
                            <div style={{
                                border: '2px dashed var(--border-color)',
                                borderRadius: 'var(--radius-md)',
                                padding: '2.5rem 1rem',
                                textAlign: 'center',
                                backgroundColor: '#f8fafc',
                                cursor: 'pointer',
                                transition: 'background-color 0.2s',
                            }}
                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                            >
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                    <div style={{ backgroundColor: 'white', padding: '0.75rem', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }}>
                                        <Camera size={28} className="text-primary" />
                                    </div>
                                    <div style={{ backgroundColor: 'white', padding: '0.75rem', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }}>
                                        <UploadCloud size={28} className="text-primary" />
                                    </div>
                                </div>
                                <p style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '1.05rem', marginBottom: '0.25rem' }}>Tap to take a photo</p>
                                <p className="text-muted" style={{ fontSize: '0.875rem' }}>or upload from gallery</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ flex: 1 }} /> {/* Spacer */}

                    <div className="sticky-footer" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <Button
                            type="submit"
                            variant="danger"
                            fullWidth
                            size="large"
                            isLoading={isSubmitting}
                            disabled={!description}
                            style={{ height: '56px', fontSize: '1.125rem' }}
                        >
                            Record Fault & Complete
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            fullWidth
                            onClick={() => navigate(-1)}
                            disabled={isSubmitting}
                            style={{ height: '56px', fontWeight: 600 }}
                        >
                            Go Back
                        </Button>
                    </div>
                </form>
            </div>
        </SubpageLayout>
    );
}
