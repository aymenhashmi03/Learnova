import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../services/apiClient'

const AdminCoursesPage = () => {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', price: 0, level: '' })

  const loadCourses = async () => {
    try {
      const { data } = await apiClient.get('/courses/admin/all')
      setCourses(data)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      setError('Unable to load courses.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourses()
  }, [])

  const startEdit = (course) => {
    setEditingId(course._id)
    setEditForm({
      title: course.title,
      price: course.price,
      level: course.level || 'beginner',
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditForm((prev) => ({ ...prev, [name]: name === 'price' ? Number(value) : value }))
  }

  const saveEdit = async (id) => {
    try {
      const { data } = await apiClient.put(`/courses/${id}`, editForm)
      setCourses((prev) => prev.map((c) => (c._id === id ? data : c)))
      setEditingId(null)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      setError('Failed to update course.')
    }
  }

  const deleteCourse = async (id) => {
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm('Delete this course? This cannot be undone.')
    if (!confirmed) return

    try {
      await apiClient.delete(`/courses/${id}`)
      setCourses((prev) => prev.filter((c) => c._id !== id))
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      setError('Failed to delete course.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-50">Manage courses</h1>
          <p className="text-xs text-slate-400">
            Edit course metadata, pricing, and remove outdated content.
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-slate-400">Loading courses…</p>
      ) : error ? (
        <p className="text-sm text-red-400">{error}</p>
      ) : courses.length === 0 ? (
        <p className="text-sm text-slate-400">No courses created yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
          <table className="min-w-full text-left text-xs text-slate-200">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Enrolled</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => {
                const isEditing = editingId === course._id
                return (
                  <tr key={course._id} className="border-t border-slate-800">
                    <td className="max-w-xs px-4 py-3">
                      {isEditing ? (
                        <input
                          name="title"
                          value={editForm.title}
                          onChange={handleEditChange}
                          className="w-full rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 focus:border-blue-500 focus:outline-none"
                        />
                      ) : (
                        <p className="line-clamp-2 text-xs font-medium text-slate-100">
                          {course.title}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[11px] text-slate-300">
                      {course.category}
                    </td>
                    <td className="px-4 py-3 text-[11px] text-slate-300">
                      {isEditing ? (
                        <select
                          name="level"
                          value={editForm.level}
                          onChange={handleEditChange}
                          className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-100 focus:border-blue-500 focus:outline-none"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      ) : (
                        course.level || 'beginner'
                      )}
                    </td>
                    <td className="px-4 py-3 text-[11px] text-emerald-400">
                      {isEditing ? (
                        <input
                          name="price"
                          type="number"
                          min="0"
                          value={editForm.price}
                          onChange={handleEditChange}
                          className="w-20 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] text-slate-100 focus:border-blue-500 focus:outline-none"
                        />
                      ) : (
                        `$${course.price.toFixed(2)}`
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-[11px] text-slate-300">
                      {course.enrolledStudents?.length || 0}
                    </td>
                    <td className="px-4 py-3 text-[11px]">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => saveEdit(course._id)}
                            className="rounded-full bg-blue-500 px-3 py-1 text-[11px] font-semibold text-slate-950 hover:bg-blue-400"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="rounded-full border border-slate-700 px-3 py-1 text-[11px] text-slate-200 hover:border-slate-500 hover:bg-slate-900"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => startEdit(course)}
                            className="rounded-full border border-slate-700 px-3 py-1 text-[11px] text-slate-200 hover:border-blue-500 hover:text-blue-300"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/admin/courses/${course._id}/curriculum`)
                            }
                            className="rounded-full border border-slate-700 px-3 py-1 text-[11px] text-slate-200 hover:border-emerald-500 hover:text-emerald-300"
                          >
                            Curriculum
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteCourse(course._id)}
                            className="rounded-full bg-red-500/90 px-3 py-1 text-[11px] font-semibold text-slate-50 hover:bg-red-400"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default AdminCoursesPage

