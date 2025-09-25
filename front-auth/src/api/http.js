import axios from "axios";

export const http = axios.create({
    baseURL: "http://localhost:3000",
});

http.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
});

http.interceptors.response.use(
    (res) => res,
    async (error) => {
        const status = error?.response?.status;

        if (status === 401 || status === 403) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            if (window.location.pathname !== "/login") {
                window.location.assign("/login");
            }
        }

        return Promise.reject(error);
    }
);