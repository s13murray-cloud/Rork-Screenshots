import { useState, useEffect } from 'react';
import { SubpageLayout } from '../layouts/SubpageLayout';
import { inspectionsService } from '../services/inspections';
import type { InspectionHistoryItem } from '../services/inspections';
import { FileText } from 'lucide-react';

export function HistoryList() {
    const [history, setHistory] = useState<InspectionHistoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await inspectionsService.getHistory();
                setHistory(data);
            } catch (error) {
                console.error('Failed to load history', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (isLoading) {
        return (
            <SubpageLayout title="Inspection History" actionType="logout" showBottomNav>
                <div style={{ padding: 'var(--spacing-lg)', display: 'flex', justifyContent: 'center' }}>
                    <p style={{ color: 'var(--text-muted)' }}>Loading history...</p>
                </div>
            </SubpageLayout>
        );
    }

    return (
        <SubpageLayout title="Inspection History" actionType="logout" showBottomNav>
            <div className="animate-fade-in" style={{ paddingBottom: '1rem' }}>
                {history.length === 0 ? (
                    <div className="card text-center" style={{ padding: '3rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <p className="text-muted" style={{ fontWeight: 500 }}>No recent inspections found.</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {history.map((item) => (
                            <div key={item.id} className="card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'flex-start', border: 'none', marginBottom: 0 }}>
                                <div style={{ backgroundColor: 'var(--bg-color)', padding: '0.8rem', borderRadius: '0.5rem', marginRight: '1rem', color: 'var(--secondary)' }}>
                                    <FileText size={24} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>{item.equipment_name}</h3>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                                            {new Date(item.submitted_at || item.started_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                                        {item.equipment_category} • Evaluated by {item.full_name}
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', backgroundColor: item.status === 'submitted' ? 'var(--success-bg)' : 'var(--warning-bg)', color: item.status === 'submitted' ? 'var(--success-hover)' : 'var(--warning-hover)', borderRadius: '0.25rem', fontWeight: 700 }}>
                                            {item.status.toUpperCase()}
                                        </span>
                                        {Number(item.fault_count) > 0 && (
                                            <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', borderRadius: '0.25rem', fontWeight: 700 }}>
                                                {item.fault_count} FAULT{Number(item.fault_count) > 1 ? 'S' : ''}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </SubpageLayout>
    );
}

