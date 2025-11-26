import { 
    useQuery, useMutation, useInfiniteQuery, useQueryClient 
} from '@tanstack/react-query';
import { 
    matchResultsList, retrieveOriginalMatchResult, matchResultsUpdate 
} from '../services/matchService';
import { getBetLeadersCursor } from '../services/betService';
import { getToken } from '../utils/storeToken';
import { Slug } from '../types';

export const useMatchResults = (roundId: number) => {
    return useQuery({
        queryKey: ['matchResults', roundId],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return matchResultsList(token, roundId);
        },
        enabled: !!roundId,
    });
};

export const useOriginalMatchResult = (matchId: number) => {
    return useQuery({
        queryKey: ['originalMatchResult', matchId],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return retrieveOriginalMatchResult(token, matchId);
        },
        enabled: !!matchId,
    });
};

export const useUpdateMatchResults = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (matchResults: any) => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return matchResultsUpdate(token, matchResults);
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['matchResults'] });
        },
    });
};

export const useBetLeaders = (roundSlug: Slug, tournamentId: number) => {
    return useInfiniteQuery({
        queryKey: ['betLeaders', roundSlug, tournamentId],
        queryFn: async ({ pageParam }) => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return getBetLeadersCursor(token, roundSlug, tournamentId, pageParam);
        },
        initialPageParam: null as string | null,
        getNextPageParam: (lastPage) => lastPage.next || undefined,
        enabled: !!roundSlug,
    });
};
