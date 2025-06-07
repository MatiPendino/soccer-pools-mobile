import { generateTournamentFormData } from "../utils/generateTournamentFormData";
import api from "./api";

export const listTournaments = async (token: string, leagueId: number, searchText: string) => {
    try {
        const response = await api.get(
                `/api/tournaments/tournament/?league_id=${leagueId}&search_text=${searchText}`,
            {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const retrieveTournament = async (token: string, tournamentId: number) => {
    try {
        const response = await api.get(`/api/tournaments/tournament/${tournamentId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const createTournament = async (
    token: string, name: string, description: string, logo: string, leagueId: number
) => {
    try {
        const formData: FormData = generateTournamentFormData(name, description, logo, leagueId);
        const response = await api.post('/api/tournaments/tournament/', 
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const editTournament = async (
    token: string, name: string, description: string, logo: string, tournamentId: number
) => {
    try {
        const formData: FormData = generateTournamentFormData(name, description, logo);
        const response = await api.patch(`/api/tournaments/tournament/${tournamentId}/`, 
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const retrieveTournamentUser = async (token: string, tournamentId: number) => {
    try {
        const response = await api.get(`/api/tournaments/tournament_user_tnt_id/${tournamentId}/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const patchTournamentUser = async (
        token: string, tournamentUserState: number, tournamentUserId: number
    ) => {
    try {
        const response = await api.patch(`/api/tournaments/tournament_user/${tournamentUserId}/`, {
            tournament_user_state: tournamentUserState,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const listPendingTournamentUsers = async (token, tournamentId) => {
    try {
        const response = await api.get(
            `/api/tournaments/tournament_user/${tournamentId}/pending_tournament_users/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

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
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}