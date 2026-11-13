import axios from "axios";
import { useLoadingStore } from "../store/loadingStore";

const API_BASE_URL = import.meta.env.DEV
    ? "http://localhost:8080"
    : "/api";

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
    (response) => {
        useLoadingStore.getState().stopLoading();
        return response;
    },

    // 실패
    async (error) => {
        useLoadingStore.getState().stopLoading();

        const originalRequest = error.config;

        if(error.response?.status === 401 && originalRequest && !originalRequest._retry && !originalRequest.url?.includes("/users/refresh")) {
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