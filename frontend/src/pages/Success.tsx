import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '../components/Button';

export function Success() {
    const navigate = useNavigate();

    return (
        <div className="page-container animate-fade-in" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>

            <div style={{
                display: 'inline-flex',
                padding: '2rem',
                backgroundColor: 'var(--success-bg)',
                borderRadius: '50%',
                color: 'var(--success)',
                marginBottom: '2rem',
                animation: 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards, spin 0.6s ease-out 0.2s 1'
            }}>
                <CheckCircle2 size={72} strokeWidth={2} />
            </div>

            <h2 style={{ marginBottom: '1rem', fontSize: '1.75rem', fontWeight: 800 }}>Inspection Complete</h2>

            <div className="card" style={{ maxWidth: '340px', width: '100%', marginBottom: '2.5rem', textAlign: 'left', borderLeft: '4px solid var(--success)' }}>
                <p style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>Submission Received</p>
                <p className="text-muted" style={{ fontSize: '0.875rem' }}>Your pre-start inspection has been successfully recorded in the system.</p>
            </div>

            <div style={{ width: '100%', maxWidth: '340px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Button
                    variant="primary"
                    fullWidth
                    onClick={() => navigate('/equipment')}
                    style={{ height: '56px', fontSize: '1.125rem' }}
                >
                    Return to Fleet <ChevronRight size={20} style={{ marginLeft: '0.5rem' }} />
                </Button>
                <Button
                    variant="ghost"
                    fullWidth
                    onClick={() => navigate('/login')}
                    style={{ height: '56px' }}
                >
                    Sign Out
                </Button>
            </div>
        </div>
    );
}
