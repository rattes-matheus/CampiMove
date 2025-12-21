import api from './api';

export interface Driver {
    id: number;
    name: string;
    email: string;
    phone: string;
    licenseNumber: string;
    licenseCategory?: string;
    age?: number;
    rating: number;
    profilePictureUrl?: string;
    active: boolean;
}

export interface CreateDriverRequest {
    name: string;
    email: string;
    phone: string;
    licenseNumber: string;
    licenseCategory: string;
    age: number;
    password: string;
}

export interface DriverDropdown {
    id: number;
    name: string;
    licenseNumber: string;
}

export const driverService = {
    async getAllDrivers(): Promise<Driver[]> {
        const response = await api.get('/api/admin/drivers');
        return response.data;
    },

    async getActiveDrivers(): Promise<DriverDropdown[]> {
        const response = await api.get('/api/drivers/dropdown');
        return response.data;
    },

    async createDriver(data: CreateDriverRequest): Promise<Driver> {
        const response = await api.post('/api/drivers', data);
        return response.data;
    },

    async toggleDriverStatus(id: number): Promise<void> {
        await api.patch(`/api/drivers/${id}/toggle-status`);
    },

    async getDriverById(id: number): Promise<Driver> {
        const response = await api.get(`/api/drivers/${id}`);
        return response.data;
    }
};