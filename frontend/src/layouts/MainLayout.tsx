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
    Users,
    ChevronDown
} from 'lucide-react';

export function MainLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    // Desktop Menu Items
    const menuItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/equipment', label: 'Equipment', icon: Truck },
        { path: '/manage/checklists', label: 'Checklists', icon: ClipboardCheck },
        { path: '/faults', label: 'Faults', icon: AlertTriangle },
        { path: '/history', label: 'History', icon: History },
        { path: '/manage/reports', label: 'Reports', icon: BarChart2 },
        { path: '/team', label: 'Team', icon: Users },
        { path: '/manage', label: 'Management', icon: Settings },
    ];

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: 'var(--bg-color)', overflow: 'hidden' }}>

            {/* Desktop Left Sidebar */}
            <aside className="desktop-only" style={{
                width: '260px',
                backgroundColor: 'white',
                borderRight: '1px solid var(--border-color)',
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
                            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
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
                    Checkta Unified v1.0
                </div>
            </aside>

            {/* Content Column */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, position: 'relative' }}>

                {/* Desktop Top Header */}
                <header className="desktop-only" style={{
                    height: '72px',
                    backgroundColor: 'white',
                    borderBottom: '1px solid var(--border-color)',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 2rem',
                    flexShrink: 0
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <img src="/icon-512x512.png" alt="Checkta Icon" style={{ width: '36px', height: '36px' }} />
                            <button style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                background: 'none', border: 'none', cursor: 'pointer',
                                fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)'
                            }}>
                                <span>Brisbane North Depot</span>
                                <ChevronDown size={16} className="text-muted" />
                            </button>
                        </div>

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
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', color: 'var(--text-muted)' }}>
                            <Bell size={24} />
                            <span style={{
                                position: 'absolute', top: '-2px', right: '-2px',
                                width: '10px', height: '10px', backgroundColor: 'var(--danger)',
                                borderRadius: '50%', border: '2px solid white'
                            }} />
                        </button>

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

                <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
