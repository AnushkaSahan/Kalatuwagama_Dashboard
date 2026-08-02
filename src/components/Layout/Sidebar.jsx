import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  UserCog,
  LogOut,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  {
    name: "Temple",
    icon: Building2,
    children: [
      { name: "History", href: "/temple-history" },
      { name: "Monks", href: "/monks" },
      { name: "Events", href: "/events" },
      { name: "Gallery", href: "/gallery" },
      { name: "Donations", href: "/donations" },
      { name: "Messages", href: "/messages" },
    ],
  },
  { name: "Users", icon: Users, href: "/users" },
  { name: "Roles", icon: UserCog, href: "/roles" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export default function Sidebar({ open, setOpen }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
    if (setOpen) {
      setOpen(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`
        fixed lg:sticky top-0 z-50 flex h-full w-64 flex-col border-r border-gray-200 bg-white
        transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex h-16 items-center justify-between border-b border-gray-100 px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-900 flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="font-semibold text-gray-800">Kalatuwagama</span>
          </div>
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-3 py-4">
          {navigation.map((item) => (
            <div key={item.name} className="space-y-1">
              {item.children ? (
                <div>
                  <div className="mb-1 flex items-center gap-2 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </div>
                  <div className="ml-3 space-y-1">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.name}
                        to={child.href}
                        className={({ isActive }) => `
                          flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200
                          ${
                            isActive
                              ? "bg-primary-900 text-white shadow-sm"
                              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                          }
                        `}
                      >
                        <span>{child.name}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              ) : (
                <NavLink
                  to={item.href}
                  className={({ isActive }) => `
                    flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-200
                    ${
                      isActive
                        ? "bg-primary-900 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </NavLink>
              )}
            </div>
          ))}
        </nav>

        <div className="border-t border-gray-200 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}
