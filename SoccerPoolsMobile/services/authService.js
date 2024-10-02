import api from "./api";

export const register = async(name, last_name, username, email, password) => {
    try {
        const response = await api.post('/auth/users/', {
            username: username,
            email: email, 
            name: name,
            last_name: last_name,
            password: password, 
        })
        return response.data
    } catch (error) {
        throw error.response.data
    }
}

export const login = async(username, password) => {
    try {
        const response = await api.post('/auth/jwt/create/', {
            username: username, 
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