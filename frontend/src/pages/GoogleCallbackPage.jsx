import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const GoogleCallbackPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { socialLogin } = useAuth()
  const [error, setError] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const token = params.get('token')
    const userId = params.get('userId')
    const name = params.get('name')
    const email = params.get('email')
    const role = params.get('role')
    const isVerified = params.get('isVerified') === 'true'
    const isBlocked = params.get('isBlocked') === 'true'

    if (!token || !email) {
      setError('Google authentication failed. Please try again.')
      return
    }

    socialLogin({
      token,
      _id: userId || undefined,
      name,
      email,
      role,
      isVerified,
      isBlocked,
    })

    const target = role === 'admin' ? '/admin' : '/dashboard'
    navigate(target, { replace: true })
  }, [location.search, navigate, socialLogin])

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-6 text-center shadow-xl">
        <p className="text-sm font-medium text-slate-100">Signing you in with Google…</p>
        {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
      </div>
    </div>
  )
}

export default GoogleCallbackPage

