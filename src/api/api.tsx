import axios from "axios";
import { useLoadingStore } from "../store/loadingStore";

const API_BASE_URL = import.meta.env.DEV
    ? "http://localhost:8080"
    : "https://codilog-back.onrender.com";

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

api.interceptors.request.use((config) => {
    useLoadingStore.getState().startLoading();
    return config;
})

api.interceptors.response.use(

    // 성공
    (response) => response,

    // 실패
    async (error) => {
        const originalRequest = error.config;

        if(error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await api.post(
                    "/users/refresh"
                );

                return api(originalRequest);
            } catch (e) {
                window.location.href = "/";

                return Promise.reject(e);
            }
        }

        return Promise.reject(error);
    }
)

export default api;