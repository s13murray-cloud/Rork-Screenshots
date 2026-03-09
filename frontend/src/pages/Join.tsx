import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function Join() {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [invitation, setInvitation] = useState<any>(null);

    const [fullName, setFullName] = useState('');
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!token) {
            setError('Invalid invitation link.');
            setLoading(false);
            return;
        }

        const fetchDetails = async () => {
            try {
                const data = await api.invitations.getDetails(token);
                setInvitation(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load invitation. It may be expired or already accepted.');
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [token]);

    const handleAccept = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (pin.length !== 4) {
            setError('PIN must be exactly 4 digits.');
            return;
        }

        if (pin !== confirmPin) {
            setError('PINs do not match.');
            return;
        }

        if (!fullName.trim()) {
            setError('Full name is required.');
            return;
        }

        setSubmitting(true);
        try {
            const result = await api.invitations.accept(token!, { full_name: fullName, pin });
            // Store token and user data
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));

            // Redirect to dashboard
            setTimeout(() => {
                navigate('/');
            }, 1500);

            setInvitation({ ...invitation, accepted: true }); // temporary success state

        } catch (err: any) {
            setError(err.message || 'Failed to accept invitation.');
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'var(--bg-color)' }}>
                <p style={{ color: 'var(--text-muted)' }}>Loading invitation details...</p>
            </div>
        );
    }

    if (error && !invitation) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: 'var(--bg-color)' }}>
                <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center', maxWidth: '400px', width: '90%', border: '1px solid var(--border-color)' }}>
                    <AlertCircle size={48} color="var(--danger)" style={{ margin: '0 auto 1rem' }} />
                    <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 600 }}>Invitation Error</h2>
                    <p style={{ color: 'var(--text-muted)' }}>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: 'var(--bg-color)', padding: '1rem' }}>
            <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '450px', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>

                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>C</span>
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Join the Team</h1>
                    {invitation && !invitation.accepted && (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                            You've been invited as a <strong style={{ color: 'var(--text-main)' }}>{invitation.role}</strong> {invitation.team_name ? `for the ${invitation.team_name} team` : ''}.
                        </p>
                    )}
                </div>

                {invitation?.accepted ? (
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                        <CheckCircle2 size={64} color="var(--success, #16a34a)" style={{ margin: '0 auto 1rem' }} />
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Welcome aboard, {fullName}!</h2>
                        <p style={{ color: 'var(--text-muted)' }}>Redirecting to your dashboard...</p>
                    </div>
                ) : (
                    <form onSubmit={handleAccept} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {error && (
                            <div style={{ color: 'var(--danger)', fontSize: '0.875rem', padding: '0.75rem', backgroundColor: 'var(--danger-bg, #fee2e2)', borderRadius: '6px', textAlign: 'center' }}>
                                {error}
                            </div>
                        )}

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-main)' }}>Email</label>
                            <input
                                type="email"
                                value={invitation.email}
                                disabled
                                style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', color: 'var(--text-muted)' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-main)' }}>Full Name *</label>
                            <input
                                type="text"
                                required
                                placeholder="John Doe"
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-main)' }}>Create 4-digit PIN *</label>
                                <input
                                    type="password"
                                    required
                                    maxLength={4}
                                    inputMode="numeric"
                                    pattern="\d{4}"
                                    placeholder="••••"
                                    value={pin}
                                    onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
                                    style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.2rem' }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem', color: 'var(--text-main)' }}>Confirm PIN *</label>
                                <input
                                    type="password"
                                    required
                                    maxLength={4}
                                    inputMode="numeric"
                                    pattern="\d{4}"
                                    placeholder="••••"
                                    value={confirmPin}
                                    onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                                    style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center', letterSpacing: '0.5em', fontSize: '1.2rem' }}
                                />
                            </div>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '-0.75rem' }}>This PIN will be used to quickly sign off on inspections.</p>

                        <button
                            type="submit"
                            disabled={submitting}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                border: 'none',
                                background: 'var(--primary)',
                                color: 'white',
                                borderRadius: 'var(--radius-md)',
                                cursor: submitting ? 'not-allowed' : 'pointer',
                                fontWeight: 600,
                                fontSize: '1rem',
                                marginTop: '1rem',
                                opacity: submitting ? 0.7 : 1
                            }}
                        >
                            {submitting ? 'Accepting...' : 'Accept Invitation'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
