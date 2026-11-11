import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true
});

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