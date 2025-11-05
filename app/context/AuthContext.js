'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/auth'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        const userData = await authService.getCurrentUser()
        setUser(userData)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      setUser(response.user)
      localStorage.setItem('token', response.token)
      return { success: true }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const signup = async (fullName, email, password) => {
    try {
      const response = await authService.signup(fullName, email, password)
      setUser(response.user)
      localStorage.setItem('token', response.token)
      return { success: true }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const loginWithGoogle = async () => {
    try {
      const response = await authService.getGoogleAuthUrl()
      window.location.href = response.authUrl
      return { success: true }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const handleGoogleCallback = async (token, userData) => {
    try {
      setUser(userData)
      localStorage.setItem('token', token)
      return { success: true }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
  }

  const value = {
    user,
    loading,
    login,
    signup,
    loginWithGoogle,
    handleGoogleCallback,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}