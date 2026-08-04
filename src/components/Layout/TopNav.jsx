import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, Bell, ChevronDown, User, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function TopNav({ setSidebarOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasRealName = user?.firstName && user.firstName !== "User";
  const initial = hasRealName
    ? user.firstName.charAt(0).toUpperCase()
    : (user?.role || user?.email || "A").charAt(0).toUpperCase();
  const displayName = hasRealName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : user?.email || "Admin";

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-100 bg-white/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden items-center gap-2 rounded-full border border-transparent bg-gray-50 px-3.5 py-2 text-sm text-gray-400 transition-colors focus-within:border-primary-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary-100 md:flex">
          <Search className="h-4 w-4 shrink-0" />
          <input
            type="text"
            placeholder="Search records, events, students…"
            className="w-56 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 lg:w-72"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="relative rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent-500 ring-2 ring-white" />
        </button>

        <div className="mx-1 hidden h-6 w-px bg-gray-200 sm:block" />

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-gray-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-900 text-sm font-semibold text-white">
              {initial}
            </div>
            <div className="hidden text-left leading-tight sm:block">
              <p className="max-w-[9rem] truncate text-sm font-medium text-gray-800">
                {displayName}
              </p>
              <p className="text-[11px] capitalize leading-tight text-gray-400">
                {(user?.role || "viewer").toLowerCase()}
              </p>
            </div>
            <ChevronDown
              className={`hidden h-4 w-4 text-gray-400 transition-transform duration-200 sm:block ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-gray-100 bg-white py-1.5 shadow-soft">
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
              >
                <User className="h-4 w-4" />
                My profile
              </Link>
              <div className="my-1 h-px bg-gray-100" />
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
