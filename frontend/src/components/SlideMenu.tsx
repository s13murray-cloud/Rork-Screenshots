import { X, Home, BookOpen, Settings, LogOut, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SlideMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SlideMenu({ isOpen, onClose }: SlideMenuProps) {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleNav = (path: string) => {
        navigate(path);
        onClose();
    };

    return (
        <>
            <div
                onClick={onClose}
                className="animate-fade-in"
                style={{
                    position: 'fixed',
                    top: 0, bottom: 0, left: 0, right: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(4px)',
                    zIndex: 40,
                }}
            />
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: '80%',
                    maxWidth: '300px',
                    backgroundColor: 'var(--surface-color)',
                    boxShadow: 'var(--shadow-xl)',
                    zIndex: 50,
                    display: 'flex',
                    flexDirection: 'column',
                    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className={isOpen ? "animate-fade-in" : ""}
            >
                <div style={{ padding: 'var(--spacing-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
                    <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Menu</h2>
                    <button onClick={onClose} className="icon-btn" aria-label="Close menu">
                        <X size={24} />
                    </button>
                </div>

                <div style={{ padding: 'var(--spacing-md)', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <button onClick={() => handleNav('/equipment')} className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: '1rem' }}>
                        <Home size={20} className="text-muted" /> <span style={{ marginLeft: '1rem' }}>Home (Equipment)</span>
                    </button>

                    <button onClick={() => onClose()} className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: '1rem' }}>
                        <FileText size={20} className="text-muted" /> <span style={{ marginLeft: '1rem' }}>My Inspections</span>
                    </button>

                    <button onClick={() => onClose()} className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: '1rem' }}>
                        <BookOpen size={20} className="text-muted" /> <span style={{ marginLeft: '1rem' }}>Training & Docs</span>
                    </button>

                    <button onClick={() => onClose()} className="btn btn-ghost" style={{ justifyContent: 'flex-start', padding: '1rem' }}>
                        <Settings size={20} className="text-muted" /> <span style={{ marginLeft: '1rem' }}>Settings</span>
                    </button>
                </div>

                <div style={{ padding: 'var(--spacing-md)', borderTop: '1px solid var(--border-color)' }}>
                    <button onClick={() => handleNav('/login')} className="btn btn-outline btn-full text-danger" style={{ borderColor: 'var(--danger)' }}>
                        <LogOut size={20} /> <span style={{ marginLeft: '0.5rem' }}>Sign Out</span>
                    </button>
                </div>
            </div>
        </>
    );
}
