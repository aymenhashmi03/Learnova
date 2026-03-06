import { useEffect, useMemo, useState } from 'react'
import apiClient from '../services/apiClient'

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadOrders = async () => {
    try {
      const { data } = await apiClient.get('/admin/orders')
      setOrders(data)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      setError('Unable to load orders.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const totalRevenue = useMemo(
    () =>
      orders
        .filter((o) => o.paymentStatus === 'completed')
        .reduce((sum, o) => sum + (o.amount || 0), 0),
    [orders]
  )

  const updateStatus = async (order, status) => {
    try {
      const { data } = await apiClient.patch(`/admin/orders/${order._id}`, {
        paymentStatus: status,
      })
      setOrders((prev) => prev.map((o) => (o._id === order._id ? data : o)))
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      setError('Failed to update order.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">Manage orders</h1>
          <p className="text-xs text-slate-400">
            Review purchase history, update payment status, and monitor revenue.
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-2 text-xs">
          <p className="text-[11px] text-slate-400">Completed revenue</p>
          <p className="text-sm font-semibold text-emerald-400">
            ${totalRevenue.toFixed(2)}
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading orders…</p>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-slate-400">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
          <table className="min-w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t border-slate-800">
                  <td className="px-4 py-3 text-[11px] text-slate-300">
                    <p className="font-medium text-slate-100">
                      {order.user?.name || 'User'}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {order.user?.email || '—'}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-slate-300">
                    {order.course?.title || 'Course'}
                  </td>
                  <td className="px-4 py-3 text-[11px] text-emerald-400">
                    ${order.amount?.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-[11px]">
                    <span
                      className={`rounded-full px-3 py-1 text-[10px] font-medium ${
                        order.paymentStatus === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-300'
                          : order.paymentStatus === 'refunded'
                          ? 'bg-amber-500/10 text-amber-300'
                          : order.paymentStatus === 'failed'
                          ? 'bg-red-500/10 text-red-300'
                          : 'bg-slate-800 text-slate-200'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[11px] text-slate-400">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-[11px]">
                    <div className="flex flex-wrap gap-2">
                      {order.paymentStatus !== 'refunded' && (
                        <button
                          type="button"
                          onClick={() => updateStatus(order, 'refunded')}
                          className="rounded-full border border-amber-400 px-3 py-1 text-[11px] text-amber-200 hover:bg-amber-500/10"
                        >
                          Mark refunded
                        </button>
                      )}
                      {order.paymentStatus !== 'completed' && (
                        <button
                          type="button"
                          onClick={() => updateStatus(order, 'completed')}
                          className="rounded-full border border-emerald-400 px-3 py-1 text-[11px] text-emerald-200 hover:bg-emerald-500/10"
                        >
                          Mark completed
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminOrdersPage

