import { MdMenu, MdNotifications, MdPerson } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";

function Navbar({ title, onMenuClick }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 lg:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-gray-500 hover:text-gray-700 text-2xl"
        >
          <MdMenu />
        </button>
        <h1 className="text-lg lg:text-xl font-bold text-gray-800">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-gray-400 hover:text-gray-600">
          <MdNotifications className="text-2xl" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
            {user?.name ? user.name.charAt(0).toUpperCase() : <MdPerson />}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-gray-800 leading-tight">{user?.name || "Guest"}</p>
            <p className="text-xs text-gray-400 capitalize">{user?.role || ""}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
