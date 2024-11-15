import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.20.51:8000'

const api = axios.create({
    baseURL: API_URL
})

const refreshToken = async () => {
    const refrToken = await AsyncStorage.getItem('refreshToken')
    if (!refrToken) throw new Error('No refresh token available')

    try {
        const response = await api.post('/api/jwt/refresh/', {
            refresh: refrToken
        })
        await AsyncStorage.setItem('accessToken', response.data.access)
        return response.data.access
    } catch (error) {
        throw error.response.data
    }
}

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('accessToken');
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
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const newAccessToken = await refreshToken();
                axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // TODO: Handle logout or re-login if refresh fails
                console.error("Token refresh failed", refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export default api