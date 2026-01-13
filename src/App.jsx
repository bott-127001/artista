import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import StaffPage from './pages/StaffPage'
import AcademicsPage from './pages/AcademicsPage'
import ProgramDetailPage from './pages/ProgramDetailPage'
import BookingPage from './pages/BookingPage'
import OwnerDetailPage from './pages/OwnerDetailPage'
import ScrollToTop from './components/ScrollToTop'
import MovingTextStrip from './components/MovingTextStrip'
import AdminLayout from './components/admin/AdminLayout'
import ProtectedRoute from './components/admin/ProtectedRoute'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Bookings from './pages/admin/Bookings'
import Services from './pages/admin/Services'
import Staff from './pages/admin/Staff'
import Coupons from './pages/admin/Coupons'
import Analytics from './pages/admin/Analytics'
import Settings from './pages/admin/Settings'
import { Toaster } from 'react-hot-toast'

function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      <Toaster position="top-right" />
      <ScrollToTop />
      {!isAdminPage && <MovingTextStrip />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/academics" element={<AcademicsPage />} />
        <Route path="/academics/:programId" element={<ProgramDetailPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/owners/:ownerId" element={<OwnerDetailPage />} />
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Navigate to="/admin/dashboard" replace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="bookings" element={<Bookings />} />
                  <Route path="services" element={<Services />} />
                  <Route path="staff" element={<Staff />} />
                  <Route path="coupons" element={<Coupons />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="settings" element={<Settings />} />
                </Routes>
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App

