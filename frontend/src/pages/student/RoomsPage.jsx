import { useState, useEffect } from "react";
import Layout from "../../components/common/Layout";
import { useAuth } from "../../context/AuthContext";
import {
  MdMeetingRoom, MdLocationOn, MdCurrencyRupee, MdWifi, MdCheckCircle,
  MdClose, MdInfo, MdSend, MdFilterList,
} from "react-icons/md";

const RoomsPage = () => {
  const { token } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/rooms");
      const data = await res.json();
      setRooms(data);
    } catch (err) {
      setError("Could not load rooms. Please make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    empty: "bg-green-100 text-green-700",
    partial: "bg-yellow-100 text-yellow-700",
    full: "bg-red-100 text-red-700",
  };

  const statusLabels = {
    empty: "Available",
    partial: "Filling Fast",
    full: "Full",
  };

  const filteredRooms =
    filterType === "all" ? rooms : rooms.filter((r) => r.type === filterType);

  const handleRequestClick = (room) => {
    setSelectedRoom(room);
    setRequestMessage("");
    setSubmitError("");
    setSubmitSuccess(false);
  };

  const handleSendRequest = async () => {
    setSubmitLoading(true);
    setSubmitError("");
    try {
      const res = await fetch("http://localhost:5000/api/room-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roomId: selectedRoom._id, message: requestMessage }),
      });
      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.message || "Could not send request");
        setSubmitLoading(false);
        return;
      }

      setSubmitSuccess(true);
      setSubmitLoading(false);
      setTimeout(() => {
        setSelectedRoom(null);
      }, 1800);
    } catch (err) {
      setSubmitError("Server error. Please try again.");
      setSubmitLoading(false);
    }
  };

  return (
    <Layout title="Browse Rooms">
      <div className="space-y-6">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3 overflow-x-auto">
          <MdFilterList className="text-gray-400 text-xl flex-shrink-0" />
          {["all", "single", "double", "triple", "four"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize whitespace-nowrap transition-all ${
                filterType === type
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {type === "all" ? "All Rooms" : `${type} Sharing`}
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
            Loading rooms...
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <MdMeetingRoom className="text-5xl mx-auto mb-3 opacity-30" />
            No rooms found for this filter.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRooms.map((room) => (
              <div
                key={room._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
              >
                <div className="bg-gradient-to-br from-[#1a1f2e] to-[#1e3a8a] p-5 text-white relative">
                  <span
                    className={`absolute top-4 right-4 text-xs font-bold px-2.5 py-1 rounded-full ${statusColors[room.status]}`}
                  >
                    {statusLabels[room.status]}
                  </span>
                  <MdMeetingRoom className="text-3xl mb-2 opacity-80" />
                  <p className="text-2xl font-extrabold">Room {room.roomNumber}</p>
                  <p className="text-blue-200 text-sm flex items-center gap-1 mt-1">
                    <MdLocationOn /> Floor {room.floor} &middot; <span className="capitalize">{room.type} Sharing</span>
                  </p>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-gray-400 text-xs">Monthly Rent</p>
                      <p className="text-xl font-bold text-gray-800 flex items-center">
                        <MdCurrencyRupee />{room.rent.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs">Occupancy</p>
                      <p className="text-sm font-semibold text-gray-700">
                        {room.occupied} / {room.capacity} beds
                      </p>
                    </div>
                  </div>

                  {room.facilities?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {room.facilities.map((f) => (
                        <span
                          key={f}
                          className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full font-medium"
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => handleRequestClick(room)}
                    disabled={room.status === "full"}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {room.status === "full" ? "Room Full" : (
                      <>Request This Room <MdSend className="text-sm" /></>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedRoom && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-800">Request Room {selectedRoom.roomNumber}</h2>
              <button
                onClick={() => setSelectedRoom(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MdClose className="text-xl" />
              </button>
            </div>

            <div className="p-6">
              {submitSuccess ? (
                <div className="text-center py-6">
                  <MdCheckCircle className="text-5xl text-green-500 mx-auto mb-3" />
                  <p className="font-bold text-gray-800">Request Sent!</p>
                  <p className="text-sm text-gray-500 mt-1">Warden will review your request soon.</p>
                </div>
              ) : (
                <>
                  <div className="bg-blue-50 rounded-xl p-4 mb-4 text-sm text-blue-700 flex items-start gap-2">
                    <MdInfo className="mt-0.5 flex-shrink-0" />
                    <span>
                      Floor {selectedRoom.floor} &middot; <span className="capitalize">{selectedRoom.type} Sharing</span> &middot; ₹{selectedRoom.rent.toLocaleString("en-IN")}/month
                    </span>
                  </div>

                  {submitError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
                      {submitError}
                    </div>
                  )}

                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Message to warden (optional)
                  </label>
                  <textarea
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                    rows={3}
                    placeholder="Any preference or note..."
                    className="input-field text-sm resize-none mb-4"
                  />

                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedRoom(null)}
                      className="flex-1 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendRequest}
                      disabled={submitLoading}
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {submitLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "Send Request"
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default RoomsPage;
