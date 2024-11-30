import api from "./api";

export const matchResultsList = async (token, roundId) => {
    try {
        const matchResults = await api.get(`api/matches/match_results/?round_id=${roundId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return matchResults.data
    } catch (error) {
        throw error.response.data
    }
}

export const matchResultsUpdate = async (token, matchResults) => {
    try {
        const response = await api.post(`api/matches/match_results_update/`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            matchResults: matchResults
        })

        return response.data
    } catch(error) {
        throw error.response.data
    }
}