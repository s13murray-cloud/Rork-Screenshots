import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, ChevronRight } from 'lucide-react';
import { SubpageLayout } from '../layouts/SubpageLayout';

import { equipmentService } from '../services/equipment';
import type { Equipment } from '../services/equipment';

export function EquipmentSelect() {
    const navigate = useNavigate();
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEq = async () => {
            try {
                const data = await equipmentService.getAll();
                setEquipment(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEq();
    }, []);

    // Removed handleSelect

    if (isLoading) {
        return (
            <SubpageLayout title="Equipment" actionType="logout" showBottomNav>
                <div className="animate-fade-in">
                    <h2 style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        Equipment <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500, backgroundColor: '#e2e8f0', padding: '0.2rem 0.6rem', borderRadius: '1rem' }}>...</span>
                    </h2>
                    <div className="flex flex-col gap-md">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="card" style={{ height: '88px', backgroundColor: '#e2e8f0', animation: 'fadeIn 1s infinite alternate', border: 'none' }} />
                        ))}
                    </div>
                </div>
            </SubpageLayout>
        );
    }

    return (
        <SubpageLayout title="Equipment" actionType="logout" showBottomNav>
            <div className="animate-fade-in">
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-main)', fontWeight: 600, backgroundColor: 'var(--surface-color)', padding: '0.2rem 0.6rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                        {equipment.length} items available
                    </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {equipment.map((eq) => {
                        const isFault = eq.status === 'red' || eq.status === 'amber';
                        const statusBadge = eq.status === 'green' ? 'OK' : (eq.status === 'red' ? 'OUT OF SERVICE' : 'FAULT');
                        const description = eq.status === 'green' ? 'Available for use' : (eq.status === 'red' ? 'Do not operate' : 'Has active faults');

                        return (
                            <div
                                key={eq.id}
                                className="card"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: eq.status === 'red' ? 'not-allowed' : 'pointer',
                                    opacity: eq.status === 'red' ? 0.75 : 1,
                                    border: 'none',
                                    marginBottom: 0,
                                    padding: '1.25rem'
                                }}
                                onClick={() => eq.status !== 'red' && navigate(`/checklist/${eq.id}`)}
                            >
                                <div style={{
                                    backgroundColor: 'var(--bg-color)',
                                    padding: '0.8rem',
                                    borderRadius: '0.5rem',
                                    marginRight: '1rem',
                                    color: 'var(--secondary)'
                                }}>
                                    <Truck size={24} />
                                </div>

                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>{eq.name}</h3>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            padding: '0.2rem 0.5rem',
                                            backgroundColor: isFault ? 'var(--danger-bg)' : 'var(--success-bg)',
                                            color: isFault ? 'var(--danger)' : 'var(--success-hover)',
                                            borderRadius: '0.25rem',
                                            fontWeight: 700
                                        }}>
                                            {statusBadge}
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '0.8rem', padding: '0.1rem 0.4rem', backgroundColor: 'var(--border-color)', borderRadius: '4px', fontWeight: 600, color: 'var(--text-main)' }}>{eq.category}</span>
                                        <span style={{ fontSize: '0.875rem', color: isFault ? 'var(--danger)' : 'var(--text-muted)' }}>
                                            {description}
                                        </span>
                                    </div>
                                </div>

                                {!isFault && (
                                    <div style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                                        <ChevronRight size={24} strokeWidth={2.5} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </SubpageLayout>
    );
}
