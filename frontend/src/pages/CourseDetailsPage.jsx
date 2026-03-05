import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import apiClient from '../services/apiClient'
import { useAuth } from '../context/AuthContext'

const CourseDetailsPage = () => {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await apiClient.get(`/courses/${id}`)
        setCourse(data)
      } catch (err) {
        setError('Unable to load course details.')
        // eslint-disable-next-line no-console
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [id])

  if (loading) {
    return <p className="text-sm text-gray-500">Loading course…</p>
  }

  if (error || !course) {
    return <p className="text-sm text-gray-600">{error || 'Course not found.'}</p>
  }

  return (
    <div className="grid gap-8 md:grid-cols-[1.6fr,1fr]">
      <div className="space-y-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
            {course.category}
          </p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">{course.title}</h1>
          <p className="mt-2 text-base text-gray-600">{course.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {course.level && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                {course.level}
              </span>
            )}
            {course.duration && (
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                {course.duration}
              </span>
            )}
          </div>
        </div>

        {course.modules && course.modules.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900">Curriculum</h2>
            <div className="space-y-3">
              {course.modules.map((mod, index) => (
                <div
                  key={mod.title || index}
                  className="card-hover rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold text-gray-900">
                      Module {index + 1}: {mod.title}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {mod.lessons?.length || 0} lessons
                    </span>
                  </div>
                  {mod.lessons && mod.lessons.length > 0 && (
                    <ul className="mt-3 space-y-1.5 text-sm text-gray-600">
                      {mod.lessons.map((lesson, idx) => (
                        <li
                          key={lesson.title || idx}
                          className="rounded-lg bg-gray-50 px-3 py-2"
                        >
                          <span className="line-clamp-1">
                            {idx + 1}. {lesson.title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <aside className="space-y-4">
        <div className="card-hover overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="h-36 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-gray-100" />
          <div className="space-y-4 p-5">
            <p className="text-2xl font-bold text-gray-900">
              {course.price > 0 ? `$${course.price}` : 'Free'}
            </p>
            <button
              type="button"
              disabled={!isAuthenticated}
              className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
            >
              {isAuthenticated ? 'Enroll now' : 'Login to enroll'}
            </button>
            <p className="text-xs text-gray-500">
              Secure payments powered by Stripe. Instant access after enrollment.
            </p>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default CourseDetailsPage

