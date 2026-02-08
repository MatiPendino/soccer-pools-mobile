import api from './api';
import {
    Slug, PaidLeagueConfigProps, PaymentProps, PaymentPreferenceProps, PaidBetRoundProps,
    PaidPrizePoolProps, PaidLeaderboardEntryProps,
} from '../types';

export const getPaidLeagues = async (token: string): Promise<PaidLeagueConfigProps[]> => {
    const response = await api.get('/api/payments/leagues/', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const createRoundPayment = async (
    token: string, roundId: number
): Promise<PaymentPreferenceProps> => {
    const response = await api.post(
        `/api/payments/round/${roundId}/pay/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export const createLeaguePayment = async (
    token: string, leagueSlug: Slug
): Promise<PaymentPreferenceProps> => {
    const response = await api.post(
        `/api/payments/league/${leagueSlug}/pay/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};


export const getPaymentStatus = async (
    token: string, externalRef: string
): Promise<PaymentProps> => {
    const response = await api.get(`/api/payments/status/${externalRef}/`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getPaymentHistory = async (token: string): Promise<PaymentProps[]> => {
    const response = await api.get('/api/payments/history/', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getPaidBetRounds = async (token: string): Promise<PaidBetRoundProps[]> => {
    const response = await api.get('/api/payments/bets/', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getPaidBetRoundDetail = async (
    token: string, betRoundId: number
): Promise<PaidBetRoundProps> => {
    const response = await api.get(`/api/payments/bets/${betRoundId}/`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const updatePaidPrediction = async (
    token: string, matchResultId: number, goalsTeam1: number, goalsTeam2: number
): Promise<any> => {
    const response = await api.patch(
        `/api/payments/predictions/${matchResultId}/`,
        { goals_team_1: goalsTeam1, goals_team_2: goalsTeam2 },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export const bulkUpdatePaidPredictions = async (
    token: string,
    paidBetRoundId: number,
    predictions: Array<{ match_id: number; goals_team_1: number; goals_team_2: number }>
): Promise<any> => {
    const response = await api.patch(
        `/api/payments/predictions/bulk/${paidBetRoundId}/`,
        { predictions },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export const getPaidRoundLeaderboard = async (
    token: string, roundSlug: Slug
): Promise<PaidLeaderboardEntryProps[]> => {
    const response = await api.get(`/api/payments/leaderboard/round/${roundSlug}/`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getPaidLeagueLeaderboard = async (
    token: string, leagueSlug: Slug
): Promise<PaidLeaderboardEntryProps[]> => {
    const response = await api.get(`/api/payments/leaderboard/league/${leagueSlug}/`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const getRoundPrizePool = async (
    token: string, roundSlug: Slug
): Promise<PaidPrizePoolProps> => {
    const response = await api.get(`/api/payments/prize-pool/round/${roundSlug}/`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};
