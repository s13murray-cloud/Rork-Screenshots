import { api } from './api';

export interface InspectionHistoryItem {
    id: string;
    started_at: string;
    submitted_at: string;
    status: string;
    equipment_name: string;
    equipment_category: string;
    full_name: string;
    fault_count: string | number;
}

export const inspectionsService = {
    getHistory: async (): Promise<InspectionHistoryItem[]> => {
        const response = await fetch(`${api.API_BASE_URL}/api/inspections/history`, {
            headers: api.getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch inspection history');
        const data = await response.json();
        return data.history;
    },

    syncOffline: async (payloads: any[]): Promise<any> => {
        const response = await fetch(`${api.API_BASE_URL}/api/inspections/sync`, {
            method: 'POST',
            headers: api.getHeaders(),
            body: JSON.stringify(payloads)
        });
        if (!response.ok) throw new Error('Failed to sync inspections');
        return await response.json();
    }
};
