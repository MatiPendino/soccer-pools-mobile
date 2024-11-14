import api from "./api";

export const leagueList = async (token) => {
    try {
        const response = await api.get('/api/leagues/league/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data    
    } catch (error) {
        throw error.response.data
    }
}