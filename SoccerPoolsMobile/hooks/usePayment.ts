import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Linking, Platform } from 'react-native';
import {
    getPaidLeagues, createRoundPayment, createLeaguePayment, getPaymentStatus, getPaymentHistory,
    getPaidBetRounds, getPaidBetRoundDetail, updatePaidPrediction, bulkUpdatePaidPredictions,
    getPaidRoundLeaderboard, getPaidLeagueLeaderboard, getRoundPrizePool,
} from '../services/paymentService';
import { getToken } from '../utils/storeToken';
import { Slug } from '../types';

export const usePaidLeagues = () => {
    return useQuery({
        queryKey: ['paidLeagues'],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return getPaidLeagues(token);
        },
        enabled: Platform.OS === 'web',
    });
};

export const useCreateRoundPayment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (roundId: number) => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return createRoundPayment(token, roundId);
        },
        onSuccess: (data) => {
            // Open MercadoPago checkout in browser
            // Use init_point for production, fall back to sandbox_init_point for testing
            const checkoutUrl = data.init_point || data.sandbox_init_point;
            if (checkoutUrl) {
                Linking.openURL(checkoutUrl);
            }
            queryClient.invalidateQueries({ queryKey: ['paymentHistory'] });
        },
    });
};

export const useCreateLeaguePayment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (leagueSlug: Slug) => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return createLeaguePayment(token, leagueSlug);
        },
        onSuccess: (data) => {
            // Open MercadoPago checkout in browser
            // Use init_point for production, fall back to sandbox_init_point for testing
            const checkoutUrl = data.init_point || data.sandbox_init_point;
            if (checkoutUrl) {
                Linking.openURL(checkoutUrl);
            }
            queryClient.invalidateQueries({ queryKey: ['paymentHistory'] });
        },
    });
};

export const usePaymentStatus = (externalRef: string, enabled: boolean = true) => {
    return useQuery({
        queryKey: ['paymentStatus', externalRef],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return getPaymentStatus(token, externalRef);
        },
        enabled: enabled && !!externalRef && Platform.OS === 'web',
        refetchInterval: (query) => {
            // Keep polling if payment is still pending (max 60 polls = ~5 minutes)
            const dataUpdateCount = query.state.dataUpdateCount;
            if (query.state.data?.status === 'pending' && dataUpdateCount < 60) {
                return 5000;
            }
            return false;
        },
    });
};

export const usePaymentHistory = () => {
    return useQuery({
        queryKey: ['paymentHistory'],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return getPaymentHistory(token);
        },
        enabled: Platform.OS === 'web',
    });
};

export const usePaidBetRounds = () => {
    return useQuery({
        queryKey: ['paidBetRounds'],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return getPaidBetRounds(token);
        },
        enabled: Platform.OS === 'web',
    });
};

export const usePaidBetRoundDetail = (betRoundId: number) => {
    return useQuery({
        queryKey: ['paidBetRound', betRoundId],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return getPaidBetRoundDetail(token, betRoundId);
        },
        enabled: Platform.OS === 'web' && !!betRoundId,
    });
};

export const useUpdatePaidPrediction = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: {
            matchResultId: number;
            goalsTeam1: number;
            goalsTeam2: number;
        }) => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return updatePaidPrediction(
                token,
                data.matchResultId,
                data.goalsTeam1,
                data.goalsTeam2
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['paidBetRounds'] });
            queryClient.invalidateQueries({ queryKey: ['paidBetRound'] });
        },
    });
};

export const useBulkUpdatePaidPredictions = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: {
            paidBetRoundId: number;
            predictions: Array<{
                match_id: number;
                goals_team_1: number;
                goals_team_2: number;
            }>;
        }) => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return bulkUpdatePaidPredictions(
                token,
                data.paidBetRoundId,
                data.predictions
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['paidBetRounds'] });
            queryClient.invalidateQueries({ queryKey: ['paidBetRound'] });
        },
    });
};

export const usePaidRoundLeaderboard = (roundSlug: Slug) => {
    return useQuery({
        queryKey: ['paidRoundLeaderboard', roundSlug],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return getPaidRoundLeaderboard(token, roundSlug);
        },
        enabled: Platform.OS === 'web' && !!roundSlug,
    });
};

export const usePaidLeagueLeaderboard = (leagueSlug: Slug) => {
    return useQuery({
        queryKey: ['paidLeagueLeaderboard', leagueSlug],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return getPaidLeagueLeaderboard(token, leagueSlug);
        },
        enabled: Platform.OS === 'web' && !!leagueSlug,
    });
};

export const useRoundPrizePool = (roundSlug: Slug) => {
    return useQuery({
        queryKey: ['roundPrizePool', roundSlug],
        queryFn: async () => {
            const token = await getToken();
            if (!token) throw new Error('No token found');
            return getRoundPrizePool(token, roundSlug);
        },
        enabled: Platform.OS === 'web' && !!roundSlug,
    });
};
