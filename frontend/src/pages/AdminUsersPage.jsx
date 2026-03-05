import { useEffect, useState } from 'react'
import apiClient from '../services/apiClient'

const AdminUsersPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadUsers = async () => {
    try {
      const { data } = await apiClient.get('/admin/users')
      setUsers(data)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      setError('Unable to load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const toggleBlock = async (user) => {
    try {
      const { data } = await apiClient.patch(`/admin/users/${user._id}`, {
        isBlocked: !user.isBlocked,
      })
      setUsers((prev) => prev.map((u) => (u._id === user._id ? data : u)))
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      setError('Failed to update user.')
    }
  }

  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'student' : 'admin'
    try {
      const { data } = await apiClient.patch(`/admin/users/${user._id}`, {
        role: newRole,
      })
      setUsers((prev) => prev.map((u) => (u._id === user._id ? data : u)))
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      setError('Failed to update user role.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">Manage users</h1>
          <p className="text-xs text-slate-400">
            Review learner accounts, block abusive users, and adjust roles.
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading users…</p>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : users.length === 0 ? (
        <p className="text-sm text-slate-400">No users yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
          <table className="min-w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-slate-800">
                  <td className="px-4 py-3 text-xs font-medium text-slate-100">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-[11px] text-slate-300">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 text-[11px]">
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-medium text-slate-200">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[11px]">
                    {user.isBlocked ? (
                      <span className="rounded-full bg-red-500/10 px-3 py-1 text-[10px] font-medium text-red-300">
                        Blocked
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-medium text-emerald-300">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[11px] text-slate-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-[11px]">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => toggleBlock(user)}
                        className="rounded-full border border-slate-700 px-3 py-1 text-[11px] text-slate-200 hover:border-red-400 hover:text-red-300"
                      >
                        {user.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleRole(user)}
                        className="rounded-full border border-slate-700 px-3 py-1 text-[11px] text-slate-200 hover:border-blue-400 hover:text-blue-300"
                      >
                        {user.role === 'admin' ? 'Make student' : 'Make admin'}
                      </button>
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

export default AdminUsersPage

