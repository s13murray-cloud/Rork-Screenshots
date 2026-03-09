import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Truck,
    ClipboardCheck,
    AlertTriangle,
    History,
    BarChart2,
    Settings,
    Bell,
    Search,
    User,
    ChevronDown
} from 'lucide-react';

export function SupervisorLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { path: '/supervisor', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/supervisor/equipment', label: 'Equipment', icon: Truck },
        { path: '/supervisor/checklists', label: 'Checklists', icon: ClipboardCheck },
        { path: '/supervisor/faults', label: 'Faults', icon: AlertTriangle },
        { path: '/supervisor/history', label: 'History', icon: History },
        { path: '/supervisor/reports', label: 'Reports', icon: BarChart2 },
        { path: '/supervisor/settings', label: 'Management', icon: Settings },
    ];

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#f1f5f9', overflow: 'hidden' }}>
            {/* Left Sidebar */}
            <aside style={{
                width: '260px',
                backgroundColor: 'white',
                borderRight: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0
            }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>C</span>
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Checkta</span>
                </div>

                <nav style={{ flex: 1, padding: '1.5rem 1rem', overflowY: 'auto' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', paddingLeft: '0.75rem' }}>
                        DEPOT MANAGEMENT
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {menuItems.map((item) => {
                            const isActive = location.pathname === item.path || (item.path !== '/supervisor' && location.pathname.startsWith(item.path));
                            const Icon = item.icon;
                            return (
                                <li key={item.path}>
                                    <button
                                        onClick={() => navigate(item.path)}
                                        style={{
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            padding: '0.75rem',
                                            borderRadius: 'var(--radius-md)',
                                            border: 'none',
                                            backgroundColor: isActive ? 'var(--primary-bg)' : 'transparent',
                                            color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                                            fontWeight: isActive ? 700 : 500,
                                            cursor: 'pointer',
                                            textAlign: 'left',
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.backgroundColor = 'var(--surface-color)';
                                                e.currentTarget.style.color = 'var(--text-main)';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (!isActive) {
                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                e.currentTarget.style.color = 'var(--text-muted)';
                                            }
                                        }}
                                    >
                                        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                        <span>{item.label}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                    Checkta Supervisor v1.0
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* Top Header */}
                <header style={{
                    height: '72px',
                    backgroundColor: 'white',
                    borderBottom: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 2rem',
                    flexShrink: 0
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        {/* Site Selector */}
                        <button style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)'
                        }}>
                            <span>Brisbane North Depot</span>
                            <ChevronDown size={16} className="text-muted" />
                        </button>

                        {/* Search Bar */}
                        <div style={{ position: 'relative', width: '300px' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                placeholder="Search equipment, faults..."
                                style={{
                                    width: '100%',
                                    padding: '0.5rem 1rem 0.5rem 2.5rem',
                                    borderRadius: 'var(--radius-full)',
                                    border: '1px solid var(--border-color)',
                                    backgroundColor: 'var(--surface-color)',
                                    fontSize: '0.875rem'
                                }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        {/* Notifications */}
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', color: 'var(--text-muted)' }}>
                            <Bell size={24} />
                            <span style={{
                                position: 'absolute', top: '-2px', right: '-2px',
                                width: '10px', height: '10px', backgroundColor: 'var(--danger)',
                                borderRadius: '50%', border: '2px solid white'
                            }} />
                        </button>

                        {/* User Profile */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1.5rem' }}>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-main)' }}>Sarah Jones</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Depot Manager</div>
                            </div>
                            <div style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                <User size={20} />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '2rem' }}>
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
