/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import apiClient from '../services/apiClient'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('learnova_token'))
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('learnova_user')
    if (!storedUser) return null
    try {
      return JSON.parse(storedUser)
    } catch {
      return null
    }
  })
  const [loading] = useState(false)

  const applyAuthPayload = useCallback((data) => {
    if (!data?.token) return

    setToken(data.token)
    const nextUser = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
    }
    setUser(nextUser)

    localStorage.setItem('learnova_token', data.token)
    localStorage.setItem('learnova_user', JSON.stringify(nextUser))
  }, [])

  const login = useCallback(async (credentials) => {
    const { data } = await apiClient.post('/auth/login', credentials)
    applyAuthPayload(data)
  }, [applyAuthPayload])

  const signup = useCallback(async (payload) => {
    const { data } = await apiClient.post('/auth/register', payload)
    applyAuthPayload(data)
    return data
  }, [applyAuthPayload])

  const socialLogin = useCallback((data) => {
    applyAuthPayload(data)
  }, [applyAuthPayload])

  const updateUser = useCallback((partial) => {
    setUser((prev) => {
      if (!prev) return prev
      const nextUser = { ...prev, ...partial }
      localStorage.setItem('learnova_user', JSON.stringify(nextUser))
      return nextUser
    })
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('learnova_token')
    localStorage.removeItem('learnova_user')
  }, [])

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!user && !!token,
      login,
      signup,
      socialLogin,
      logout,
      updateUser,
    }),
    [user, token, loading, login, signup, socialLogin, logout, updateUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return ctx
}

