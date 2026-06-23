import axios from 'axios'
import { env } from './env'

export const api = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 30_000,
})

api.interceptors.response.use(
  (r) => r,
  (error) => {
    return Promise.reject(error)
  },
)
