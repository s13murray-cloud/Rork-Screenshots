import { AlertTriangle, Wrench, CheckCircle2, Truck, Clock } from 'lucide-react';

export function SupervisorDashboard() {
    // Mock Data for Dashboard
    const stats = [
        { title: 'Outstanding Faults', value: 12, icon: AlertTriangle, color: 'var(--danger)' },
        { title: 'Out of Service', value: 3, icon: Wrench, color: 'var(--warning-hover)' },
        { title: 'Checks Completed', value: 45, icon: CheckCircle2, color: 'var(--success)' },
        { title: 'Active Equipment', value: 118, icon: Truck, color: 'var(--primary)' },
    ];

    const equipmentStatus = [
        { id: 'EQ-102', name: 'Excavator 20T', status: 'Amber', lastInsp: '10 mins ago', faults: 2 },
        { id: 'EQ-105', name: 'Bobcat S70', status: 'Green', lastInsp: '1 hr ago', faults: 0 },
        { id: 'EQ-089', name: 'Dozer D6', status: 'Red', lastInsp: '2 hrs ago', faults: 4 },
        { id: 'EQ-042', name: 'Water Cart', status: 'Green', lastInsp: '3 hrs ago', faults: 0 },
        { id: 'EQ-018', name: 'Roller 12T', status: 'Amber', lastInsp: '4 hrs ago', faults: 1 },
    ];

    const outstandingFaults = [
        { eq: 'EQ-102', desc: 'Slight boom cylinder leak', reporter: 'J. Smith', date: 'Oct 25, 08:30' },
        { eq: 'EQ-089', desc: 'Engine oil severely low', reporter: 'T. Vance', date: 'Oct 25, 06:15' },
        { eq: 'EQ-089', desc: 'Track plate missing', reporter: 'T. Vance', date: 'Oct 25, 06:16' },
        { eq: 'EQ-018', desc: 'Beacon light smashed', reporter: 'A. Stone', date: 'Oct 24, 15:40' },
    ];

    const activities = [
        { time: '10:42 AM', type: 'fault', text: 'New fault reported on EQ-102 by J. Smith' },
        { time: '10:35 AM', type: 'inspection', text: 'Pre-start completed for EQ-105 (OK)' },
        { time: '09:15 AM', type: 'inspection', text: 'Pre-start completed for EQ-042 (OK)' },
        { time: '08:12 AM', type: 'rectified', text: 'S. Jones rectified fault on EQ-022' },
        { time: '06:20 AM', type: 'fault', text: 'Critical fault reported on EQ-089 by T. Vance' },
        { time: '06:18 AM', type: 'inspection', text: 'Pre-start submitted for EQ-089 (FAILED)' },
        { time: '06:05 AM', type: 'inspection', text: 'Pre-start completed for EQ-018 (AMBER)' },
    ];

    return (
        <div className="dashboard-grid">

            {/* Left Column: Primary Data */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Row 1: Summary Cards */}
                <div className="stats-grid">
                    {stats.map((stat, i) => {
                        const Icon = stat.icon;
                        return (
                            <div key={i} className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: `4px solid ${stat.color}` }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h4 style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>{stat.title}</h4>
                                    <div style={{ padding: '0.5rem', backgroundColor: `${stat.color}15`, borderRadius: '0.5rem', color: stat.color }}>
                                        <Icon size={20} />
                                    </div>
                                </div>
                                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>
                                    {stat.value}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Row 2: Equipment Status Table */}
                <div className="card">
                    <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Equipment Status Overview</h3>
                        <a href="/supervisor/equipment" style={{ fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>View All</a>
                    </div>
                    <div style={{ padding: '0 1.5rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr>
                                    <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem', borderBottom: '2px solid var(--border-color)' }}>Equipment</th>
                                    <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem', borderBottom: '2px solid var(--border-color)' }}>Status</th>
                                    <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem', borderBottom: '2px solid var(--border-color)' }}>Last Inspection</th>
                                    <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem', borderBottom: '2px solid var(--border-color)' }}>Fault Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {equipmentStatus.map((eq, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '1rem 0' }}>
                                            <div style={{ fontWeight: 600 }}>{eq.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{eq.id}</div>
                                        </td>
                                        <td style={{ padding: '1rem 0' }}>
                                            <span style={{
                                                display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 700,
                                                backgroundColor: eq.status === 'Green' ? 'var(--success-bg)' : eq.status === 'Amber' ? 'var(--warning-bg)' : 'var(--danger-bg)',
                                                color: eq.status === 'Green' ? 'var(--success)' : eq.status === 'Amber' ? 'var(--warning-hover)' : 'var(--danger)'
                                            }}>
                                                {eq.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{eq.lastInsp}</td>
                                        <td style={{ padding: '1rem 0' }}>
                                            <span style={{ fontWeight: 600, color: eq.faults > 0 ? 'var(--danger)' : 'var(--text-muted)' }}>{eq.faults}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Row 3: Outstanding Faults List */}
                <div className="card">
                    <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Top Urgent Faults</h3>
                        <a href="/supervisor/faults" style={{ fontSize: '0.875rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>View All</a>
                    </div>
                    <div style={{ padding: '0 1.5rem' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr>
                                    <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem', borderBottom: '2px solid var(--border-color)' }}>Equipment</th>
                                    <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem', borderBottom: '2px solid var(--border-color)' }}>Fault Description</th>
                                    <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem', borderBottom: '2px solid var(--border-color)' }}>Reporter</th>
                                    <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.875rem', borderBottom: '2px solid var(--border-color)' }}>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {outstandingFaults.map((f, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '1rem 0', fontWeight: 600, fontSize: '0.875rem' }}>{f.eq}</td>
                                        <td style={{ padding: '1rem 0', fontSize: '0.875rem' }}>{f.desc}</td>
                                        <td style={{ padding: '1rem 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{f.reporter}</td>
                                        <td style={{ padding: '1rem 0', fontSize: '0.875rem', color: 'var(--text-muted)' }}>{f.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Right Column: Activity Panel */}
            <div className="card" style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={20} className="text-muted" />
                    <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Real-time Activity</h3>
                </div>

                <div style={{ padding: '1.5rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {activities.map((act, i) => (
                        <div key={i} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                            {/* Timeline line */}
                            {i !== activities.length - 1 && (
                                <div style={{ position: 'absolute', left: '11px', top: '24px', bottom: '-24px', width: '2px', backgroundColor: 'var(--border-color)' }} />
                            )}

                            {/* Dot */}
                            <div style={{
                                width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0, zIndex: 1,
                                backgroundColor: act.type === 'fault' ? 'var(--danger-bg)' : act.type === 'rectified' ? 'var(--success-bg)' : 'var(--primary-bg)',
                                border: `2px solid ${act.type === 'fault' ? 'var(--danger)' : act.type === 'rectified' ? 'var(--success)' : 'var(--primary)'}`
                            }} />

                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '0.25rem' }}>{act.time}</div>
                                <div style={{ fontSize: '0.875rem', lineHeight: 1.4, color: 'var(--text-main)' }}>{act.text}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
