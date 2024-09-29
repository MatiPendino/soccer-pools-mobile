import api from "./api";
import axios from "axios";

export const register = async(email, password, re_password) => {
    try {
        const response = await api.post('/auth/users/', {
            email, 
            password, 
            re_password
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const login = async(email, password) => {
    try {
        const response = await api.post('/auth/jwt/create/', {
            username: email, 
            password: password
        })
        const {access, refresh} = response.data
        return {access, refresh}
    } catch (error) {
        console.log(error.message)
        //throw error.response.data
        throw error.message
    }
}

export const refreshToken = async(refresh) => {
    try {
        const response = await api.post('/auth/jwt/refresh/', {
            refresh
        })
        return response.data.access
    } catch (error) {
        throw error.response.data
    }
}

export const getUser = async (token) => {
    try {
        const response = await api.get('/auth/users/me/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}