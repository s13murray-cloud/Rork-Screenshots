export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Skeleton for the API client to be used later
export const api = {
    API_BASE_URL,
    // Add token here when auth is implemented
    getToken: () => localStorage.getItem('token'),

    getHeaders: () => {
        const token = api.getToken();
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    },

    // Future methods will go here:
    users: {
        getAll: async () => {
            const res = await fetch(`${api.API_BASE_URL}/api/users`, { headers: api.getHeaders() });
            if (!res.ok) throw new Error('Failed to fetch users');
            return res.json();
        }
    },
    auth: {
        login: async (data: { email: string, pin: string }) => {
            const res = await fetch(`${api.API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: data.email, password: data.pin })
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to login');
            }
            return res.json();
        }
    },
    invitations: {
        create: async (data: { email: string, role_id: string, team_name?: string }) => {
            const res = await fetch(`${api.API_BASE_URL}/api/invitations`, {
                method: 'POST',
                headers: api.getHeaders(),
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Failed to create invitation');
            return res.json();
        },
        getDetails: async (token: string) => {
            const res = await fetch(`${api.API_BASE_URL}/api/invitations/${token}`);
            if (!res.ok) throw new Error('Failed to get invitation');
            return res.json();
        },
        accept: async (token: string, data: { full_name: string, pin: string }) => {
            const res = await fetch(`${api.API_BASE_URL}/api/invitations/${token}/accept`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!res.ok) throw new Error('Failed to accept invitation');
            return res.json();
        }
    },
    faults: {
        getAll: async () => {
            const res = await fetch(`${api.API_BASE_URL}/api/faults`, { headers: api.getHeaders() });
            if (!res.ok) throw new Error('Failed to fetch faults');
            return res.json();
        }
    }
};
