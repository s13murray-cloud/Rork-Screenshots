import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, AlertCircle, Trash2, GripVertical, Check, Camera } from 'lucide-react';
import { Button } from '../../../components/Button';
import { EQUIPMENT_TYPES, EQUIPMENT_CATEGORIES, getTemplateForEquipmentType } from '../../../lib/data/equipmentTemplates';
import type { EquipmentChecklistItem } from '../../../lib/types/equipment';
import { SubpageLayout } from '../../../layouts/SubpageLayout';

export function AddEquipment() {
    const navigate = useNavigate();

    // Step 1: Core details
    const [name, setName] = useState('');
    const [ref, setRef] = useState('');
    const [selectedTypeId, setSelectedTypeId] = useState<string>('');
    const [categoryFilter, setCategoryFilter] = useState<string>('');

    // Step 2: Customised checklist items (The core requirement: isolation from master)
    const [customItems, setCustomItems] = useState<EquipmentChecklistItem[]>([]);
    const [step, setStep] = useState<1 | 2>(1);

    // Editing state for new/existing items inline
    const [editingId, setEditingId] = useState<string | null>(null);

    // Watch for type changes and clone the master template securely
    useEffect(() => {
        if (selectedTypeId) {
            const masterTemplate = getTemplateForEquipmentType(selectedTypeId);
            if (masterTemplate) {
                // Perform a deep copy (simulated DB extraction) to strictly isolate this equipment's checklist
                const isolatedItems: EquipmentChecklistItem[] = masterTemplate.items.map(masterItem => ({
                    id: `local_eq_${Date.now()}_${Math.random().toString(36).substring(7)}`, // generate completely new ID
                    equipmentId: 'pending_eq_id', // Will be populated by real DB
                    section_name: masterItem.section_name,
                    item_text: masterItem.item_text,
                    response_type: masterItem.response_type,
                    is_critical: masterItem.is_critical,
                    photo_required: masterItem.photo_required,
                    sort_order: masterItem.sort_order
                }));
                // Sort by default order
                isolatedItems.sort((a, b) => a.sort_order - b.sort_order);
                setCustomItems(isolatedItems);
            } else {
                setCustomItems([]);
            }
        }
    }, [selectedTypeId]);

    const handleSave = async () => {
        try {
            const { equipmentService } = await import('../../../services/equipment');
            const newEq = await equipmentService.create({
                name,
                ref,
                categoryName: categoryFilter || 'General',
                customItems
            });
            alert(`Successfully saved: ${newEq.name} with ${customItems.length} checklist items.`);
            navigate('/manage');
        } catch (error: any) {
            console.error('Failed to save equipment', error);
            alert(`Failed to save equipment: ${error.message}`);
        }
    };


    // Template Modification Actions
    const removeItem = (id: string) => {
        setCustomItems(prev => prev.filter(item => item.id !== id));
    };

    const toggleCritical = (id: string) => {
        setCustomItems(prev => prev.map(item => item.id === id ? { ...item, is_critical: !item.is_critical } : item));
    };

    const togglePhoto = (id: string) => {
        setCustomItems(prev => prev.map(item => item.id === id ? { ...item, photo_required: !item.photo_required } : item));
    };

    const updateText = (id: string, newText: string) => {
        setCustomItems(prev => prev.map(item => item.id === id ? { ...item, item_text: newText } : item));
    };

    const addCustomItem = () => {
        const newItem: EquipmentChecklistItem = {
            id: `local_eq_custom_${Date.now()}`,
            equipmentId: 'pending_eq_id',
            section_name: 'Custom Additions',
            item_text: 'New Custom Check',
            response_type: 'OK_FAULT_NA',
            is_critical: false,
            photo_required: false,
            sort_order: customItems.length > 0 ? customItems[customItems.length - 1].sort_order + 1 : 1
        };
        setCustomItems(prev => [...prev, newItem]);
        setEditingId(newItem.id); // Open immediately for editing
    };

    // Reordering (Simplified UP/DOWN logic)
    const moveItem = (index: number, direction: 'up' | 'down') => {
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === customItems.length - 1)) return;

        const newItems = [...customItems];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;

        // Swap
        const temp = newItems[index];
        newItems[index] = newItems[swapIndex];
        newItems[swapIndex] = temp;

        // Rewrite sort_orders to match visual array order securely
        const sortedWithConsistentOrders = newItems.map((item, i) => ({ ...item, sort_order: i + 1 }));
        setCustomItems(sortedWithConsistentOrders);
    };

    const rightAction = step === 2 ? (
        <Button onClick={handleSave} size="small" disabled={customItems.length === 0 || !name}>
            <Save size={16} /> Save Equipment
        </Button>
    ) : undefined;


    return (
        <SubpageLayout title="Add Equipment Form" showBack rightAction={rightAction}>
            <div style={{ padding: 'var(--spacing-md)', paddingBottom: 'var(--spacing-xl)', maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: '100%' }}>
                {step === 1 ? (
                    <div className="animate-fade-in flex flex-col gap-lg">
                        <div className="card">
                            <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>1. Basic Details</h3>

                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 700 }}>Equipment Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g. Komatsu 20T Excavator"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label" style={{ fontWeight: 700 }}>Fleet Reference (Internal ID)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g. EX-20-01"
                                    value={ref}
                                    onChange={e => setRef(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="card">
                            <h3 style={{ marginBottom: '0.5rem' }}>2. Category & Master Template</h3>
                            <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                                A template preloads default safety checks. It can be customised in the next step.
                            </p>

                            <div className="form-group">
                                <label className="form-label">Filter by Category</label>
                                <select
                                    className="form-input"
                                    value={categoryFilter}
                                    onChange={(e) => {
                                        setCategoryFilter(e.target.value);
                                        setSelectedTypeId(''); // Reset selection when filtering
                                    }}
                                >
                                    <option value="">All Categories</option>
                                    {EQUIPMENT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>

                            <div className="form-group" style={{ marginBottom: '2rem' }}>
                                <label className="form-label">Equipment Base Type</label>
                                <select
                                    className="form-input"
                                    value={selectedTypeId}
                                    onChange={(e) => setSelectedTypeId(e.target.value)}
                                    style={{ borderColor: selectedTypeId ? 'var(--primary)' : 'var(--border-color)', borderWidth: selectedTypeId ? '2px' : '1.5px', fontWeight: selectedTypeId ? 600 : 400 }}
                                >
                                    <option value="">Select a template...</option>
                                    {EQUIPMENT_TYPES.filter(t => !categoryFilter || t.category === categoryFilter).map(type => (
                                        <option key={type.id} value={type.id}>{type.name}</option>
                                    ))}
                                </select>
                            </div>

                            <Button
                                type="button"
                                fullWidth
                                onClick={() => setStep(2)}
                                disabled={!name || !ref || !selectedTypeId}
                            >
                                Continue to Checklist Preview <ArrowLeft size={20} style={{ transform: 'rotate(180deg)' }} />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="animate-fade-in flex flex-col gap-lg">
                        <div className="card" style={{ backgroundColor: 'var(--primary-bg)', borderColor: 'var(--primary)', borderWidth: '2px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ color: 'var(--primary-hover)', margin: 0 }}>Review Specific Checklist</h3>
                                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                        Items dynamically duplicated from {EQUIPMENT_TYPES.find(t => t.id === selectedTypeId)?.name} Master Template.
                                    </p>
                                </div>
                                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>
                                    {customItems.length}
                                </div>
                            </div>
                        </div>

                        {/* Checklist Item Customisation List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {customItems.map((item, index) => (
                                <div key={item.id} className="card" style={{ padding: '1rem', borderTop: `4px solid ${item.is_critical ? 'var(--danger)' : 'var(--border-color)'}` }}>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            {item.section_name}
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => moveItem(index, 'up')} disabled={index === 0} style={{ background: 'none', border: 'none', color: index === 0 ? '#cbd5e1' : 'var(--text-main)', cursor: index === 0 ? 'not-allowed' : 'pointer' }}><ArrowLeft size={16} style={{ transform: 'rotate(90deg)' }} /></button>
                                            <button onClick={() => moveItem(index, 'down')} disabled={index === customItems.length - 1} style={{ background: 'none', border: 'none', color: index === customItems.length - 1 ? '#cbd5e1' : 'var(--text-main)', cursor: index === customItems.length - 1 ? 'not-allowed' : 'pointer' }}><ArrowLeft size={16} style={{ transform: 'rotate(-90deg)' }} /></button>
                                        </div>
                                    </div>

                                    {/* Edit Mode vs Display Mode */}
                                    {editingId === item.id ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                                            <textarea
                                                value={item.item_text}
                                                onChange={(e) => updateText(item.id, e.target.value)}
                                                className="form-input"
                                                style={{ minHeight: '80px', fontSize: '1rem', resize: 'vertical' }}
                                                autoFocus
                                            />
                                            <div style={{ alignSelf: 'flex-end' }}>
                                                <Button size="small" onClick={() => setEditingId(null)}><Check size={16} /> Done</Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                                            <div style={{ color: 'var(--text-muted)', paddingTop: '0.1rem' }}>
                                                <GripVertical size={20} />
                                            </div>
                                            <div
                                                style={{ flex: 1, fontWeight: 500, fontSize: '1.05rem', cursor: 'pointer', padding: '0.25rem', borderRadius: '4px' }}
                                                onClick={() => setEditingId(item.id)}
                                            >
                                                {item.item_text}
                                            </div>
                                        </div>
                                    )}

                                    {/* Capabilities Toolbar */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
                                        <div style={{ display: 'flex', gap: '1.5rem' }}>
                                            <button onClick={() => toggleCritical(item.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', background: 'none', cursor: 'pointer', color: item.is_critical ? 'var(--danger)' : 'var(--text-muted)', fontWeight: item.is_critical ? 700 : 500, fontSize: '0.875rem' }}>
                                                <AlertCircle size={18} fill={item.is_critical ? 'var(--danger-bg)' : 'none'} />
                                                Critical Risk
                                            </button>
                                            <button onClick={() => togglePhoto(item.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', background: 'none', cursor: 'pointer', color: item.photo_required ? 'var(--primary)' : 'var(--text-muted)', fontWeight: item.photo_required ? 700 : 500, fontSize: '0.875rem' }}>
                                                <Camera size={18} fill={item.photo_required ? 'var(--warning-bg)' : 'none'} />
                                                Evidence Req.
                                            </button>
                                        </div>
                                        <button onClick={() => removeItem(item.id)} style={{ display: 'flex', alignItems: 'center', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--danger)', padding: '0.25rem' }}>
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Button variant="outline" type="button" onClick={addCustomItem} style={{ borderStyle: 'dashed', borderWidth: '2px', backgroundColor: 'transparent', color: 'var(--secondary)' }}>
                            <Plus size={20} /> Add Custom Component Check
                        </Button>
                    </div>
                )}
            </div>
        </SubpageLayout>
    );
}
