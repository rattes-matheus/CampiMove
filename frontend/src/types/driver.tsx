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