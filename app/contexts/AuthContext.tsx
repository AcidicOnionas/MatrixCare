'use client'

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { authAPI, tokenStorage, User, LoginCredentials, RegisterData } from '../lib/auth'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const isAuthenticated = !!user

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      const token = tokenStorage.getToken()
      const savedUser = tokenStorage.getUser()

      if (token && savedUser) {
        // Validate token with backend
        const validation = await authAPI.validateToken(token)
        if (validation.success && validation.valid) {
          setUser(savedUser)
        } else {
          // Token is invalid, clear storage
          tokenStorage.clear()
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error)
      tokenStorage.clear()
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true)
      const response = await authAPI.login(credentials)
      
      if (response.success && response.data) {
        const { token, user: userData } = response.data
        
        // Store token and user data
        tokenStorage.setToken(token)
        tokenStorage.setUser(userData)
        setUser(userData)
        
        // Redirect to dashboard
        router.push('/dashboard')
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true)
      const response = await authAPI.register(userData)
      
      if (response.success && response.data) {
        const { token, user: newUser } = response.data
        
        // Store token and user data
        tokenStorage.setToken(token)
        tokenStorage.setUser(newUser)
        setUser(newUser)
        
        // Redirect to dashboard
        router.push('/dashboard')
      } else {
        throw new Error(response.message || 'Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    tokenStorage.clear()
    setUser(null)
    router.push('/login')
  }

  const refreshUser = async () => {
    try {
      const token = tokenStorage.getToken()
      if (!token) return

      const response = await authAPI.getCurrentUser(token)
      if (response.success && response.user) {
        tokenStorage.setUser(response.user)
        setUser(response.user)
      }
    } catch (error) {
      console.error('Refresh user error:', error)
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext 