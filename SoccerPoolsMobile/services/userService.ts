import api from "./api"

export const updateCoins = async (token, coins, rewardType) => {
    try {
        const response = await api.post('/api/user/user/add_coins/', {
            coins: coins,
            reward_type: rewardType,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        console.log(error)
        throw error.response.data
    }
}