import api from './api';

export const prizesList = async () => {
    try {
        const response = await api.get('/api/prizes/prize/')
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const prizeClaim = async (token: string, prizeId: number) => {
    try {
        const response = await api.post(`/api/prizes/prize/${prizeId}/claim/`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return response.data
    } catch (error) {
        throw error.response.data
    }
}