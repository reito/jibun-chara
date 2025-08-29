import React, { createContext, useContext, useState, useEffect } from 'react'
import { validateSession } from '../api/auth'

interface User {
  id: number
  email: string
  name: string
  tenant_slug: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (userData: User, authToken: string) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // セッションをクリアするヘルパー関数
  const clearSession = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('authToken')
  }

  // セッション検証を行う関数
  const checkSession = async () => {
    const savedToken = localStorage.getItem('authToken')
    if (savedToken) {
      try {
        const response = await validateSession(savedToken)
        if (response.status === 'success') {
          setUser(response.data.user)
          setToken(savedToken)
          return true
        } else {
          clearSession()
          return false
        }
      } catch (error) {
        clearSession()
        console.error('Session validation failed:', error)
        return false
      }
    }
    return false
  }

  useEffect(() => {
    const initializeAuth = async () => {
      await checkSession()
      setIsLoading(false)
    }

    initializeAuth()
  }, [])

  // 定期的なセッション検証（5分間隔）
  useEffect(() => {
    if (token) {
      const interval = setInterval(
        () => {
          checkSession().then((isValid) => {
            if (!isValid) {
              // Session expired, user logged out
            }
          })
        },
        5 * 60 * 1000,
      ) // 5分間隔

      return () => clearInterval(interval)
    }
  }, [token])

  const login = (userData: User, authToken: string) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem('authToken', authToken)
  }

  const logout = () => {
    clearSession()
  }

  const value = {
    user,
    token,
    login,
    logout,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
