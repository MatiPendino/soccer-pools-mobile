import AsyncStorage from "@react-native-async-storage/async-storage";
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
        if (error.response) {
            throw error.response.data
        }
        throw error
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

export const editPassword = async (token, oldPassword, newPassword) => {
    try {
        const response = await api.post('/api/users/set_password/', {
            current_password: oldPassword,
            new_password: newPassword,
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const googleOauth2SignIn = async (accessToken) => {
    try {
        const response = await api.post("/api/user/android_google_oauth2/", {
            accessToken: accessToken ,
        })

        const {access, refresh} = response.data;
        await AsyncStorage.setItem("accessToken", access)
        await AsyncStorage.setItem("refreshToken", refresh)

        return {access, refresh}
    } catch (error) {
        throw error.response.data
    }
}

export const resetPassword = async (email: string) => {
    try {
        const response = await api.post('/api/users/reset_password/', {
            email: email
        })

        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const getFullUser = async (token) => {
    try {
        const response = await api.get('/api/user/user/me/', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}