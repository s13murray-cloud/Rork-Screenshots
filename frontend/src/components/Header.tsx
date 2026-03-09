import { ArrowLeft, LogOut, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface HeaderProps {
    title: string;
    showBack?: boolean;
    actionType?: 'logout' | 'settings' | 'none';
    rightAction?: React.ReactNode;
}

export function Header({ title, showBack = false, actionType = 'none', rightAction }: HeaderProps) {
    const navigate = useNavigate();

    const handleAction = () => {
        if (actionType === 'logout') {
            navigate('/login');
        } else if (actionType === 'settings') {
            navigate('/manage');
        }
    };

    return (
        <header className="header" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
            <div className="header-left">
                {showBack ? (
                    <button className="icon-btn" onClick={() => navigate(-1)} aria-label="Go back">
                        <ArrowLeft size={24} />
                    </button>
                ) : (
                    <img src="/icon-512x512.png" alt="Checkta Icon" style={{ width: '32px', height: '32px', marginLeft: '0.5rem' }} />
                )}
            </div>
            <h1 className="header-title" style={{ textAlign: showBack ? 'center' : 'left', marginLeft: showBack ? 0 : '0.5rem' }}>{title}</h1>
            <div className="header-right">
                {rightAction ? (
                    rightAction
                ) : actionType !== 'none' ? (
                    <button className="icon-btn" onClick={handleAction} aria-label={actionType}>
                        {actionType === 'logout' ? <LogOut size={22} color="var(--text-muted)" /> : <Settings size={22} color="var(--text-muted)" />}
                    </button>
                ) : null}
            </div>
        </header>
    );
}
