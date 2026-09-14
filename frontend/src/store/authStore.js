import { create } from 'zustand'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
})

// Add token to request headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const useAuthStore = create((set) => (({
  user: null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  register: async (email, password, confirmPassword, fullName) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        confirmPassword,
        fullName,
      })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      })
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed'
      set({ error: errorMessage, isLoading: false })
      return { success: false, error: errorMessage }
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      })
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed'
      set({ error: errorMessage, isLoading: false })
      return { success: false, error: errorMessage }
    }
  },

  logout: () => {
    localStorage.removeItem('token')
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    })
  },

  clearError: () => set({ error: null }),
})))
