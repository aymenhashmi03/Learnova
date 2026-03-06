import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../services/apiClient'
import { useAuth } from '../context/AuthContext'

const TABS = ['my-courses', 'continue', 'history', 'profile']

const StudentDashboardPage = () => {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('my-courses')
  const [myCourses, setMyCourses] = useState([])
  const [orders, setOrders] = useState([])
  const [profileName, setProfileName] = useState(user?.name || '')
  const [profileEmail, setProfileEmail] = useState(user?.email || '')
  const [savingProfile, setSavingProfile] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, ordersRes] = await Promise.all([
          apiClient.get('/students/me/courses'),
          apiClient.get('/students/me/orders'),
        ])

        setMyCourses(coursesRes.data?.data || [])
        setOrders(ordersRes.data?.data || [])
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to load dashboard data', error)
      } finally {
        setLoadingData(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    setProfileName(user?.name || '')
    setProfileEmail(user?.email || '')
  }, [user])

  const continueLearningCourses = useMemo(
    () => myCourses.slice(0, 3),
    [myCourses]
  )

  const handleProfileSave = async (e) => {
    e.preventDefault()
    if (!profileName.trim()) return

    try {
      setSavingProfile(true)
      const payload = {
        name: profileName.trim(),
        email: profileEmail.trim(),
      }

      const { data } = await apiClient.patch('/students/me', payload)

      // Update auth context + local storage
      if (data?.name || data?.email) {
        updateUser({
          name: data.name,
          email: data.email,
        })
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to update profile', error)
    } finally {
      setSavingProfile(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950/95 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:grid md:grid-cols-[260px,1fr]">
        <aside className="space-y-5 rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">
              Student
            </p>
            <h1 className="mt-1 text-2xl font-bold text-slate-50">Dashboard</h1>
            <p className="mt-2 text-xs text-slate-400 sm:text-sm">
              Track your learning progress, orders, and profile.
            </p>
          </div>

          <nav className="flex gap-2 overflow-x-auto pb-1 text-base md:block md:space-y-2 md:pb-0">
            <button
              type="button"
              onClick={() => setActiveTab('my-courses')}
              className={`flex shrink-0 items-center justify-between whitespace-nowrap rounded-2xl px-4 py-3 text-left text-sm font-medium transition md:w-full ${
                activeTab === 'my-courses'
                  ? 'bg-blue-500 text-slate-950 shadow-lg shadow-blue-500/30'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>My courses</span>
              <span className="text-[11px] opacity-80">{myCourses.length}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('continue')}
              className={`flex shrink-0 items-center justify-between whitespace-nowrap rounded-2xl px-4 py-3 text-left text-sm font-medium transition md:w-full ${
                activeTab === 'continue'
                  ? 'bg-blue-500 text-slate-950 shadow-lg shadow-blue-500/30'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>Continue learning</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`flex shrink-0 items-center justify-between whitespace-nowrap rounded-2xl px-4 py-3 text-left text-sm font-medium transition md:w-full ${
                activeTab === 'history'
                  ? 'bg-blue-500 text-slate-950 shadow-lg shadow-blue-500/30'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>Purchase history</span>
              <span className="text-[11px] opacity-80">{orders.length}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`flex shrink-0 items-center justify-between whitespace-nowrap rounded-2xl px-4 py-3 text-left text-sm font-medium transition md:w-full ${
                activeTab === 'profile'
                  ? 'bg-blue-500 text-slate-950 shadow-lg shadow-blue-500/30'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>Profile settings</span>
            </button>
          </nav>
        </aside>

        <section className="flex flex-1 flex-col overflow-visible rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-7 md:h-[580px] md:overflow-hidden lg:h-[620px] lg:p-8">
          {loadingData ? (
            <p className="text-sm text-slate-400">Loading your dashboard…</p>
          ) : (
            <div className="flex-1 space-y-5 md:overflow-y-auto md:pr-1">
              {activeTab === 'my-courses' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-slate-100">My courses</h2>
                  {myCourses.length === 0 ? (
                    <p className="text-base text-slate-400">
                      You&apos;re not enrolled in any courses yet. Browse the catalog and start
                      learning.
                    </p>
                  ) : (
                    <div className="grid auto-rows-[260px] gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {myCourses.map((course) => (
                        <div
                          key={course._id}
                          className="flex h-full flex-col rounded-2xl border border-slate-800 bg-slate-900/90 p-5 text-sm"
                        >
                          <p className="text-xs font-medium uppercase tracking-wide text-blue-300">
                            {course.category}
                          </p>
                          <h3 className="mt-2 line-clamp-2 text-base font-semibold text-slate-50">
                            {course.title}
                          </h3>
                          <p className="mt-2 line-clamp-3 text-xs text-slate-400">
                            {course.description}
                          </p>
                          <div className="mt-auto flex items-center justify-between pt-4 text-xs">
                            <span className="rounded-full bg-slate-800 px-3 py-1 text-[11px] font-medium text-slate-200">
                              {course.level || 'Beginner'}
                            </span>
                            <span className="text-sm font-semibold text-emerald-400">
                              {course.price > 0 ? `$${course.price}` : 'Free'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'continue' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-slate-100">Continue learning</h2>
                  {continueLearningCourses.length === 0 ? (
                    <p className="text-base text-slate-400">
                      Once you enroll and start learning, we&apos;ll show quick links to continue
                      your most recent courses here.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {continueLearningCourses.map((course) => (
                        <div
                          key={course._id}
                          className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-blue-300">
                              {course.category}
                            </p>
                            <p className="line-clamp-1 text-base font-semibold text-slate-50">
                              {course.title}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => navigate(`/learn/${course._id}`)}
                            className="rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-md transition hover:bg-blue-400 sm:text-sm"
                          >
                            Resume
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-slate-100">Purchase history</h2>
                  {orders.length === 0 ? (
                    <p className="text-base text-slate-400">
                      You haven&apos;t purchased any courses yet.
                    </p>
                  ) : (
                    <div className="space-y-3 text-sm">
                      {orders.map((order) => (
                        <div
                          key={order._id}
                          className="flex flex-col gap-2 rounded-2xl border border-slate-800 bg-slate-900/90 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-200 line-clamp-2">
                              {order.course?.title || 'Course'}
                            </p>
                            <p className="text-xs text-slate-400">
                              {new Date(order.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="text-left text-xs sm:text-right sm:text-sm">
                            <p className="font-semibold text-emerald-400">
                              ${order.amount?.toFixed(2)}
                            </p>
                            <p className="capitalize text-slate-400">
                              {order.paymentStatus || 'completed'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-slate-100">Profile settings</h2>
                  <p className="text-sm text-slate-400">
                    Update your basic account information. Authentication is handled securely
                    via JWT.
                  </p>
                  <form onSubmit={handleProfileSave} className="space-y-5 text-sm">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-200" htmlFor="name">
                          Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-base text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                          placeholder="Your name"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-200" htmlFor="email">
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-2.5 text-base text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
                          placeholder="you@example.com"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="inline-flex items-center rounded-full bg-blue-500 px-6 py-2.5 text-sm font-semibold text-slate-950 shadow-md transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
                    >
                      {savingProfile ? 'Saving…' : 'Save changes'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default StudentDashboardPage

