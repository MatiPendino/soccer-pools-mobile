import { useQuery } from '@tanstack/react-query';
import { getAvatars } from '../services/avatarService';
import { getToken } from '../utils/storeToken';

export const useAvatars = () => {
    return useQuery({
        queryKey: ['avatars'],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return getAvatars(token);
        },
    });
};
