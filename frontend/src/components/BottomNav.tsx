import { useNavigate, useLocation } from 'react-router-dom';
import { Truck, MenuSquare, AlertTriangle, Settings } from 'lucide-react';

export function BottomNav() {
    const navigate = useNavigate();
    const location = useLocation();

    const tabs = [
        { path: '/equipment', label: 'Equipment', icon: Truck },
        { path: '/history', label: 'History', icon: MenuSquare },
        { path: '/faults', label: 'Faults', icon: AlertTriangle },
        { path: '/manage', label: 'Manage', icon: Settings },
    ];

    return (
        <nav style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'var(--surface-color)',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-around',
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            boxShadow: '0 -1px 4px rgba(0,0,0,0.05)',
            zIndex: 40,
        }}>
            {/* Container to match desktop constraint if needed */}
            <div style={{
                display: 'flex',
                width: '100%',
                maxWidth: '420px',
                margin: '0 auto',
                justifyContent: 'space-around',
            }}>
                {tabs.map((tab) => {
                    const isActive = location.pathname.startsWith(tab.path);
                    const Icon = tab.icon;

                    return (
                        <button
                            key={tab.path}
                            onClick={() => navigate(tab.path)}
                            style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '0.75rem 0',
                                backgroundColor: 'transparent',
                                border: 'none',
                                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                                transition: 'color 0.2s',
                            }}
                        >
                            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} style={{ marginBottom: '4px' }} />
                            <span style={{ fontSize: '0.7rem', fontWeight: isActive ? 700 : 500 }}>{tab.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
