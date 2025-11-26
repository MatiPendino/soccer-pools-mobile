import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leagueList, userLeague, roundsListByLeague } from '../services/leagueService';
import { betsRegister } from '../services/betService';
import { getToken } from '../utils/storeToken';

export const useLeagues = (continent: number) => {
    return useQuery({
        queryKey: ['leagues', continent],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return leagueList(token, continent);
        },
        enabled: continent !== undefined,
    });
};

export const useUserLeague = () => {
    return useQuery({
        queryKey: ['userLeague'],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return userLeague(token);
        },
    });
};

export const useRounds = (leagueId: number, notGeneralRound?: boolean) => {
    return useQuery({
        queryKey: ['rounds', leagueId, notGeneralRound],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return roundsListByLeague(token, leagueId, notGeneralRound);
        },
        enabled: !!leagueId,
    });
};

export const useJoinLeague = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (leagueSlug: string) => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return betsRegister(token, leagueSlug);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['leagues'] });
            await queryClient.invalidateQueries({ queryKey: ['userLeague'] });
        }
    });
};
