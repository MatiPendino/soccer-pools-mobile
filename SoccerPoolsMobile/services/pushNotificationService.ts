import api from "./api";
import * as Notifications from 'expo-notifications';

export const registerPush = async (token, fcmToken) => {
    try {
        const response = await api.post('/api/notifications/fcm_device/', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            fcm_token: fcmToken
        })
        return response
    } catch (error) {
        throw error.response.data
    }
}

export const getFCMToken = async () => {
    const token = (await Notifications.getDevicePushTokenAsync()).data;
    return token
}