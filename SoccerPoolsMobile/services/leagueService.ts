import api from "./api";

export const leagueList = async (token, continent) => {
    try {
        const response = await api.get(`/api/leagues/league/?continent=${continent}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data    
    } catch (error) {
        throw error.response.data
    }
}

export const userLeague = async (token) => {
    try {
        const response = await api.get('/api/user/user_league/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const roundsListByLeague = async (token, leagueId, notGeneralRound=undefined) => {
    try {
        const response = await api.get(
        `/api/leagues/rounds/league/${leagueId}/?not_general_round=${notGeneralRound}`, {

            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}