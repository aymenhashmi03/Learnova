import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import apiClient from '../services/apiClient'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('learnova_token')
    const storedUser = localStorage.getItem('learnova_user')

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const applyAuthPayload = (data) => {
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
  }

  const login = async (credentials) => {
    const { data } = await apiClient.post('/auth/login', credentials)
    applyAuthPayload(data)
  }

  const signup = async (payload) => {
    const { data } = await apiClient.post('/auth/register', payload)
    applyAuthPayload(data)
    return data
  }

  const socialLogin = (data) => {
    applyAuthPayload(data)
  }

  const updateUser = (partial) => {
    setUser((prev) => {
      if (!prev) return prev
      const nextUser = { ...prev, ...partial }
      localStorage.setItem('learnova_user', JSON.stringify(nextUser))
      return nextUser
    })
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('learnova_token')
    localStorage.removeItem('learnova_user')
  }

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
    [user, token, loading]
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

