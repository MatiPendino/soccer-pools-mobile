import api from "./api";

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