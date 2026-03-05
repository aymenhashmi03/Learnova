import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const SignupPage = () => {
  const { signup } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signup(form)
      navigate('/')
    } catch {
      setError('Could not create your account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#52c4ff] px-4 py-10">
      <div className="pointer-events-none absolute -left-10 top-10 h-32 w-32 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -right-16 bottom-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute left-1/2 top-4 h-6 w-40 -translate-x-1/2 rounded-full bg-white/20 blur-sm" />

      <div className="relative z-10 w-full max-w-2xl">
        <div className="mb-6 text-center text-white">
          <h1 className="text-2xl font-extrabold tracking-wide md:text-3xl">
            WELCOME TO THE WEBSITE
          </h1>
        </div>

        <div className="mx-auto flex max-w-xl flex-col items-stretch rounded-[32px] bg-[#00489b] px-6 py-8 shadow-2xl md:px-10 md:py-10">
          <h2 className="text-center text-lg font-semibold tracking-[0.2em] text-white md:text-xl">
            USER SIGN UP
          </h2>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/90"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[11px]">
                  #
                </span>
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-sm border-none bg-white px-3 py-2 text-sm text-gray-900 shadow-inner placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb400]"
                placeholder="Jane Doe"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/90"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[11px]">
                  @
                </span>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-sm border-none bg-white px-3 py-2 text-sm text-gray-900 shadow-inner placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb400]"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-white/90"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[11px]">
                  *
                </span>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-sm border-none bg-white px-3 py-2 text-sm text-gray-900 shadow-inner placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ffb400]"
                placeholder="Choose a password"
              />
            </div>

            {error && <p className="text-sm text-red-200">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#ffb400] px-6 py-2.5 text-sm font-extrabold uppercase tracking-wide text-[#1e3a8a] shadow-md transition hover:bg-[#ffc94d] disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {loading ? 'Creating account…' : 'Sign up'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-white/80 md:text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-white underline-offset-2 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage

