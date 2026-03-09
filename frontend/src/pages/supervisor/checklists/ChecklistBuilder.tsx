import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Send, GripVertical, Plus, Trash2, Camera, AlertOctagon } from 'lucide-react';
import { Button } from '../../../components/Button';

interface ChecklistItem {
    id: string;
    text: string;
    isCritical: boolean;
    photoRequired: boolean;
    responseType: 'ok_fault_na' | 'yes_no' | 'value';
    type: 'header' | 'item';
}

export function ChecklistBuilder() {
    const location = useLocation();
    const navigate = useNavigate();
    const importedName = location.state?.importedName || 'New Checklist';

    const [checklistName, setChecklistName] = useState(importedName.replace('.pdf', '').replace('.docx', ''));

    // Extracted dummy data representing a successful parse
    const [items, setItems] = useState<ChecklistItem[]>([
        { id: 'h1', text: 'Engine Compartment', isCritical: false, photoRequired: false, responseType: 'ok_fault_na', type: 'header' },
        { id: 'i1', text: 'Check engine oil level', isCritical: true, photoRequired: false, responseType: 'ok_fault_na', type: 'item' },
        { id: 'i2', text: 'Inspect coolant level and hoses', isCritical: true, photoRequired: false, responseType: 'ok_fault_na', type: 'item' },
        { id: 'h2', text: 'Hydraulics', isCritical: false, photoRequired: false, responseType: 'ok_fault_na', type: 'header' },
        { id: 'i3', text: 'Check hydraulic fluid level', isCritical: true, photoRequired: false, responseType: 'ok_fault_na', type: 'item' },
        { id: 'i4', text: 'Inspect rams and hoses for leaks', isCritical: true, photoRequired: true, responseType: 'ok_fault_na', type: 'item' },
    ]);

    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

    const selectedItem = items.find(i => i.id === selectedItemId);

    const updateSelectedItem = (updates: Partial<ChecklistItem>) => {
        if (!selectedItemId) return;
        setItems(items.map(item => item.id === selectedItemId ? { ...item, ...updates } : item));
    };

    const deleteItem = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setItems(items.filter(i => i.id !== id));
        if (selectedItemId === id) setSelectedItemId(null);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', margin: '-2rem' }}>

            {/* Action Bar */}
            <div style={{ padding: '1rem 2rem', backgroundColor: 'white', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={() => navigate('/supervisor/checklists')}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', padding: '0.5rem' }}
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <input
                        value={checklistName}
                        onChange={(e) => setChecklistName(e.target.value)}
                        style={{ fontSize: '1.25rem', fontWeight: 700, border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-main)', width: '300px' }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Button variant="outline" icon={<Save size={18} />}>
                        Save Draft
                    </Button>
                    <Button icon={<Send size={18} />}>
                        Publish Checklist
                    </Button>
                </div>
            </div>

            {/* Dual Pane Workspace */}
            <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

                {/* Left Pane (Structure) */}
                <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', backgroundColor: '#f8fafc' }}>
                    <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Checklist Structure</h2>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Button variant="secondary" icon={<Plus size={16} />} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                                    Add Section
                                </Button>
                                <Button variant="secondary" icon={<Plus size={16} />} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                                    Add Item
                                </Button>
                            </div>
                        </div>

                        {items.map((item, index) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedItemId(item.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '1rem',
                                    padding: item.type === 'header' ? '1.5rem 1rem 0.5rem 1rem' : '1rem',
                                    backgroundColor: item.type === 'header' ? 'transparent' : 'white',
                                    border: item.type === 'header' ? 'none' : `2px solid ${selectedItemId === item.id ? 'var(--primary)' : 'var(--border-color)'}`,
                                    borderRadius: item.type === 'header' ? '0' : 'var(--radius-md)',
                                    cursor: 'pointer',
                                    transition: 'all 0.1s ease',
                                    boxShadow: item.type === 'item' ? '0 1px 3px rgba(0,0,0,0.05)' : 'none'
                                }}
                            >
                                <GripVertical size={20} className="text-muted" style={{ cursor: 'grab' }} />

                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {item.type === 'header' ? (
                                        <input
                                            value={item.text}
                                            onChange={(e) => {
                                                const newItems = [...items];
                                                newItems[index].text = e.target.value;
                                                setItems(newItems);
                                            }}
                                            style={{ fontSize: '1.1rem', fontWeight: 800, border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-main)' }}
                                        />
                                    ) : (
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                            <input
                                                value={item.text}
                                                onChange={(e) => {
                                                    const newItems = [...items];
                                                    newItems[index].text = e.target.value;
                                                    setItems(newItems);
                                                }}
                                                style={{ fontSize: '1rem', border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-main)' }}
                                            />
                                            {/* Badges row for quick view */}
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {item.isCritical && (
                                                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--danger)', backgroundColor: 'var(--danger-bg)', padding: '0.1rem 0.5rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <AlertOctagon size={10} /> Critical
                                                    </span>
                                                )}
                                                {item.photoRequired && (
                                                    <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--primary)', backgroundColor: 'var(--primary-bg)', padding: '0.1rem 0.5rem', borderRadius: '1rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                        <Camera size={10} /> Photo Required
                                                    </span>
                                                )}
                                                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', backgroundColor: 'var(--surface-color)', padding: '0.1rem 0.5rem', borderRadius: '1rem' }}>
                                                    {item.responseType === 'ok_fault_na' ? 'OK / Fault / NA' : item.responseType === 'yes_no' ? 'Yes / No' : 'Value Input'}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={(e) => deleteItem(item.id, e)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', opacity: selectedItemId === item.id ? 1 : 0.5 }}
                                >
                                    <Trash2 size={18} className={selectedItemId === item.id ? "text-danger" : ""} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Pane (Inspector) */}
                <div style={{ width: '350px', backgroundColor: 'white', borderLeft: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Item Properties</h2>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Select an item to edit rules.</p>
                    </div>

                    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1, overflowY: 'auto' }}>
                        {!selectedItem ? (
                            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '4rem' }}>
                                Select an item from the left pane to configure its properties.
                            </div>
                        ) : selectedItem.type === 'header' ? (
                            <div style={{ color: 'var(--text-muted)' }}>
                                Section headers do not have configurable properties.
                            </div>
                        ) : (
                            <>
                                {/* Response Type */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>Response Type</label>
                                    <select
                                        value={selectedItem.responseType}
                                        onChange={(e) => updateSelectedItem({ responseType: e.target.value as any })}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontSize: '0.875rem', backgroundColor: 'var(--surface-color)' }}
                                    >
                                        <option value="ok_fault_na">Standard (OK / Fault / N/A)</option>
                                        <option value="yes_no">Binary (Yes / No)</option>
                                        <option value="value">Numeric Value Input</option>
                                    </select>
                                </div>

                                {/* Rules Toggles */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>Validation Rules</label>

                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedItem.isCritical}
                                            onChange={(e) => updateSelectedItem({ isCritical: e.target.checked })}
                                            style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                                        />
                                        <div>
                                            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>Mark as Critical Safety Item</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Failing this immediately restricts equipment usage.</div>
                                        </div>
                                    </label>

                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedItem.photoRequired}
                                            onChange={(e) => updateSelectedItem({ photoRequired: e.target.checked })}
                                            style={{ width: '18px', height: '18px', accentColor: 'var(--primary)' }}
                                        />
                                        <div>
                                            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>Mandatory Photo Evidence</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Worker must upload a photo if a fault is identified.</div>
                                        </div>
                                    </label>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
