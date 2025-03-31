import axios from 'axios'

const API_SEVER =
  import.meta.env.MODE === 'development' ? 'http://localhost:3001/api/' : '/api'
export const PUBLIC =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:3001/uploads'
    : '/uploads'
export const axiosInstance = axios.create({
  baseURL: API_SEVER,
  withCredentials: true,
})
