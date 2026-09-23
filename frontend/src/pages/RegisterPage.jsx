import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { MdHome, MdEmail, MdLock, MdPerson, MdPhone, MdVisibility, MdVisibilityOff, MdArrowForward } from 'react-icons/md'

const RegisterPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'student',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          role: formData.role,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Registration failed. Please try again.')
        setLoading(false)
        return
      }

      login(data.user, data.token)

      if (data.user.role === 'student') navigate('/student/dashboard')
      else if (data.user.role === 'warden') navigate('/warden/dashboard')
      else if (data.user.role === 'admin') navigate('/admin/dashboard')

    } catch (err) {
      setError('Could not connect to server. Please make sure the backend is running.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1f2e] flex">

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
            Join <span className="text-blue-400">HostelCloud</span> <br />
            Today
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-10">
            Create your account and start managing your hostel life — rooms, payments, complaints, and more.
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

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">

          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
              <MdHome className="text-white text-xl" />
            </div>
            <p className="text-gray-900 font-bold text-lg">HostelCloud</p>
          </div>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Create your account</h1>
          <p className="text-gray-500 text-sm mb-8">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Sign in
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
              <div className="relative">
                <MdPerson className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Rahul Verma"
                  className="input-field pl-10"
                />
              </div>
            </div>

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
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
              <div className="relative">
                <MdPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="98765 43210"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
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
                    className="input-field pl-10 pr-3 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm</label>
                <div className="relative">
                  <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="input-field pl-10 pr-3 text-sm"
                  />
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
              <input
                type="checkbox"
                onChange={() => setShowPassword(!showPassword)}
                className="rounded border-gray-300 text-blue-600"
              />
              Show password
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Create Account <MdArrowForward /></>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  )
}

export default RegisterPage
