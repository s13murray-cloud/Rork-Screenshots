import { SupervisorDashboard } from './supervisor/SupervisorDashboard';
import { EquipmentSelect } from './EquipmentSelect';

export function UnifiedDashboard() {
    return (
        <div style={{ width: '100%', height: '100%' }}>
            {/* Desktop View */}
            <div className="desktop-only" style={{ width: '100%', height: '100%' }}>
                <SupervisorDashboard />
            </div>

            {/* Mobile View */}
            <div className="mobile-only" style={{ width: '100%', height: '100%' }}>
                <EquipmentSelect />
            </div>
        </div>
    );
}
