import { Button } from './Button';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ChecklistConfirmationProps {
    equipmentName: string;
    checklistName: string;
    date: Date;
    totalItems: number;
    completedItems: number;
    faultCount: number;
    naCount: number;
    faults: Array<{ id: string; title: string; notes?: string; isCriticalFault?: boolean }>;
    hasCriticalFault: boolean;
    onBack: () => void;
    onConfirm: () => void;
    isSubmitting: boolean;
}

export function ChecklistConfirmation({
    equipmentName,
    checklistName,
    date,
    completedItems,
    faultCount,
    naCount,
    faults,
    hasCriticalFault,
    onBack,
    onConfirm,
    isSubmitting
}: ChecklistConfirmationProps) {
    return (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%', padding: '1rem', backgroundColor: 'var(--bg-color)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--text-main)' }}>
                Review Submission
            </h2>

            {hasCriticalFault && (
                <div className="animate-fade-in" style={{ backgroundColor: 'var(--danger-bg)', border: '2px solid var(--danger)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.5rem', color: 'var(--danger-dark)', display: 'flex', flexDirection: 'column', gap: '0.5rem', boxShadow: 'var(--shadow-sm)' }}>
                    <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.125rem' }}>
                        <AlertCircle size={24} />
                        CRITICAL FAULT RECORDED
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 500 }}>
                        This equipment will be marked <strong>OUT OF SERVICE</strong> when the inspection is submitted.
                    </p>
                </div>
            )}

            <div style={{ backgroundColor: 'var(--surface-color)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', marginBottom: '1.5rem', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    Inspection Summary
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Equipment</span>
                        <span style={{ fontWeight: 600 }}>{equipmentName}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Checklist</span>
                        <span style={{ fontWeight: 600 }}>{checklistName}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Date</span>
                        <span style={{ fontWeight: 600 }}>{date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ backgroundColor: 'var(--surface-color)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success)', marginBottom: '0.25rem' }}>{completedItems - faultCount - naCount}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>OK</div>
                </div>
                <div style={{ padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--danger)', textAlign: 'center', backgroundColor: faultCount > 0 ? 'var(--danger-bg)' : 'var(--surface-color)' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--danger)', marginBottom: '0.25rem' }}>{faultCount}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--danger)', textTransform: 'uppercase', fontWeight: 600 }}>Faults</div>
                </div>
                <div style={{ backgroundColor: 'var(--surface-color)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{naCount}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>N/A</div>
                </div>
            </div>

            {faultCount > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertCircle size={20} />
                        Recorded Faults
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {faults.map(fault => (
                            <div key={fault.id} style={{ backgroundColor: 'var(--surface-color)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--danger)', borderLeft: fault.isCriticalFault ? '6px solid var(--danger)' : '4px solid var(--danger)', position: 'relative' }}>
                                {fault.isCriticalFault && (
                                    <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', fontSize: '0.7rem', fontWeight: 700, padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', textTransform: 'uppercase' }}>
                                        Critical
                                    </div>
                                )}
                                <div style={{ fontWeight: 600, marginBottom: '0.25rem', paddingRight: fault.isCriticalFault ? '4.5rem' : '0' }}>{fault.title}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{fault.notes}</div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {faultCount === 0 && (
                <div style={{ backgroundColor: 'var(--success-bg)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--success)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--success-dark)' }}>
                    <CheckCircle2 size={32} />
                    <div>
                        <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>All items marked OK</div>
                        <div style={{ fontSize: '0.875rem' }}>Equipment is ready for operation.</div>
                    </div>
                </div>
            )}

            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '1.5rem' }}>
                <Button
                    variant="primary"
                    size="large"
                    fullWidth
                    onClick={onConfirm}
                    isLoading={isSubmitting}
                    style={{ height: '56px', fontSize: '1.125rem', backgroundColor: '#f97316', borderColor: 'transparent' }}
                >
                    Confirm Submission
                </Button>
                <Button
                    variant="outline"
                    size="large"
                    fullWidth
                    onClick={onBack}
                    disabled={isSubmitting}
                    style={{ height: '56px', fontSize: '1.125rem' }}
                >
                    Back to Review
                </Button>
            </div>
        </div>
    );
}
