import { useState, useEffect } from "react";
import Layout from "../../components/common/Layout";
import { useAuth } from "../../context/AuthContext";
import {
  MdPerson, MdMeetingRoom, MdCheckCircle, MdCancel, MdPending,
  MdClose, MdPhone, MdEmail, MdCurrencyRupee, MdInfo,
} from "react-icons/md";

const BookingRequests = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("pending");

  const [actionModal, setActionModal] = useState(null);
  const [actionType, setActionType] = useState("");
  const [wardenNote, setWardenNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/room-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      setError("Could not load requests. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const openAction = (request, type) => {
    setActionModal(request);
    setActionType(type);
    setWardenNote("");
    setActionError("");
  };

  const handleAction = async () => {
    setActionLoading(true);
    setActionError("");
    try {
      const res = await fetch(`http://localhost:5000/api/room-requests/${actionModal._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: actionType, wardenNote }),
      });
      const data = await res.json();

      if (!res.ok) {
        setActionError(data.message || "Action failed");
        setActionLoading(false);
        return;
      }

      setActionModal(null);
      setActionLoading(false);
      fetchRequests();
    } catch (err) {
      setActionError("Server error. Please try again.");
      setActionLoading(false);
    }
  };

  const statusBadge = (status) => {
    if (status === "approved")
      return (
        <span className="flex items-center gap-1 bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
          <MdCheckCircle /> Approved
        </span>
      );
    if (status === "rejected")
      return (
        <span className="flex items-center gap-1 bg-red-100 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-full">
          <MdCancel /> Rejected
        </span>
      );
    return (
      <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-semibold px-2.5 py-1 rounded-full">
        <MdPending /> Pending
      </span>
    );
  };

  const filteredRequests =
    filterStatus === "all" ? requests : requests.filter((r) => r.status === filterStatus);

  return (
    <Layout title="Booking Requests">
      <div className="space-y-6">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
          {["pending", "approved", "rejected", "all"].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition-all ${
                filterStatus === s
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-20 text-gray-400">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            Loading requests...
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 text-center py-20 text-gray-400">
            <MdMeetingRoom className="text-5xl mx-auto mb-3 opacity-30" />
            No {filterStatus !== "all" ? filterStatus : ""} requests found.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req) => (
              <div
                key={req._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {req.student?.name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{req.student?.name}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1"><MdEmail className="text-sm" /> {req.student?.email}</span>
                        {req.student?.phone && (
                          <span className="flex items-center gap-1"><MdPhone className="text-sm" /> {req.student.phone}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  {statusBadge(req.status)}
                </div>

                <div className="grid grid-cols-3 gap-3 bg-gray-50 rounded-xl p-3 mb-3 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs">Room</p>
                    <p className="font-semibold text-gray-700">{req.room?.roomNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Type</p>
                    <p className="font-semibold text-gray-700 capitalize">{req.room?.type} Sharing</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Rent</p>
                    <p className="font-semibold text-gray-700 flex items-center"><MdCurrencyRupee className="text-xs" />{req.room?.rent}</p>
                  </div>
                </div>

                {req.message && (
                  <p className="text-sm text-gray-500 mb-3">
                    <span className="font-medium text-gray-700">Message:</span> {req.message}
                  </p>
                )}

                {req.wardenNote && (
                  <div className={`text-xs px-3 py-2 rounded-lg flex items-start gap-2 mb-3 ${
                    req.status === "approved" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
                  }`}>
                    <MdInfo className="mt-0.5 flex-shrink-0" />
                    <span><span className="font-semibold">Your Note:</span> {req.wardenNote}</span>
                  </div>
                )}

                {req.status === "pending" && (
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => openAction(req, "rejected")}
                      className="flex-1 py-2 border border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors text-sm"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => openAction(req, "approved")}
                      className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm"
                    >
                      Approve
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {actionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">
                {actionType === "approved" ? "Approve" : "Reject"} Request
              </h2>
              <button
                onClick={() => setActionModal(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MdClose className="text-xl" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                {actionType === "approved" ? (
                  <>Approving will allot <span className="font-semibold">Room {actionModal.room?.roomNumber}</span> to <span className="font-semibold">{actionModal.student?.name}</span>.</>
                ) : (
                  <>Rejecting this request for <span className="font-semibold">{actionModal.student?.name}</span>.</>
                )}
              </p>

              {actionError && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
                  {actionError}
                </div>
              )}

              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Note (optional)
              </label>
              <textarea
                value={wardenNote}
                onChange={(e) => setWardenNote(e.target.value)}
                rows={3}
                placeholder="Add a note for the student..."
                className="input-field text-sm resize-none mb-4"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setActionModal(null)}
                  className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAction}
                  disabled={actionLoading}
                  className={`flex-1 py-2.5 text-white font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60 ${
                    actionType === "approved" ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {actionLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    `Confirm ${actionType === "approved" ? "Approval" : "Rejection"}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default BookingRequests;
