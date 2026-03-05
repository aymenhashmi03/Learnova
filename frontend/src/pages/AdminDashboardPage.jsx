import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import apiClient from '../services/apiClient'
import { useAuth } from '../context/AuthContext'

const AdminDashboardPage = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await apiClient.get('/admin/overview')
        setStats(data)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
        setError('Unable to load admin statistics.')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const salesSeries = useMemo(() => stats?.salesSeries || [], [stats])

  const maxRevenue = useMemo(
    () => Math.max(...salesSeries.map((pt) => pt.revenue || 0), 0),
    [salesSeries]
  )

  const maxOrders = useMemo(
    () => Math.max(...salesSeries.map((pt) => pt.orders || 0), 0),
    [salesSeries]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-300">
            Admin
          </p>
          <h1 className="text-2xl font-semibold text-slate-50">Analytics dashboard</h1>
          <p className="text-sm text-slate-400">
            High-level view of Learnova performance and revenue.
          </p>
        </div>
        <div className="text-xs text-slate-400">
          <p>
            Signed in as{' '}
            <span className="font-medium text-slate-100">{user?.email}</span>
          </p>
          <p className="text-[11px]">Role: Admin</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        <Link
          to="/admin"
          className="rounded-full bg-slate-900 px-3 py-1.5 text-slate-200 hover:bg-slate-800"
        >
          Overview
        </Link>
        <Link
          to="/admin/courses"
          className="rounded-full bg-slate-900 px-3 py-1.5 text-slate-200 hover:bg-slate-800"
        >
          Manage courses
        </Link>
        <Link
          to="/admin/users"
          className="rounded-full bg-slate-900 px-3 py-1.5 text-slate-200 hover:bg-slate-800"
        >
          Manage users
        </Link>
        <Link
          to="/admin/orders"
          className="rounded-full bg-slate-900 px-3 py-1.5 text-slate-200 hover:bg-slate-800"
        >
          Manage orders
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading metrics…</p>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs">
              <p className="text-[11px] font-medium text-slate-400">Total users</p>
              <p className="mt-2 text-2xl font-semibold text-slate-50">
                {stats?.totals?.users || 0}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs">
              <p className="text-[11px] font-medium text-slate-400">Total courses</p>
              <p className="mt-2 text-2xl font-semibold text-slate-50">
                {stats?.totals?.courses || 0}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs">
              <p className="text-[11px] font-medium text-slate-400">Total revenue</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-400">
                ${stats?.totals?.revenue?.toFixed(2) || '0.00'}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs">
              <p className="text-[11px] font-medium text-slate-400">Total orders</p>
              <p className="mt-2 text-2xl font-semibold text-slate-50">
                {stats?.totals?.orders || 0}
              </p>
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[2fr,1fr]">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-slate-200">
                  Revenue last {salesSeries.length || 0} days
                </p>
                <p className="text-[11px] text-slate-400">USD</p>
              </div>

              {salesSeries.length === 0 ? (
                <p className="mt-4 text-[11px] text-slate-400">
                  No completed orders yet. As learners purchase courses, revenue trends will
                  appear here.
                </p>
              ) : (
                <div className="mt-4 flex h-40 items-end gap-1">
                  {salesSeries.map((pt) => {
                    const height =
                      maxRevenue > 0 ? Math.max((pt.revenue / maxRevenue) * 100, 8) : 0
                    return (
                      <div
                        key={pt.date}
                        className="group flex-1"
                      >
                        <div
                          className="rounded-t-full bg-gradient-to-t from-blue-500 to-emerald-400 transition group-hover:opacity-90"
                          style={{ height: `${height}%` }}
                        />
                        <div className="mt-1 text-center text-[9px] text-slate-500">
                          {pt.date.slice(5)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs">
              <p className="text-[11px] font-semibold text-slate-200">Daily orders</p>

              {salesSeries.length === 0 ? (
                <p className="mt-4 text-[11px] text-slate-400">
                  Orders per day will show once purchases start coming in.
                </p>
              ) : (
                <div className="mt-3 space-y-1.5">
                  {salesSeries.map((pt) => {
                    const barWidth =
                      maxOrders > 0 ? Math.max((pt.orders / maxOrders) * 100, 10) : 0
                    return (
                      <div
                        key={pt.date}
                        className="flex items-center justify-between gap-2"
                      >
                        <span className="text-[10px] text-slate-400">
                          {pt.date.slice(5)}
                        </span>
                        <div className="flex flex-1 items-center gap-2">
                          <div className="h-1.5 rounded-full bg-slate-800">
                            <div
                              className="h-1.5 rounded-full bg-blue-500"
                              style={{ width: `${barWidth}%` }}
                            />
                          </div>
                          <span className="w-6 text-right text-[10px] text-slate-300">
                            {pt.orders}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  )
}

export default AdminDashboardPage

