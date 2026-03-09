import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Upload, Copy, FileText, Search, MoreVertical, CheckCircle2, CircleDashed } from 'lucide-react';
import { Button } from '../../../components/Button';
import { SubpageLayout } from '../../../layouts/SubpageLayout';

export function ChecklistManagement() {
    const navigate = useNavigate();

    const [checklists] = useState([
        { id: 'chk-1', name: 'Heavy Excavator Pre-Start', version: 3, status: 'published', lastUpdated: 'Oct 20, 2026', items: 24 },
        { id: 'chk-2', name: 'Light Vehicle Daily', version: 1, status: 'published', lastUpdated: 'Oct 15, 2026', items: 12 },
        { id: 'chk-3', name: 'Water Cart Pre-Start', version: 0, status: 'draft', lastUpdated: '2 hours ago', items: 18 },
        { id: 'chk-4', name: 'Scissor Lift Inspection', version: 2, status: 'published', lastUpdated: 'Sep 30, 2026', items: 15 },
    ]);

    return (
        <SubpageLayout title="Checklist Templates" actionType="logout" showBottomNav>
            <div style={{ padding: 'var(--spacing-lg)', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Header Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h1 className="desktop-only" style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-main)' }}>Checklist Templates</h1>
                        <p style={{ margin: 0, color: 'var(--text-muted)' }}>Manage, import, and build digitised inspection forms.</p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Button variant="outline" icon={<Copy size={18} />}>
                            Duplicate
                        </Button>
                        <Button
                            variant="secondary"
                            icon={<Upload size={18} />}
                            onClick={() => navigate('/supervisor/checklists/import')}
                        >
                            Import File
                        </Button>
                        <Button
                            icon={<Plus size={18} />}
                            onClick={() => navigate('/supervisor/checklists/builder')}
                        >
                            New Checklist
                        </Button>
                    </div>
                </div>

                {/* List Container */}
                <div className="card" style={{ overflow: 'hidden' }}>
                    <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--surface-color)' }}>
                        <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Find a checklist..."
                                style={{
                                    width: '100%',
                                    padding: '0.6rem 1rem 0.6rem 2.5rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)',
                                    fontSize: '0.875rem'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                            <thead>
                                <tr style={{ backgroundColor: 'var(--surface-color)' }}>
                                    <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem', borderBottom: '1px solid var(--border-color)' }}>Name</th>
                                    <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem', borderBottom: '1px solid var(--border-color)' }}>Status</th>
                                    <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem', borderBottom: '1px solid var(--border-color)' }}>Size</th>
                                    <th style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem', borderBottom: '1px solid var(--border-color)' }}>Last Updated</th>
                                    <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', width: '60px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {checklists.map((chk) => (
                                    <tr key={chk.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-bg)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <FileText size={20} />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{chk.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {chk.id} • v{chk.version}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem' }}>
                                            {chk.status === 'published' ? (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}>
                                                    <CheckCircle2 size={14} /> Published
                                                </span>
                                            ) : (
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'var(--warning-bg)', color: 'var(--warning-hover)' }}>
                                                    <CircleDashed size={14} /> Draft
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                            {chk.items} items
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                            {chk.lastUpdated}
                                        </td>
                                        <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                                                <MoreVertical size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </SubpageLayout>
    );
}
