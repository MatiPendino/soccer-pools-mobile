import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { prizesList, prizeClaim } from '../services/prizeService';
import { getToken } from '../utils/storeToken';

export const usePrizes = () => {
    return useQuery({
        queryKey: ['prizes'],
        queryFn: async () => {
            return prizesList();
        },
    });
};

export const useClaimPrize = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (prizeId: number) => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return prizeClaim(token, prizeId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userCoins'] });
        },
    });
};
