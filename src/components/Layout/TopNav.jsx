import { Menu, Search, Bell, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function TopNav({ setSidebarOpen }) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>
        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-400">
          <Search className="w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-gray-700 w-40"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg hover:bg-gray-100 relative">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
        </button>
        <Link
          to="/profile"
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
        >
          <div className="w-8 h-8 rounded-full bg-primary-900 text-white flex items-center justify-center text-sm font-semibold">
            A
          </div>
        </Link>
      </div>
    </header>
  );
}
