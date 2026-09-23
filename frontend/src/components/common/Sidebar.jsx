import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  MdMenu, MdClose, MdHome, MdDashboard, MdMeetingRoom, MdBookOnline,
  MdPayment, MdReport, MdCampaign, MdPerson, MdLogout,
  MdPeople, MdAssignment, MdAssessment, MdReceiptLong, MdNotifications,
} from "react-icons/md";
import { Link, useLocation, useNavigate } from "react-router-dom";

const menuConfig = {
  student: [
    { label: "Dashboard", icon: <MdDashboard />, link: "/student/dashboard" },
    { label: "Browse Rooms", icon: <MdMeetingRoom />, link: "/student/rooms" },
    { label: "My Bookings", icon: <MdBookOnline />, link: "/student/my-bookings" },
    { label: "My Room", icon: <MdHome />, link: "/student/my-room" },
    { label: "Rent Payment", icon: <MdPayment />, link: "/student/rent-payment" },
    { label: "Complaints", icon: <MdReport />, link: "/student/complaint" },
    { label: "Notice Board", icon: <MdCampaign />, link: "/student/notice-board" },
    { label: "Profile", icon: <MdPerson />, link: "/student/profile" },
  ],
  warden: [
    { label: "Dashboard", icon: <MdDashboard />, link: "/warden/dashboard" },
    { label: "Manage Rooms", icon: <MdMeetingRoom />, link: "/warden/manage-rooms" },
    { label: "Booking Requests", icon: <MdBookOnline />, link: "/warden/booking-requests" },
    { label: "Room Allotment", icon: <MdAssignment />, link: "/warden/room-allotment" },
    { label: "Rent Tracker", icon: <MdReceiptLong />, link: "/warden/rent-tracker" },
    { label: "Complaints", icon: <MdReport />, link: "/warden/complaints" },
    { label: "Notice Board", icon: <MdCampaign />, link: "/warden/notice-board" },
    { label: "Students", icon: <MdPeople />, link: "/warden/students" },
  ],
  admin: [
    { label: "Dashboard", icon: <MdDashboard />, link: "/admin/dashboard" },
    { label: "Students", icon: <MdPeople />, link: "/admin/students" },
    { label: "Wardens", icon: <MdPeople />, link: "/admin/wardens" },
    { label: "Rooms", icon: <MdMeetingRoom />, link: "/admin/rooms" },
    { label: "Reports", icon: <MdAssessment />, link: "/admin/reports" },
    { label: "Payments", icon: <MdReceiptLong />, link: "/admin/payments" },
    { label: "Complaints", icon: <MdReport />, link: "/admin/complaints" },
    { label: "Announcements", icon: <MdCampaign />, link: "/admin/announcements" },
  ],
};

function Sidebar({ open, setOpen }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const role = user?.role || "student";
  const menu = menuConfig[role] || menuConfig.student;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-[#1a1f2e] text-white flex flex-col z-40 transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="w-9 h-9 bg-blue-500 rounded-xl flex items-center justify-center">
            <MdHome className="text-white text-lg" />
          </div>
          <div>
            <p className="font-bold text-sm leading-tight">HostelCloud</p>
            <p className="text-blue-300 text-[11px] capitalize">{role} Panel</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="ml-auto lg:hidden text-gray-400 hover:text-white"
          >
            <MdClose />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menu.map((item) => {
            const active = location.pathname === item.link;
            return (
              <Link
                key={item.link}
                to={item.link}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-red-500/10 hover:text-red-400 w-full transition-all"
          >
            <MdLogout className="text-lg" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
