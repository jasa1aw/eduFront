import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_END_POINT,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
    withCredentials: true,
    withXSRFToken: true,
});

export default api;
