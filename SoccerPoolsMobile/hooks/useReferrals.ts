import { useQuery } from '@tanstack/react-query';
import { listMembers } from '../services/userService';
import { getToken } from '../utils/storeToken';

export const useReferrals = () => {
    return useQuery({
        queryKey: ['referrals'],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return listMembers(token);
        },
    });
};
