import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChecklistItem } from '../components/ChecklistItem';
import type { ChecklistStatus } from '../components/ChecklistItem';
import { ChecklistConfirmation } from '../components/ChecklistConfirmation';
import { Button } from '../components/Button';
import { Info, AlertCircle } from 'lucide-react';
import { SubpageLayout } from '../layouts/SubpageLayout';
import { equipmentService } from '../services/equipment';
import type { Equipment } from '../services/equipment';

export function Checklist() {
    const { equipmentId } = useParams();
    const navigate = useNavigate();
    const [equipment, setEquipment] = useState<Equipment | null>(null);
    const [checklistItems, setChecklistItems] = useState<NonNullable<Equipment['checklistItems']>>([]);
    const [items, setItems] = useState<Record<string, { status: ChecklistStatus, notes?: string, photoAttached?: boolean, isCriticalFault?: boolean }>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeItemId, setActiveItemId] = useState<string>('');
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        if (!equipmentId) return;
        const fetchEquipment = async () => {
            try {
                const data = await equipmentService.getById(equipmentId);
                setEquipment(data);
                const fetchedItems = data.checklistItems || [];
                setChecklistItems(fetchedItems);

                const initialItems: Record<string, { status: ChecklistStatus, notes?: string, photoAttached?: boolean, isCriticalFault?: boolean }> = {};
                fetchedItems.forEach(item => {
                    initialItems[item.id] = { status: null, notes: '', photoAttached: false, isCriticalFault: item.isCriticalFault };
                });
                setItems(initialItems);

                if (fetchedItems.length > 0) {
                    setActiveItemId(fetchedItems[0].id);
                }
            } catch (error) {
                console.error('Failed to load equipment for checklist', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchEquipment();
    }, [equipmentId]);

    const moveToNextItem = (currentId: string, currentItems: Record<string, any> = items) => {
        const nextItemIndex = checklistItems.findIndex(i => currentItems[i.id]?.status === null && i.id !== currentId);
        if (nextItemIndex !== -1) {
            const nextId = checklistItems[nextItemIndex].id;
            setActiveItemId(nextId);
            setTimeout(() => { // ensure state settles
                const el = document.getElementById(`item-${nextId}`);
                if (el) {
                    const y = el.getBoundingClientRect().top + window.scrollY - 140;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }, 50);
        } else {
            const firstUnresolved = checklistItems.find(i => currentItems[i.id]?.status === null);
            if (firstUnresolved) {
                setActiveItemId(firstUnresolved.id);
                setTimeout(() => {
                    const el = document.getElementById(`item-${firstUnresolved.id}`);
                    if (el) {
                        const y = el.getBoundingClientRect().top + window.scrollY - 140;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                }, 50);
            } else {
                setActiveItemId('');
                setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 50);
            }
        }
    };

    const handleStatusChange = (id: string, status: ChecklistStatus) => {
        const newItems = { ...items, [id]: { ...items[id], status } };
        setItems(newItems);

        setTimeout(() => {
            if (status !== 'fault') {
                moveToNextItem(id, newItems);
            }
        }, 300); // Wait for animations
    };

    const handleNotesChange = (id: string, notes: string) => {
        setItems(prev => ({ ...prev, [id]: { ...prev[id], notes } }));
    };

    const handleChangeCritical = (id: string, isCriticalFault: boolean) => {
        setItems(prev => ({ ...prev, [id]: { ...prev[id], isCriticalFault } }));
    };

    // Simulate attaching a photo inline
    const handleAttachPhoto = (id: string) => {
        // In a real app, this would open a camera/file picker.
        // For now, we just toggle a simulated state.
        setItems(prev => ({ ...prev, [id]: { ...prev[id], photoAttached: true } }));
    };

    const completedCount = Object.values(items).filter(i => i.status !== null).length;
    const totalCount = checklistItems.length;

    // Check if every item has been marked, and if it's a fault, that it has notes
    const activeItems = Object.values(items);
    const allFilled = activeItems.length === totalCount && activeItems.every(i => i.status !== null);

    // Validation: All faults must have a description
    const hasInvalidFaults = activeItems.some(i => i.status === 'fault' && (!i.notes || i.notes.trim() === ''));

    const canSubmit = allFilled && !hasInvalidFaults;
    const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;

        setShowConfirmation(true);
    };

    const handleConfirmSubmit = async () => {
        setIsSubmitting(true);
        try {
            const userStr = localStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : { full_name: 'Unknown User' };

            const { inspectionsService } = await import('../services/inspections');
            const syncPayload = [{
                inspection_id: `insp_${Date.now()}_${Math.random().toString(36).substring(7)}`,
                equipment_id: equipmentId,
                version_id: equipment?.version_id,
                started_at: new Date().toISOString(),
                worker_signature: user.full_name,
                responses: Object.entries(items).map(([checklist_item_id, item]) => ({
                    checklist_item_id,
                    result: item.status,
                    notes: item.notes || ''
                }))
            }];
            await inspectionsService.syncOffline(syncPayload);
            navigate('/history');
        } catch (error: any) {
            console.error('Failed to submit inspection', error);
            alert(`Failed to submit inspection: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <SubpageLayout title="Checklist" showBack>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', padding: '2rem' }}>
                    <p style={{ color: 'var(--text-muted)' }}>Loading checklist...</p>
                </div>
            </SubpageLayout>
        );
    }

    if (showConfirmation) {
        const faultDetails = Object.entries(items)
            .filter(([_, item]) => item.status === 'fault')
            .map(([id, item]) => {
                const itemDef = checklistItems.find(m => m.id === id);
                return {
                    id,
                    title: itemDef?.title || 'Unknown item',
                    notes: item.notes,
                    isCriticalFault: item.isCriticalFault
                };
            });

        return (
            <ChecklistConfirmation
                equipmentName={`${equipmentId || 'Forklift 1'}`}
                checklistName="Daily Pre-Start"
                date={new Date()}
                totalItems={totalCount}
                completedItems={completedCount}
                faultCount={activeItems.filter(i => i.status === 'fault').length}
                naCount={activeItems.filter(i => i.status === 'na').length}
                faults={faultDetails}
                hasCriticalFault={activeItems.some(i => i.isCriticalFault)}
                onBack={() => setShowConfirmation(false)}
                onConfirm={handleConfirmSubmit}
                isSubmitting={isSubmitting}
            />
        );
    }

    return (
        <SubpageLayout title="Checklist" showBack>
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>

                <div style={{
                    backgroundColor: 'var(--bg-color, var(--surface-color))',
                    padding: '1rem',
                    borderBottom: '1px solid var(--border-color)',
                    boxShadow: 'var(--shadow-sm)',
                    marginBottom: '1.5rem',
                    margin: '-1rem -1rem 1.5rem -1rem' // negate padding of container if exists
                }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: 'var(--text-main)' }}>
                        Equipment: {equipmentId || 'Forklift 1'}
                    </h2>

                    {/* Progress Bar */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                        <span>Progress</span>
                        <span>{completedCount} of {totalCount} items</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                            height: '100%',
                            width: `${progressPercent}%`,
                            backgroundColor: progressPercent === 100 ? 'var(--success)' : 'var(--primary)',
                            transition: 'width 0.3s ease, background-color 0.3s ease'
                        }} />
                    </div>
                </div>

                <div style={{ backgroundColor: 'var(--warning-bg)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', color: 'var(--text-main)' }}>
                    <Info size={20} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--warning-hover)' }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                        Identify any faults before operating the equipment. Mark N/A if an item does not apply.
                    </span>
                </div>

                <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, paddingBottom: '120px' }}>
                        {checklistItems.map(item => (
                            <ChecklistItem
                                key={item.id}
                                id={item.id}
                                title={item.title}
                                description={item.description}
                                status={items[item.id]?.status || null}
                                notes={items[item.id]?.notes}
                                photoAttached={items[item.id]?.photoAttached}
                                isCriticalFault={items[item.id]?.isCriticalFault}
                                isActive={activeItemId === item.id}
                                onActivate={() => setActiveItemId(item.id)}
                                onDone={() => moveToNextItem(item.id, items)}
                                onChangeStatus={handleStatusChange}
                                onChangeNotes={handleNotesChange}
                                onAttachPhoto={handleAttachPhoto}
                                onChangeCritical={handleChangeCritical}
                            />
                        ))}
                    </div>

                    {/* Sticky Footer for action */}
                    <div className="sticky-footer" style={{ bottom: '72px' }}> {/* Adjusted to sit perfectly above BottomNav */}
                        {allFilled && hasInvalidFaults && (
                            <div style={{ marginBottom: '0.75rem', color: 'var(--danger)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                                <AlertCircle size={16} />
                                Please provide descriptions for all recorded faults.
                            </div>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            size="large"
                            disabled={!canSubmit}
                            isLoading={isSubmitting}
                            style={{
                                height: '56px',
                                fontSize: '1.125rem',
                                backgroundColor: canSubmit ? '#f97316' : '#fdba74',
                                color: 'white',
                                borderColor: 'transparent',
                                opacity: 1 // override global disabled opacity to match precise colours
                            }}
                        >
                            {canSubmit ? 'Review and Submit' : `Complete ${totalCount - completedCount} more items`}
                        </Button>
                    </div>
                </form>
            </div>
        </SubpageLayout>
    );
}
