import axios from "axios";

const API_URL = 'http://192.168.20.51:8000'

const api = axios.create({
    baseURL: API_URL
})

export default api