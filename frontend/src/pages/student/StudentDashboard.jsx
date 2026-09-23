import { useState, useEffect } from 'react'
import Layout from '../../components/common/Layout'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import {
  MdMeetingRoom, MdPayment, MdReport, MdCampaign,
  MdCheckCircle, MdPending, MdCancel, MdAdd,
  MdPeople, MdClose, MdPerson, MdPhone, MdCalendarToday,
  MdAccessTime, MdInfo, MdArrowForward, MdHome,
} from 'react-icons/md'

const StudentDashboard = () => {
  const { user } = useAuth()

  const [visitorModal, setVisitorModal] = useState(false)
  const [visitorForm, setVisitorForm] = useState({
    visitorName: '',
    visitorPhone: '',
    relation: '',
    visitDate: '',
    visitTime: '',
    purpose: '',
    numberOfVisitors: 1,
  })
  const [visitorRequests, setVisitorRequests] = useState([
    {
      id: 1,
      visitorName: 'Ramesh Sharma',
      visitorPhone: '9876543210',
      relation: 'Father',
      visitDate: '2026-09-25',
      visitTime: '10:00',
      purpose: 'Personal Visit',
      numberOfVisitors: 2,
      status: 'approved',
      wardenNote: 'Approved. Please collect visitor pass from office.',
    },
    {
      id: 2,
      visitorName: 'Sunita Mehta',
      visitorPhone: '9123456789',
      relation: 'Mother',
      visitDate: '2026-09-28',
      visitTime: '14:00',
      purpose: 'Bringing essentials',
      numberOfVisitors: 1,
      status: 'pending',
      wardenNote: '',
    },
    {
      id: 3,
      visitorName: 'Arjun Sharma',
      visitorPhone: '9988776655',
      relation: 'Brother',
      visitDate: '2026-09-20',
      visitTime: '11:00',
      purpose: 'Birthday celebration',
      numberOfVisitors: 1,
      status: 'rejected',
      wardenNote: 'Not allowed on weekdays. Please reschedule for weekend.',
    },
  ])
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const stats = [
    {
      label: 'Room Number',
      value: user?.roomNumber || '204-A',
      icon: <MdMeetingRoom />,
      color: 'blue',
      link: '/student/my-room',
    },
    {
      label: 'Rent Status',
      value: 'Paid',
      icon: <MdPayment />,
      color: 'green',
      link: '/student/rent-payment',
    },
    {
      label: 'Active Complaints',
      value: '1',
      icon: <MdReport />,
      color: 'yellow',
      link: '/student/complaint',
    },
    {
      label: 'New Notices',
      value: '3',
      icon: <MdCampaign />,
      color: 'purple',
      link: '/student/notice-board',
    },
  ]

  const colorMap = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
  }

  const recentNotices = [
    { id: 1, title: 'Hostel Maintenance on 25th Sep', date: '21 Sep 2026', type: 'info' },
    { id: 2, title: 'Rent Due Date Extended to 30th Sep', date: '20 Sep 2026', type: 'success' },
    { id: 3, title: 'No Visitors on 22nd Sep (Holiday)', date: '19 Sep 2026', type: 'warning' },
  ]

  const noticeColors = {
    info: 'border-l-blue-500 bg-blue-50',
    success: 'border-l-green-500 bg-green-50',
    warning: 'border-l-yellow-500 bg-yellow-50',
  }

  const handleVisitorChange = (e) => {
    setVisitorForm({ ...visitorForm, [e.target.name]: e.target.value })
  }

  const handleVisitorSubmit = async (e) => {
    e.preventDefault()
    setSubmitLoading(true)

    // Simulate API call
    setTimeout(() => {
      const newRequest = {
        id: visitorRequests.length + 1,
        ...visitorForm,
        status: 'pending',
        wardenNote: '',
      }
      setVisitorRequests([newRequest, ...visitorRequests])
      setSubmitLoading(false)
      setSubmitSuccess(true)
      setVisitorForm({
        visitorName: '',
        visitorPhone: '',
        relation: '',
        visitDate: '',
        visitTime: '',
        purpose: '',
        numberOfVisitors: 1,
      })
      setTimeout(() => {
        setSubmitSuccess(false)
        setVisitorModal(false)
      }, 2000)
    }, 1000)
  }

  const getStatusBadge = (status) => {
    if (status === 'approved') return (
      <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
        <MdCheckCircle /> Approved
      </span>
    )
    if (status === 'pending') return (
      <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-semibold px-2.5 py-1 rounded-full">
        <MdPending /> Pending
      </span>
    )
    if (status === 'rejected') return (
      <span className="flex items-center gap-1 bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full">
        <MdCancel /> Rejected
      </span>
    )
  }

  return (
    <Layout title="Dashboard">
      <div className="space-y-6">

        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#1a1f2e] to-[#1e3a8a] rounded-2xl p-6 text-white flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h2>
            <p className="text-blue-200 text-sm">
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <MdHome className="text-white text-2xl" />
            </div>
            <div>
              <p className="text-blue-200 text-xs">Your Hostel</p>
              <p className="text-white font-bold">HostelCloud HQ</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              to={stat.link}
              className="bg-white rounded-xl shadow-sm hover:shadow-md border border-gray-100 p-5 flex items-center gap-4 transition-all duration-200 hover:-translate-y-0.5"
            >
              <div className={`${colorMap[stat.color]} p-3 rounded-xl text-2xl`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-gray-500 text-xs font-medium">{stat.label}</p>
                <p className="text-xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Visitor Requests — 2/3 width */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MdPeople className="text-blue-600 text-xl" />
                <h3 className="font-bold text-gray-800">Visitor Requests</h3>
              </div>
              <button
                onClick={() => setVisitorModal(true)}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                <MdAdd /> Add Visitor
              </button>
            </div>

            <div className="p-6 space-y-4">
              {visitorRequests.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                  <MdPeople className="text-5xl mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No visitor requests yet</p>
                  <p className="text-sm mt-1">Click "Add Visitor" to submit a request</p>
                </div>
              ) : (
                visitorRequests.map((req) => (
                  <div
                    key={req.id}
                    className="border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                          {req.visitorName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{req.visitorName}</p>
                          <p className="text-xs text-gray-400">{req.relation} • {req.visitorPhone}</p>
                        </div>
                      </div>
                      {getStatusBadge(req.status)}
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <MdCalendarToday className="text-gray-400" />
                        {new Date(req.visitDate).toLocaleDateString('en-IN')}
                      </div>
                      <div className="flex items-center gap-1">
                        <MdAccessTime className="text-gray-400" />
                        {req.visitTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <MdPeople className="text-gray-400" />
                        {req.numberOfVisitors} visitor(s)
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mb-2">
                      <span className="font-medium text-gray-700">Purpose:</span> {req.purpose}
                    </p>

                    {req.wardenNote && (
                      <div className={`text-xs px-3 py-2 rounded-lg flex items-start gap-2 mt-2 ${
                        req.status === 'approved'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-red-50 text-red-600'
                      }`}>
                        <MdInfo className="mt-0.5 flex-shrink-0" />
                        <span><span className="font-semibold">Warden Note:</span> {req.wardenNote}</span>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h3 className="font-bold text-gray-800 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: 'Browse Rooms', link: '/student/rooms', color: 'text-blue-600 bg-blue-50' },
                  { label: 'Pay Rent', link: '/student/rent-payment', color: 'text-green-600 bg-green-50' },
                  { label: 'File Complaint', link: '/student/complaint', color: 'text-yellow-600 bg-yellow-50' },
                  { label: 'View Notices', link: '/student/notice-board', color: 'text-purple-600 bg-purple-50' },
                  { label: 'My Profile', link: '/student/profile', color: 'text-gray-600 bg-gray-50' },
                ].map((item) => (
                  <Link
                    key={item.label}
                    to={item.link}
                    className="flex items-center justify-between px-4 py-2.5 rounded-lg hover:bg-gray-50 border border-gray-100 transition-colors group"
                  >
                    <span className={`text-sm font-medium ${item.color.split(' ')[0]}`}>{item.label}</span>
                    <MdArrowForward className="text-gray-300 group-hover:text-gray-500 text-sm" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Notices */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Recent Notices</h3>
                <Link to="/student/notice-board" className="text-xs text-blue-600 font-semibold hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {recentNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className={`border-l-4 pl-3 py-2 rounded-r-lg ${noticeColors[notice.type]}`}
                  >
                    <p className="text-sm font-medium text-gray-800">{notice.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{notice.date}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Visitor Request Modal */}
      {visitorModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MdPeople className="text-blue-600 text-xl" />
                <h2 className="font-bold text-gray-800">New Visitor Request</h2>
              </div>
              <button
                onClick={() => setVisitorModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MdClose className="text-xl" />
              </button>
            </div>

            {/* Success Message */}
            {submitSuccess && (
              <div className="mx-6 mt-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                <MdCheckCircle className="text-green-500 text-lg" />
                Visitor request submitted! Warden will review shortly.
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleVisitorSubmit} className="p-6 space-y-4">

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Visitor Name *
                  </label>
                  <div className="relative">
                    <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="visitorName"
                      value={visitorForm.visitorName}
                      onChange={handleVisitorChange}
                      required
                      placeholder="Full name"
                      className="input-field pl-9 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <MdPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="visitorPhone"
                      value={visitorForm.visitorPhone}
                      onChange={handleVisitorChange}
                      required
                      placeholder="98765 43210"
                      className="input-field pl-9 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Relation *
                  </label>
                  <select
                    name="relation"
                    value={visitorForm.relation}
                    onChange={handleVisitorChange}
                    required
                    className="input-field text-sm"
                  >
                    <option value="">Select relation</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Friend">Friend</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    No. of Visitors *
                  </label>
                  <input
                    type="number"
                    name="numberOfVisitors"
                    value={visitorForm.numberOfVisitors}
                    onChange={handleVisitorChange}
                    required
                    min="1"
                    max="5"
                    className="input-field text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Visit Date *
                  </label>
                  <div className="relative">
                    <MdCalendarToday className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      name="visitDate"
                      value={visitorForm.visitDate}
                      onChange={handleVisitorChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="input-field pl-9 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Visit Time *
                  </label>
                  <div className="relative">
                    <MdAccessTime className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="time"
                      name="visitTime"
                      value={visitorForm.visitTime}
                      onChange={handleVisitorChange}
                      required
                      className="input-field pl-9 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Purpose of Visit *
                </label>
                <textarea
                  name="purpose"
                  value={visitorForm.purpose}
                  onChange={handleVisitorChange}
                  required
                  rows={3}
                  placeholder="Briefly describe the purpose of visit..."
                  className="input-field text-sm resize-none"
                />
              </div>

              {/* Info Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-2">
                <MdInfo className="text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-blue-700">
                  Your request will be sent to the warden for approval. You'll be notified once a decision is made. Visiting hours: <strong>9:00 AM – 6:00 PM</strong>
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setVisitorModal(false)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {submitLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </Layout>
  )
}

export default StudentDashboard
