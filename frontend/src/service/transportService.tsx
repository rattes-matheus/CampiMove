import api from './api';

export interface Transport {
    id: number;
    type: 'CARPOOL' | 'BIKE' | 'SCOOTER';
    model: string;
    capacity: number;
    contact: string;
    active: boolean;
    averageRating: number;
    totalRatings: number;
    motorist: string;
}

export interface TransportRating {
    id: number;
    transportId: number;
    userId: number;
    userName: string;
    rating: number;
    review: string;
    createdAt: string;
}

export interface RateTransportRequest {
    rating: number;
    review: string;
}

export const transportService = {
    async getAllTransports(): Promise<Transport[]> {
        const response = await api.get('/api/transports');
        return response.data;
    },

    async getActiveTransports(): Promise<Transport[]> {
        const response = await api.get('/api/transports/active');
        return response.data;
    },

    async getTransportById(id: number): Promise<Transport> {
        const response = await api.get(`/api/transports/${id}`);
        return response.data;
    },

    async getTransportRatings(transportId: number): Promise<TransportRating[]> {
        const response = await api.get(`/api/transports/${transportId}/ratings`);
        return response.data;
    },

    async rateTransport(transportId: number, userId: number, data: RateTransportRequest) {
        const response = await api.post(`/api/transports/${transportId}/rate`, data, {
            headers: { 'X-User-Id': userId }
        });
        return response.data;
    },

    async getTopRatedTransports(): Promise<Transport[]> {
        const response = await api.get('/api/transports/top-rated');
        return response.data;
    },

    async getUserRatings(userId: number): Promise<TransportRating[]> {
        const response = await api.get(`/api/transports/user/${userId}/ratings`);
        return response.data;
    },

    async getTransportsByType(type: string): Promise<Transport[]> {
        const response = await api.get(`/api/transports/type/${type}`);
        return response.data;
    }
};