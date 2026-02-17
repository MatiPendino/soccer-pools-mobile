import api from './api';

export interface AvatarProps {
    id: number;
    image: string;
}

export const getAvatars = async (token: string): Promise<AvatarProps[]> => {
    try {
        const response = await api.get('/api/user/avatars/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
