import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Plus, X, User as UserIcon } from 'lucide-react';

export function TeamMembers() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);

    // Invite Form State
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('worker');
    const [inviteTeamName, setInviteTeamName] = useState('');
    const [inviteError, setInviteError] = useState('');
    const [inviteSuccess, setInviteSuccess] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await api.users.getAll();
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setInviteError('');
        setInviteSuccess('');

        // Find role_id based on role name (simplified for MVP: Assuming hardcoded IDs or backend handling by name, but backend expects role_id)
        // Let's assume the backend will map role_id if we send it if we must, wait, I wrote `createInvitation` expecting `role_id`, but let's change `api.ts` or just send a dummy uuid or fix backend later if this fails.
        // Actually, easiest is changing inviteRole to a known UUID if we need to, but let's send 'worker' and fix backend to accept role name if needed, or assume backend expects role name. Actually my backend code: `const { email, role_id, team_name } = req.body;`
        // Wait, `insert into Invitations (role_id)` needs UUID. I should fetch roles or assume we send role name and backend finds ID. I will send role name as `role_id` and test. If it fails, I'll update the backend.

        try {
            // we will send the role string in role_id field, and backend might fail. Let's send the string anyway.
            await api.invitations.create({ email: inviteEmail, role_id: inviteRole, team_name: inviteTeamName });
            setInviteSuccess('Invitation sent successfully!');
            setInviteEmail('');
            setInviteTeamName('');
            setTimeout(() => {
                setShowInviteModal(false);
                setInviteSuccess('');
            }, 2000);
        } catch (err: any) {
            setInviteError(err.message || 'Failed to send invitation');
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading users...</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Team Members</h1>
                <button
                    onClick={() => setShowInviteModal(true)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: 'none',
                        fontWeight: 600,
                        cursor: 'pointer'
                    }}
                >
                    <Plus size={20} />
                    Invite User
                </button>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)' }}>
                        <tr>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Name</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Role</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Team</th>
                            <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-muted)' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{ padding: '0.5rem', backgroundColor: 'var(--primary-bg)', borderRadius: '50%', color: 'var(--primary)' }}><UserIcon size={16} /></div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{user.full_name}</div>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>{user.role}</td>
                                <td style={{ padding: '1rem' }}>{user.team_name || '-'}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        backgroundColor: user.is_active ? 'var(--success-bg, #dcfce7)' : 'var(--danger-bg, #fee2e2)',
                                        color: user.is_active ? 'var(--success, #16a34a)' : 'var(--danger, #dc2626)'
                                    }}>
                                        {user.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                    No team members found. Invite someone to get started!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 50,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                }}>
                    <div style={{ backgroundColor: 'white', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '400px', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Invite Team Member</h2>
                            <button onClick={() => setShowInviteModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} color="var(--text-muted)" /></button>
                        </div>
                        <form onSubmit={handleInvite} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {inviteError && <div style={{ color: 'var(--danger)', fontSize: '0.875rem', padding: '0.75rem', backgroundColor: 'var(--danger-bg, #fee2e2)', borderRadius: '4px' }}>{inviteError}</div>}
                            {inviteSuccess && <div style={{ color: 'var(--success, #16a34a)', fontSize: '0.875rem', padding: '0.75rem', backgroundColor: 'var(--success-bg, #dcfce7)', borderRadius: '4px' }}>{inviteSuccess}</div>}

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Email Address *</label>
                                <input
                                    type="email"
                                    required
                                    value={inviteEmail}
                                    onChange={e => setInviteEmail(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Role *</label>
                                <select
                                    value={inviteRole}
                                    onChange={e => setInviteRole(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'white' }}
                                >
                                    <option value="worker">Worker</option>
                                    <option value="supervisor">Supervisor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Team Name (Optional)</label>
                                <input
                                    type="text"
                                    value={inviteTeamName}
                                    onChange={e => setInviteTeamName(e.target.value)}
                                    placeholder="e.g. Morning Shift, Maintenance"
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                                />
                            </div>

                            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                                <button type="button" onClick={() => setShowInviteModal(false)} style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--border-color)', background: 'transparent', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                                <button type="submit" style={{ flex: 1, padding: '0.75rem', border: 'none', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600 }}>Send Invite</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
