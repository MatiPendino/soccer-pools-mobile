import api from "./api";
import { Slug } from "../types";

export const betsRegister = async (token, leagueSlug) => {
    try {
        const response = await api.post('/api/bets/league_bets_create/', {
            headers: {
                Authorization: `Bearer ${token}`
            },
            league_slug: leagueSlug
        })

        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const betsLeaders = async (token: string, roundSlug: Slug, tournamentId: number) => {
    try {
        const response = await api.get(
            `/api/bets/bet_results/?round_slug=${roundSlug}&tournament_id=${tournamentId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}