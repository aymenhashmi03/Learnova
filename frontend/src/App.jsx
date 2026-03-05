import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import CoursesPage from './pages/CoursesPage'
import CourseDetailsPage from './pages/CourseDetailsPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import StudentDashboardPage from './pages/StudentDashboardPage'
import LearningPage from './pages/LearningPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminCoursesPage from './pages/AdminCoursesPage'
import AdminCourseCurriculumPage from './pages/AdminCourseCurriculumPage'
import AdminUsersPage from './pages/AdminUsersPage'
import AdminOrdersPage from './pages/AdminOrdersPage'
import GoogleCallbackPage from './pages/GoogleCallbackPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="courses/:id" element={<CourseDetailsPage />} />

            {/* Student-only area */}
            <Route element={<ProtectedRoute roles={['student']} />}>
              <Route path="dashboard" element={<StudentDashboardPage />} />
              <Route path="learn/:courseId" element={<LearningPage />} />
            </Route>

            {/* Admin-only area */}
            <Route element={<ProtectedRoute roles={['admin']} />}>
              <Route path="admin" element={<AdminDashboardPage />} />
              <Route path="admin/courses" element={<AdminCoursesPage />} />
              <Route
                path="admin/courses/:id/curriculum"
                element={<AdminCourseCurriculumPage />}
              />
              <Route path="admin/users" element={<AdminUsersPage />} />
              <Route path="admin/orders" element={<AdminOrdersPage />} />
            </Route>
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App