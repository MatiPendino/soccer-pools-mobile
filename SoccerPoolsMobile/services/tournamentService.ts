import api from './api';
import { generateTournamentFormData } from '../utils/generateFormData';

export const listTournaments = async (
    token: string, leagueId: number, searchText: string, page: number = 1
) => {
    try {
        const response = await api.get(
            `/api/tournaments/tournament/?league_id=${leagueId}&search_text=${searchText}&page=${page}`,
            {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const retrieveTournament = async (token: string, tournamentId: number) => {
    try {
        const response = await api.get(`/api/tournaments/tournament/${tournamentId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const createTournament = async (
    token: string, name: string, description: string, logo: string,
    leagueId: number, tournamentType: number = 0
) => {
    try {
        const formData: FormData = generateTournamentFormData(
            name, description, logo, leagueId, tournamentType
        );
        const response = await api.post('/api/tournaments/tournament/',
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const editTournament = async (
    token: string, name: string, description: string, logo: string,
    tournamentId: number, tournamentType?: number
) => {
    try {
        const formData: FormData = generateTournamentFormData(
            name, description, logo, undefined, tournamentType
        );
        const response = await api.patch(`/api/tournaments/tournament/${tournamentId}/`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const joinTournament = async (token: string, tournamentId: number) => {
    try {
        const response = await api.post(
            `/api/tournaments/tournament/${tournamentId}/join/`, {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const retrieveTournamentUser = async (token: string, tournamentId: number) => {
    try {
        const response = await api.get(
            `/api/tournaments/tournament_user_tnt_id/${tournamentId}/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const listPendingTournamentUsers = async (token, tournamentId) => {
    try {
        const response = await api.get(
            `/api/tournaments/tournament_user/${tournamentId}/pending_tournament_users/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const updateStateTournamentUser = async (
    token: string, tournamentUserId: number, tournamentState: number
) => {
    try {
        const response = await api.post(
            `/api/tournaments/tournament_user/${tournamentUserId}/update_tournament_user_state/`, {
            
            tournament_state: tournamentState,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};