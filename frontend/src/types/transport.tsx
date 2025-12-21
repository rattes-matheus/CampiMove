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