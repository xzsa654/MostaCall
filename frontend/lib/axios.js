import axios from 'axios'

const API_SEVER = 'http://localhost:3001/api/'
export const PUBLIC = 'http://localhost:3001/uploads'
export const axiosInstance = axios.create({
  baseURL: API_SEVER,
  withCredentials: true,
})
