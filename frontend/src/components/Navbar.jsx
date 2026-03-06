import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/learnova-logo.png'

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setMobileNavOpen(false)
    }
  }

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition hover:text-gray-900 ${
      isActive ? 'text-gray-900' : 'text-gray-700'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white text-gray-900">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2">
          <img src={logo} alt="Learnova" className="h-10 w-auto object-contain sm:h-12 md:h-14" />
        </Link>

        <form
          onSubmit={handleSearch}
          className="hidden flex-1 max-w-xl px-4 md:block"
        >
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Search for anything"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 transition focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </form>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          <NavLink to="/courses" className={navLinkClass}>
            Explore
          </NavLink>
          <NavLink to="/courses" className={navLinkClass}>
            Courses
          </NavLink>
          {isAuthenticated && user?.role === 'student' && (
            <NavLink to="/dashboard" className={navLinkClass}>
              My learning
            </NavLink>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <NavLink to="/admin" className={navLinkClass}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white p-2 text-gray-700 shadow-sm transition hover:bg-gray-50 md:hidden"
            aria-controls="mobile-nav"
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen((o) => !o)}
          >
            <span className="sr-only">Toggle navigation</span>
            {mobileNavOpen ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 transition hover:border-gray-300 hover:bg-gray-50"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-500 text-xs font-semibold text-white">
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:inline">{user?.name}</span>
                <svg className="h-4 w-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    aria-hidden="true"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-gray-700 bg-[#1c1d1f] py-1 shadow-lg">
                    <div className="border-b border-gray-700 px-3 py-2 text-xs text-gray-300 truncate">
                      {user?.email}
                    </div>
                    {user?.role === 'student' && (
                      <Link
                        to="/dashboard"
                        className="block px-3 py-2 text-sm text-white hover:bg-gray-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        My learning
                      </Link>
                    )}
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="block px-3 py-2 text-sm text-white hover:bg-gray-700"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        Admin dashboard
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setUserMenuOpen(false)
                        logout()
                      }}
                      className="block w-full px-3 py-2 text-left text-sm font-medium text-white hover:bg-gray-700"
                    >
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden text-sm font-medium text-gray-700 transition hover:text-gray-900 sm:block"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-full bg-[#a435f0] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#8710d8]"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="border-t border-gray-100 md:hidden">
        <div className="px-4 py-2">
          <form onSubmit={handleSearch} className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Search for anything"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-gray-300 bg-gray-50 py-2 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </form>
        </div>

        {mobileNavOpen && (
          <nav id="mobile-nav" className="px-4 pb-4">
            <div className="flex flex-col gap-1 rounded-2xl border border-gray-200 bg-white p-2 text-sm">
              <NavLink
                to="/courses"
                className={({ isActive }) =>
                  `rounded-xl px-3 py-2 font-medium transition ${
                    isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
                onClick={() => setMobileNavOpen(false)}
              >
                Explore
              </NavLink>
              {isAuthenticated && user?.role === 'student' && (
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `rounded-xl px-3 py-2 font-medium transition ${
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                  onClick={() => setMobileNavOpen(false)}
                >
                  My learning
                </NavLink>
              )}
              {isAuthenticated && user?.role === 'admin' && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `rounded-xl px-3 py-2 font-medium transition ${
                      isActive
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`
                  }
                  onClick={() => setMobileNavOpen(false)}
                >
                  Admin
                </NavLink>
              )}

              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="rounded-xl px-3 py-2 font-medium text-gray-700 transition hover:bg-gray-50"
                  onClick={() => setMobileNavOpen(false)}
                >
                  Log in
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}

export default Navbar
