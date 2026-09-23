import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MdHome, MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdArrowForward } from 'react-icons/md'

const demoAccounts = [
  { role: 'student', email: 'student@hostelcloud.in', password: '123456', name: 'Rahul Verma', roomNumber: '204-A' },
  { role: 'warden', email: 'warden@hostelcloud.in', password: '123456', name: 'Suresh Warden' },
  { role: 'admin', email: 'admin@hostelcloud.in', password: '123456', name: 'Admin User' },
]

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ email: '', password: '', role: 'student' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Demo/offline bypass -- works without backend
    const demoMatch = demoAccounts.find(
      (acc) => acc.email === formData.email && acc.password === formData.password
    )
    if (demoMatch) {
      setTimeout(() => {
        login({ name: demoMatch.name, email: demoMatch.email, role: demoMatch.role, roomNumber: demoMatch.roomNumber }, 'demo-token')
        setLoading(false)
        if (demoMatch.role === 'student') navigate('/student/dashboard')
        else if (demoMatch.role === 'warden') navigate('/warden/dashboard')
        else if (demoMatch.role === 'admin') navigate('/admin/dashboard')
      }, 500)
      return
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Login failed. Please try again.')
        setLoading(false)
        return
      }

      login(data.user, data.token)

      if (data.user.role === 'student') navigate('/student/dashboard')
      else if (data.user.role === 'warden') navigate('/warden/dashboard')
      else if (data.user.role === 'admin') navigate('/admin/dashboard')

    } catch (err) {
      setError('Backend not connected yet. Use a demo account below to preview the app.')
      setLoading(false)
    }
  }

  const fillDemo = (account) => {
    setFormData({ email: account.email, password: account.password, role: account.role })
    setError('')
  }

  return (
    <div className="min-h-screen bg-[#1a1f2e] flex">

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-[#1a1f2e] to-[#1e3a8a]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <MdHome className="text-white text-xl" />
          </div>
          <div>
            <p className="text-white font-bold text-lg">HostelCloud</p>
            <p className="text-blue-400 text-xs">Hostel Management Platform</p>
          </div>
        </div>

        <div>
          <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">
            Welcome back to <br />
            <span className="text-blue-400">HostelCloud</span>
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-10">
            Manage your hostel operations seamlessly — rooms, payments, complaints, and more from one powerful dashboard.
          </p>

          <div className="space-y-4">
            {[
              'Real-time Room Availability',
              'Online Rent Payments',
              'Complaint Tracking',
              'Instant Announcements',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-gray-300 text-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-500 text-sm">© 2026 HostelCloud. All rights reserved.</p>
      </div>

      {/* Right Panel — Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">

          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <MdHome className="text-white text-xl" />
            </div>
            <p className="text-gray-900 font-bold text-lg">HostelCloud</p>
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Sign in to your account</h1>
          <p className="text-gray-500 text-sm mb-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline">
              Create one free
            </Link>
          </p>

          <div className="flex gap-2 mb-6 bg-gray-200 rounded-xl p-1">
            {['student', 'warden', 'admin'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setFormData({ ...formData, role })}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${
                  formData.role === role
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <MdEmail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="you@hostelcloud.in"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
                Remember me
              </label>
              <a href="#" className="text-sm text-blue-600 font-semibold hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Sign In <MdArrowForward /></>
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs text-gray-400 bg-gray-50 px-3">
                Quick Demo Access
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-4">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.role}
                  type="button"
                  onClick={() => fillDemo(acc)}
                  className="text-xs py-2 px-3 bg-white border border-gray-200 rounded-lg text-gray-600 hover:border-blue-300 hover:text-blue-600 capitalize font-medium transition-all"
                >
                  {acc.role}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default LoginPage
