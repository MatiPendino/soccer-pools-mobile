import api from "./api";
import {storeToken} from "../utils/storeToken"

export const register = async(name, last_name, username, email, password) => {
    try {
        const response = await api.post('/api/users/', {
            username: username,
            email: email, 
            name: name,
            last_name: last_name,
            password: password, 
        })
        await storeToken(response.data);
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const login = async(username, password) => {
    try {
        const response = await api.post('/api/jwt/create/', {
            username: username, 
            password: password
        })
        const {access, refresh} = response.data
        await storeToken(response.data);
        return {access, refresh}
    } catch (error) {
        console.log(error.message)
        throw error.message
    }
}

export const getUser = async (token) => {
    try {
        const response = await api.get('/api/users/me/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const getUserInLeague = async (token) => {
    try {
        const response = await api.get('/api/user/user_in_league/', {
            headers: {
                Authorization: `Bearer ${token}`
            } 
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}