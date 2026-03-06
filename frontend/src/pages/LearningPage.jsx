import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import apiClient from '../services/apiClient'

const LearningPage = () => {
  const { courseId } = useParams()

  const [course, setCourse] = useState(null)
  const [progress, setProgress] = useState(null)
  const [selectedModuleIndex, setSelectedModuleIndex] = useState(0)
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [completing, setCompleting] = useState(false)
  const [videoUrl, setVideoUrl] = useState('')
  const [videoLoading, setVideoLoading] = useState(false)
  const [videoError, setVideoError] = useState(null)
  const [resumeTime, setResumeTime] = useState(0)

  const videoRef = useRef(null)
  const saveProgressTimeoutRef = useRef(null)

  useEffect(() => {
    const fetchLearningData = async () => {
      try {
        const { data } = await apiClient.get(
          `/students/me/courses/${courseId}/learning`
        )
        setCourse(data.course)
        setProgress(data.progress)

        if (data.progress?.lastLessonKey) {
          const [mod, lesson] = data.progress.lastLessonKey
            .split('-')
            .map((v) => Number.parseInt(v, 10))
          if (!Number.isNaN(mod) && !Number.isNaN(lesson)) {
            setSelectedModuleIndex(mod)
            setSelectedLessonIndex(lesson)
          }
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err)
        setError(
          err?.response?.data?.message ||
            'Unable to load learning session for this course.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchLearningData()
  }, [courseId])

  const selectedLesson = useMemo(() => {
    if (
      !course ||
      !course.modules ||
      !course.modules[selectedModuleIndex] ||
      !course.modules[selectedModuleIndex].lessons ||
      !course.modules[selectedModuleIndex].lessons[selectedLessonIndex]
    ) {
      return null
    }
    return course.modules[selectedModuleIndex].lessons[selectedLessonIndex]
  }, [course, selectedModuleIndex, selectedLessonIndex])

  const isLessonCompleted = useMemo(() => {
    if (!progress) return false
    const key = `${selectedModuleIndex}-${selectedLessonIndex}`
    return progress.completedLessons?.includes(key)
  }, [progress, selectedModuleIndex, selectedLessonIndex])

  const handleLessonSelect = (moduleIdx, lessonIdx) => {
    setSelectedModuleIndex(moduleIdx)
    setSelectedLessonIndex(lessonIdx)
  }

  useEffect(() => {
    const fetchVideoUrl = async () => {
      if (!course) return
      if (!selectedLesson) {
        setVideoUrl('')
        return
      }

      setVideoLoading(true)
      setVideoError(null)
      try {
        const { data } = await apiClient.get(
          `/students/me/courses/${course._id}/lessons/${selectedModuleIndex}/${selectedLessonIndex}/video`
        )
        setVideoUrl(data.url)
        setResumeTime(data.resumeTime || 0)
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch video URL', err)
        setVideoUrl('')
        setVideoError(
          err?.response?.data?.message || 'Unable to load video for this lesson.'
        )
      } finally {
        setVideoLoading(false)
      }
    }

    fetchVideoUrl()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course?._id, selectedModuleIndex, selectedLessonIndex, selectedLesson])

  const handleMarkComplete = async () => {
    if (!course) return
    try {
      setCompleting(true)
      const { data } = await apiClient.post(
        `/students/me/courses/${course._id}/lessons/complete`,
        {
          moduleIndex: selectedModuleIndex,
          lessonIndex: selectedLessonIndex,
        }
      )
      setProgress(data)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to mark lesson complete', err)
    } finally {
      setCompleting(false)
    }
  }

  const saveProgress = async (time) => {
    if (!course) return
    try {
      await apiClient.post(
        `/students/me/courses/${course._id}/lessons/${selectedModuleIndex}/${selectedLessonIndex}/progress`,
        {
          currentTime: time,
        }
      )
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to save lesson progress', err)
    }
  }

  const handleTimeUpdate = (event) => {
    const current = event.target.currentTime || 0

    if (saveProgressTimeoutRef.current) {
      clearTimeout(saveProgressTimeoutRef.current)
    }

    saveProgressTimeoutRef.current = setTimeout(() => {
      saveProgress(current)
    }, 2000)
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current && resumeTime > 0) {
      try {
        videoRef.current.currentTime = resumeTime
      } catch {
        // ignore if setting currentTime fails
      }
    }
  }

  if (loading) {
    return <p className="text-sm text-slate-400">Loading your course…</p>
  }

  if (error || !course) {
    return <p className="text-sm text-slate-400">{error || 'Course not found.'}</p>
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
      {/* Modules + lessons sidebar */}
      <aside className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
        <div className="mb-4 space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-300">
            Learning path
          </p>
          <h1 className="text-sm font-semibold text-slate-50 line-clamp-2">
            {course.title}
          </h1>
          {progress && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Progress</span>
                <span className="font-semibold text-emerald-400">
                  {progress.progressPercent || 0}%
                </span>
              </div>
              <div className="mt-1 h-1.5 rounded-full bg-slate-800">
                <div
                  className="h-1.5 rounded-full bg-emerald-400"
                  style={{ width: `${progress.progressPercent || 0}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-3 text-xs">
          {course.modules?.map((mod, modIdx) => (
            <div key={mod.title || modIdx} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold text-slate-200">
                  Module {modIdx + 1}: {mod.title}
                </p>
                <span className="text-[10px] text-slate-500">
                  {mod.lessons?.length || 0} lessons
                </span>
              </div>
              <ul className="space-y-1">
                {mod.lessons?.map((lesson, lessonIdx) => {
                  const key = `${modIdx}-${lessonIdx}`
                  const completed = progress?.completedLessons?.includes(key)
                  const isActive =
                    selectedModuleIndex === modIdx &&
                    selectedLessonIndex === lessonIdx

                  return (
                    <li key={lesson.title || key}>
                      <button
                        type="button"
                        onClick={() => handleLessonSelect(modIdx, lessonIdx)}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[11px] transition ${
                          isActive
                            ? 'bg-blue-500 text-slate-950'
                            : 'bg-slate-950/40 text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        <span className="line-clamp-1">
                          {lessonIdx + 1}. {lesson.title}
                        </span>
                        {completed && (
                          <span className="ml-2 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                            Done
                          </span>
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      {/* Main content: video + resources */}
      <section className="space-y-4">
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-wide text-slate-400">
            Lesson
          </p>
          <h2 className="text-lg font-semibold text-slate-50">
            {selectedLesson?.title || 'Select a lesson to begin'}
          </h2>
        </div>

        <div className="aspect-video w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80">
          {videoLoading ? (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              Loading video…
            </div>
          ) : videoUrl ? (
            <video
              key={videoUrl}
              ref={videoRef}
              src={videoUrl}
              controls
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              className="h-full w-full bg-black"
            >
              <track kind="captions" />
            </video>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-1 text-center text-sm text-slate-400">
              <span>Video will appear here once added by the instructor.</span>
              {videoError && <span className="text-xs text-red-400">{videoError}</span>}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            type="button"
            disabled={isLessonCompleted || completing}
            onClick={handleMarkComplete}
            className="inline-flex items-center rounded-full bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-sm transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300"
          >
            {isLessonCompleted ? 'Lesson completed' : 'Mark lesson complete'}
          </button>
          <p className="text-[11px] text-slate-400">
            Your progress is synced to your Learnova account.
          </p>
        </div>

        {selectedLesson?.pdfUrl && (
          <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs">
            <p className="text-[11px] font-semibold text-slate-100">Resources</p>
            <a
              href={selectedLesson.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-1.5 text-[11px] font-medium text-slate-900 transition hover:bg-slate-200"
            >
              View lesson PDF
            </a>
          </div>
        )}
      </section>
    </div>
  )
}

export default LearningPage

