import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Plus } from 'lucide-react';
import { SubpageLayout } from '../layouts/SubpageLayout';

export function ManageDashboard() {
    const navigate = useNavigate();

    return (
        <SubpageLayout title="Management" actionType="logout" showBottomNav>
            <div className="animate-fade-in" style={{ padding: 'var(--spacing-lg)' }}>
                <div className="card text-center" style={{ padding: '3rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <p className="text-muted" style={{ fontWeight: 500, marginBottom: '2rem' }}>Management tools coming soon.</p>
                    <Button onClick={() => navigate('/manage/equipment/add')}>
                        <Plus size={20} /> Setup New Equipment
                    </Button>
                </div>
            </div>
        </SubpageLayout>
    );
}
