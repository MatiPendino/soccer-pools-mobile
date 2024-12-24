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
        return response.status
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

export const updateUser = async (token, firstName, lastName) => {
    try {
        const response = await api.patch('/api/users/me/', {
            name: firstName,
            last_name: lastName,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const deleteUser = async (token) => {
    try {
        await api.delete('/api/user/user_destroy/', {
            headers: {
                Authorization: `Bearer ${token}`
            },
        })
    } catch (error) {
        // When user is removed properly, an Axios Network Error is thrown
    }
}

export const logout = async (token) => {
    try {
        const response = await api.post('/api/auth/jwt/logout/', {
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