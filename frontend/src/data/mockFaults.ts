export interface Fault {
    id: string;
    equipmentId: string;
    equipmentName: string;
    checklistItem: string;
    note: string;
    photoUrl?: string; // Optional reported photo
    dateReported: string;
    reportedBy: string;
    status: 'open' | 'rectified';
    rectificationNote?: string;
    rectificationPhoto?: string;
    rectifiedBy?: string;
    rectifiedAt?: string;
}

export const initialFaults: Fault[] = [
    {
        id: 'f1',
        equipmentId: 'EQ-102',
        equipmentName: 'Excavator 20T',
        checklistItem: 'Hydraulic systems',
        note: 'Small leak observed on main boom cylinder.',
        dateReported: '2023-10-25T08:30:00Z',
        reportedBy: 'John Smith',
        status: 'open'
    },
    {
        id: 'f2',
        equipmentId: 'EQ-102',
        equipmentName: 'Excavator 20T',
        checklistItem: 'Inspect tires/tracks',
        note: 'Track tension slightly loose on left side.',
        dateReported: '2023-10-25T08:35:00Z',
        reportedBy: 'John Smith',
        status: 'open'
    },
    {
        id: 'f3',
        equipmentId: 'EQ-405',
        equipmentName: 'Bobcat Skid Steer',
        checklistItem: 'Check engine oil level',
        note: 'Oil level below minimum limit. Needs top up.',
        dateReported: '2023-10-24T14:15:00Z',
        reportedBy: 'Sarah Jones',
        status: 'open'
    }
];

class FaultStore {
    private faults = [...initialFaults];
    private listeners: (() => void)[] = [];

    getFaults() {
        return this.faults;
    }

    getFault(id: string) {
        return this.faults.find(f => f.id === id);
    }

    rectifyFault(id: string, rectificationNote: string, rectificationPhoto?: string) {
        this.faults = this.faults.map(f =>
            f.id === id ? {
                ...f,
                status: 'rectified',
                rectificationNote,
                rectificationPhoto,
                rectifiedBy: 'Current User', // Mocked user
                rectifiedAt: new Date().toISOString()
            } : f
        );
        this.notify();
    }

    subscribe(listener: () => void) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notify() {
        this.listeners.forEach(l => l());
    }
}

export const faultStore = new FaultStore();
