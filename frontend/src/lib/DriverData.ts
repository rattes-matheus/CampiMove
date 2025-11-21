import axios from "axios";

export type Driver = {
    id: number,
    motorist: string,
    transportType: string,
    rating: number,
    profilePicURL: string,
    model: string
};

export function getTransportOptions(): Promise<Driver[]> {
    return axios.get("http://localhost:8080/drivers")
}