import axios from 'axios';
import { safeGetItem, safeSetItem, safeRemoveItem } from '../utils/safeStorage';

export const API_URL: string = process.env.API_URL;

const api = axios.create({
    baseURL: API_URL
});

const refreshToken = async (): Promise<void> => {
    const refrToken: string = await safeGetItem('refreshToken');
    if (!refrToken) throw new Error('No refresh token available');

    try {
        const response = await api.post('/api/jwt/refresh/', {
            refresh: refrToken
        });
        await safeSetItem('accessToken', response.data.access);
        return response.data.access;
    } catch (error) {
        throw error.response.data;
    }
};

export const removeToken = async (): Promise<void> => {
    try {
        await safeRemoveItem('accessToken');
        await safeRemoveItem('refreshToken');
    } catch (error) {
        throw error.response.data;
    }
};


api.interceptors.request.use(
    async (config) => {
        const token: string = await safeGetItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes('jwt/create')
        ) {
            originalRequest._retry = true;
            try {
                const nRetriesStr: string | null = await safeGetItem('n_retries');
                let nRetries: number = nRetriesStr ? parseInt(nRetriesStr) : 0;
                // Update retries count
                nRetries += 1;
                await safeSetItem('n_retries', nRetries.toString());

                if (nRetries > 3) {
                    await safeRemoveItem('accessToken');
                    await safeRemoveItem('refreshToken');
                    await safeRemoveItem('n_retries');
                    return Promise.reject(error);
                }
                const newAccessToken = await refreshToken();
                await safeSetItem('n_retries', '0');
                return api(originalRequest);
            } catch (refreshError) {
                await safeRemoveItem('accessToken');
                await safeRemoveItem('refreshToken');
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api;