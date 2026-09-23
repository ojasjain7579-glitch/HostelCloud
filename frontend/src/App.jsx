import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard'
import RoomsPage from './pages/student/RoomsPage'
import MyBookings from './pages/student/MyBookings'
import MyRoom from './pages/student/MyRoom'
import RentPayment from './pages/student/RentPayment'
import ComplaintPage from './pages/student/ComplaintPage'
import NoticeBoardPage from './pages/student/NoticeBoardPage'
import StudentProfile from './pages/student/StudentProfile'

// Warden Pages
import WardenDashboard from './pages/warden/WardenDashboard'
import ManageRoomsWarden from './pages/warden/ManageRooms'
import BookingRequests from './pages/warden/BookingRequests'
import RoomAllotment from './pages/warden/RoomAllotment'
import RentTracker from './pages/warden/RentTracker'
import ComplaintManagement from './pages/warden/ComplaintManagement'
import NoticeBoardWarden from './pages/warden/NoticeBoard'
import StudentList from './pages/warden/StudentList'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageStudents from './pages/admin/ManageStudents'
import ManageWardens from './pages/admin/ManageWardens'
import ManageRoomsAdmin from './pages/admin/ManageRooms'
import Reports from './pages/admin/Reports'
import PaymentHistory from './pages/admin/PaymentHistory'
import ComplaintOverview from './pages/admin/ComplaintOverview'
import Announcements from './pages/admin/Announcements'

import ProtectedRoute from './components/common/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/rooms" element={<ProtectedRoute role="student"><RoomsPage /></ProtectedRoute>} />
          <Route path="/student/my-bookings" element={<ProtectedRoute role="student"><MyBookings /></ProtectedRoute>} />
          <Route path="/student/my-room" element={<ProtectedRoute role="student"><MyRoom /></ProtectedRoute>} />
          <Route path="/student/rent-payment" element={<ProtectedRoute role="student"><RentPayment /></ProtectedRoute>} />
          <Route path="/student/complaint" element={<ProtectedRoute role="student"><ComplaintPage /></ProtectedRoute>} />
          <Route path="/student/notice-board" element={<ProtectedRoute role="student"><NoticeBoardPage /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute role="student"><StudentProfile /></ProtectedRoute>} />

          <Route path="/warden/dashboard" element={<ProtectedRoute role="warden"><WardenDashboard /></ProtectedRoute>} />
          <Route path="/warden/manage-rooms" element={<ProtectedRoute role="warden"><ManageRoomsWarden /></ProtectedRoute>} />
          <Route path="/warden/booking-requests" element={<ProtectedRoute role="warden"><BookingRequests /></ProtectedRoute>} />
          <Route path="/warden/room-allotment" element={<ProtectedRoute role="warden"><RoomAllotment /></ProtectedRoute>} />
          <Route path="/warden/rent-tracker" element={<ProtectedRoute role="warden"><RentTracker /></ProtectedRoute>} />
          <Route path="/warden/complaints" element={<ProtectedRoute role="warden"><ComplaintManagement /></ProtectedRoute>} />
          <Route path="/warden/notice-board" element={<ProtectedRoute role="warden"><NoticeBoardWarden /></ProtectedRoute>} />
          <Route path="/warden/students" element={<ProtectedRoute role="warden"><StudentList /></ProtectedRoute>} />

          <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/students" element={<ProtectedRoute role="admin"><ManageStudents /></ProtectedRoute>} />
          <Route path="/admin/wardens" element={<ProtectedRoute role="admin"><ManageWardens /></ProtectedRoute>} />
          <Route path="/admin/rooms" element={<ProtectedRoute role="admin"><ManageRoomsAdmin /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute role="admin"><Reports /></ProtectedRoute>} />
          <Route path="/admin/payments" element={<ProtectedRoute role="admin"><PaymentHistory /></ProtectedRoute>} />
          <Route path="/admin/complaints" element={<ProtectedRoute role="admin"><ComplaintOverview /></ProtectedRoute>} />
          <Route path="/admin/announcements" element={<ProtectedRoute role="admin"><Announcements /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
