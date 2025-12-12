import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Pages
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import AuthPage from './pages/AuthPage'

import './App.css'
import PageBuilder from './pages/PageBuilder'
import CareerPage from './pages/CareerPage'
import JobCreateSection from './components/JobCreateSection'
import JobDetailPage from './pages/JobDetailPage'

function App() {
  return (
    // 1. Wrap the entire app in AuthProvider so 'useAuth' works everywhere
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/:slug/careers" element={<CareerPage />} />
          <Route path="/:slug/jobs/:jobId" element={<JobDetailPage/>} />

          {/* Protected Routes (Require Login) */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/page-builder" 
            element={
              <ProtectedRoute>
                <PageBuilder />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/page-builder/:slug" 
            element={
              <ProtectedRoute>
                <PageBuilder />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/:slug/manage-jobs" 
            element={
              <ProtectedRoute>
                <JobCreateSection />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App