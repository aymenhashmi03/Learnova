import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import apiClient from '../services/apiClient'

const AdminCourseCurriculumPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [dragItem, setDragItem] = useState(null)

  const loadCourse = async () => {
    try {
      setLoading(true)
      const { data } = await apiClient.get(`/courses/${id}`)
      setCourse(data)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      setError('Unable to load course curriculum.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCourse()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleModuleDragStart = (moduleIndex) => {
    setDragItem({ type: 'module', moduleIndex })
  }

  const handleModuleDrop = (targetIndex) => {
    if (!dragItem || dragItem.type !== 'module' || !course?.modules) return

    const modules = [...course.modules]
    const [moved] = modules.splice(dragItem.moduleIndex, 1)
    modules.splice(targetIndex, 0, moved)

    setCourse((prev) => (prev ? { ...prev, modules } : prev))
    setDragItem(null)
  }

  const handleLessonDragStart = (moduleIndex, lessonIndex) => {
    setDragItem({ type: 'lesson', moduleIndex, lessonIndex })
  }

  const handleLessonDrop = (targetModuleIndex, targetLessonIndex) => {
    if (!dragItem || dragItem.type !== 'lesson' || !course?.modules) return

    const modules = course.modules.map((mod) => ({
      ...mod,
      lessons: Array.isArray(mod.lessons) ? [...mod.lessons] : [],
    }))

    const { moduleIndex: sourceModuleIndex, lessonIndex: sourceLessonIndex } = dragItem

    if (!modules[sourceModuleIndex] || !modules[targetModuleIndex]) {
      setDragItem(null)
      return
    }

    const [movedLesson] = modules[sourceModuleIndex].lessons.splice(sourceLessonIndex, 1)
    if (!movedLesson) {
      setDragItem(null)
      return
    }

    let insertIndex = targetLessonIndex
    if (
      sourceModuleIndex === targetModuleIndex &&
      sourceLessonIndex < targetLessonIndex
    ) {
      insertIndex = targetLessonIndex - 1
    }

    modules[targetModuleIndex].lessons.splice(insertIndex, 0, movedLesson)

    setCourse((prev) => (prev ? { ...prev, modules } : prev))
    setDragItem(null)
  }

  const handleLessonDropOnEmpty = (targetModuleIndex) => {
    if (!dragItem || dragItem.type !== 'lesson' || !course?.modules) return

    const modules = course.modules.map((mod) => ({
      ...mod,
      lessons: Array.isArray(mod.lessons) ? [...mod.lessons] : [],
    }))

    const { moduleIndex: sourceModuleIndex, lessonIndex: sourceLessonIndex } = dragItem

    if (!modules[sourceModuleIndex] || !modules[targetModuleIndex]) {
      setDragItem(null)
      return
    }

    const [movedLesson] = modules[sourceModuleIndex].lessons.splice(sourceLessonIndex, 1)
    if (!movedLesson) {
      setDragItem(null)
      return
    }

    modules[targetModuleIndex].lessons.push(movedLesson)

    setCourse((prev) => (prev ? { ...prev, modules } : prev))
    setDragItem(null)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
  }

  const handleSaveOrder = async () => {
    if (!course) return
    try {
      setSaving(true)
      setError(null)
      await apiClient.put(`/courses/${course._id}/structure`, {
        modules: course.modules || [],
      })
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
      setError('Failed to save new order.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-400">Loading curriculum…</p>
  }

  if (error) {
    return <p className="text-sm text-red-400">{error}</p>
  }

  if (!course) {
    return <p className="text-sm text-slate-400">Course not found.</p>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate('/admin/courses')}
            className="mb-2 text-[11px] text-slate-400 hover:text-slate-200"
          >
            ← Back to courses
          </button>
          <h1 className="text-lg font-semibold text-slate-50">Edit curriculum</h1>
          <p className="text-xs text-slate-400">
            Drag modules and lessons to reorder the course structure.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSaveOrder}
          disabled={saving}
          className="w-full rounded-full bg-blue-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-sm transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300 sm:w-auto"
        >
          {saving ? 'Saving…' : 'Save order'}
        </button>
      </div>

      {course.modules && course.modules.length > 0 ? (
        <div className="space-y-3">
          {course.modules.map((mod, modIdx) => (
            <div
              key={mod.title || modIdx}
              className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4"
              draggable
              onDragStart={() => handleModuleDragStart(modIdx)}
              onDragOver={handleDragOver}
              onDrop={() => handleModuleDrop(modIdx)}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="cursor-move text-xs text-slate-500">⠿</span>
                  <h2 className="text-sm font-semibold text-slate-50">
                    Module {modIdx + 1}: {mod.title}
                  </h2>
                </div>
                <span className="text-[11px] text-slate-400">
                  {mod.lessons?.length || 0} lessons
                </span>
              </div>

              <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/60">
                {mod.lessons && mod.lessons.length > 0 ? (
                  <ul>
                    {mod.lessons.map((lesson, lessonIdx) => (
                      <li
                        key={lesson.title || lessonIdx}
                        className="flex cursor-move items-center justify-between gap-2 border-b border-slate-800 px-3 py-2 last:border-b-0"
                        draggable
                        onDragStart={() =>
                          handleLessonDragStart(modIdx, lessonIdx)
                        }
                        onDragOver={handleDragOver}
                        onDrop={() =>
                          handleLessonDrop(modIdx, lessonIdx)
                        }
                      >
                        <span className="text-[11px] text-slate-100">
                          {lessonIdx + 1}. {lesson.title}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <button
                    type="button"
                    className="flex w-full items-center justify-center px-3 py-6 text-[11px] text-slate-500"
                    onDragOver={handleDragOver}
                    onDrop={() => handleLessonDropOnEmpty(modIdx)}
                  >
                    Drag a lesson here to move it into this module.
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400">
          This course has no modules yet. Add modules before reordering.
        </p>
      )}
    </div>
  )
}

export default AdminCourseCurriculumPage

