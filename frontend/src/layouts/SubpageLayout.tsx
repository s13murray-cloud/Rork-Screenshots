import React from 'react';
import { Header } from '../components/Header';
import type { HeaderProps } from '../components/Header';
import { BottomNav } from '../components/BottomNav';

interface SubpageLayoutProps extends HeaderProps {
    children: React.ReactNode;
    showBottomNav?: boolean;
}

export function SubpageLayout({
    title,
    showBack,
    actionType,
    rightAction,
    children,
    showBottomNav = false
}: SubpageLayoutProps) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
            <div className="mobile-only" style={{ position: 'sticky', top: 0, zIndex: 50, flexShrink: 0 }}>
                <Header
                    title={title}
                    showBack={showBack}
                    actionType={actionType}
                    rightAction={rightAction}
                />
            </div>

            {/* 
              Desktop layout uses the MainLayout header/sidebar, so we don't display the mobile Header, 
              but we do let the content scroll naturally. 
            */}
            <main className="main-content" style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative'
            }}>
                {children}
            </main>

            {showBottomNav && (
                <div className="mobile-only" style={{ flexShrink: 0 }}>
                    <BottomNav />
                </div>
            )}
        </div>
    );
}
