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
        return response
    } catch (error) {
        throw error.response.data
    }
}


export const getBetLeadersCursor = async (
    token: string, roundSlug: Slug, tournamentId: number, nextUrl?: string
) => {
    const url = nextUrl ?? `/api/bets/bet_results/v2/${roundSlug}/${tournamentId}/`;
    const response = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` }
    });

    return response.data;
};