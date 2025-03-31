import axios from 'axios'

const API_SEVER =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3001/api/' : '/api'
export const PUBLIC =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3001/uploads'
    : '/uploads'
export const axiosInstance = axios.create({
  baseURL: API_SEVER,
  withCredentials: true,
})
