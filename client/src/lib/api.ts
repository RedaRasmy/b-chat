import axios from "axios"

export const api = axios.create({
    baseURL: import.meta.env.DEV
        ? import.meta.env.VITE_API_URL + "/api"
        : "/api",
    withCredentials: true,
})

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config

        if (
            originalRequest.url?.includes("/auth/login") ||
            originalRequest.url?.includes("/auth/register")
        ) {
            return Promise.reject(error)
        }

        if (originalRequest.url?.includes("/auth/refresh")) {
            return Promise.reject(error)
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true
            try {
                await api.post("/auth/refresh")
                return api(originalRequest)
            } catch (refreshError) {
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    },
)
