import { api } from './api';

export interface Equipment {
    id: string;
    name: string;
    category: string;
    status: 'green' | 'amber' | 'red';
    photo_url?: string;
    version_id?: string;
    checklistItems?: Array<{
        id: string;
        title: string;
        description: string;
        isCriticalFault: boolean;
    }>;
}

export const equipmentService = {
    getAll: async (): Promise<Equipment[]> => {
        const response = await fetch(`${api.API_BASE_URL}/api/equipment`, {
            headers: api.getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch equipment');
        const data = await response.json();
        return data.equipment;
    },

    getById: async (id: string): Promise<Equipment> => {
        const response = await fetch(`${api.API_BASE_URL}/api/equipment/${id}`, {
            headers: api.getHeaders(),
        });
        if (!response.ok) throw new Error('Failed to fetch equipment');
        const data = await response.json();
        return data.equipment;
    },

    create: async (equipmentData: any): Promise<Equipment> => {
        const response = await fetch(`${api.API_BASE_URL}/api/equipment`, {
            method: 'POST',
            headers: api.getHeaders(),
            body: JSON.stringify(equipmentData)
        });
        if (!response.ok) throw new Error('Failed to create equipment');
        const data = await response.json();
        return data.equipment;
    }
};
