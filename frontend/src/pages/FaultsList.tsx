import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { CheckCircle2, AlertTriangle, ChevronRight } from 'lucide-react';
import { SubpageLayout } from '../layouts/SubpageLayout';

export function FaultsList() {
    const navigate = useNavigate();
    const [faults, setFaults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFaults = async () => {
            try {
                const data = await api.faults.getAll();
                setFaults(data.faults || []);
            } catch (err) {
                console.error('Failed fetching faults:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFaults();
    }, []);

    if (isLoading) {
        return (
            <SubpageLayout title="Open Faults" actionType="logout" showBottomNav>
                <div style={{ padding: 'var(--spacing-lg)', display: 'flex', justifyContent: 'center' }}>
                    <p style={{ color: 'var(--text-muted)' }}>Loading faults...</p>
                </div>
            </SubpageLayout>
        );
    }

    if (faults.length === 0) {
        return (
            <SubpageLayout title="Open Faults" actionType="logout" showBottomNav>
                <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', padding: 'var(--spacing-md)', justifyContent: 'center', alignItems: 'center', textAlign: 'center', height: '100%' }}>
                    <div style={{
                        display: 'inline-flex',
                        padding: '1.5rem',
                        backgroundColor: 'var(--success-bg)',
                        borderRadius: '50%',
                        color: 'var(--success)',
                        marginBottom: '1.5rem',
                    }}>
                        <CheckCircle2 size={64} strokeWidth={2.5} />
                    </div>
                    <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>No Open Faults</h2>
                    <p className="text-muted" style={{ fontWeight: 500 }}>All equipment is currently clear of reported faults.</p>
                </div>
            </SubpageLayout>
        );
    }

    // Group faults by equipment
    const faultsByEq = faults.reduce((acc, fault) => {
        if (!acc[fault.equipmentId]) {
            acc[fault.equipmentId] = {
                name: fault.equipmentName,
                faults: []
            };
        }
        acc[fault.equipmentId].faults.push(fault);
        return acc;
    }, {} as Record<string, { name: string, faults: any[] }>);

    return (
        <SubpageLayout title="Open Faults" actionType="logout" showBottomNav>
            <div className="animate-fade-in" style={{ padding: 'var(--spacing-md)' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', backgroundColor: 'var(--danger-bg)', border: '1px solid var(--danger)' }}>
                    <AlertTriangle size={32} color="var(--danger)" />
                    <div>
                        <h3 style={{ fontSize: '1.5rem', color: 'var(--danger)', margin: 0 }}>{faults.length}</h3>
                        <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-main)', fontSize: '0.875rem' }}>Open Faults across {Object.keys(faultsByEq).length} items</p>
                    </div>
                </div>

                {Object.entries(faultsByEq).map(([eqId, eqData]: [string, any]) => (
                    <div key={eqId} style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid var(--border-color)' }}>
                            <h3 style={{ fontSize: '1.125rem', margin: 0 }}>{eqData.name}</h3>
                            <span style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '1rem', padding: '0.125rem 0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>{eqId}</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {eqData.faults.map((fault: any) => (
                                <div
                                    key={fault.id}
                                    className="card animate-fade-in"
                                    onClick={() => navigate(`/faults/${fault.id}`)}
                                    style={{
                                        borderLeft: '4px solid var(--danger)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div style={{ flex: 1, paddingRight: '1rem' }}>
                                        <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{fault.checklistItem}</h4>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{fault.note}</p>

                                        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                            <span><strong>Date:</strong> {new Date(fault.dateReported).toLocaleDateString()}</span>
                                            <span><strong>By:</strong> {fault.reportedBy}</span>
                                        </div>
                                    </div>
                                    <ChevronRight size={24} color="var(--text-muted)" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </SubpageLayout>
    );
}
