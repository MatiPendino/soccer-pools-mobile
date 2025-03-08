import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_URL: string = process.env.API_URL

const api = axios.create({
    baseURL: API_URL
})

const refreshToken = async (): Promise<void> => {
    const refrToken: string = await AsyncStorage.getItem('refreshToken')
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

export const removeToken = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem('accessToken')
        await AsyncStorage.removeItem('refreshToken')  
    } catch (error) {
        console.log(error.response.data)
    }
}
    

api.interceptors.request.use(
    async (config) => {
        const token: string = await AsyncStorage.getItem('accessToken');
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
                console.log("Token refresh failed", refreshError);
                await AsyncStorage.removeItem('accessToken');
                await AsyncStorage.removeItem('refreshToken');
            }
        }
        return Promise.reject(error);
    }
);

export default api