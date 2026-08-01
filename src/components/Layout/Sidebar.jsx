import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  Calendar,
  Image,
  DollarSign,
  Mail,
  Settings,
  UserCog,
  LogOut,
  X,
} from "lucide-react";

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
        fixed lg:sticky top-0 z-50 h-full w-64 bg-white border-r border-gray-200 
        transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
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

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-4rem)]">
          {navigation.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <div>
                  <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </div>
                  <div className="ml-4 space-y-1">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.name}
                        to={child.href}
                        className={({ isActive }) => `
                          flex items-center gap-3 px-3 py-2 rounded-lg text-sm 
                          transition-colors duration-200
                          ${
                            isActive
                              ? "bg-primary-900 text-white shadow-sm"
                              : "text-gray-600 hover:bg-gray-100"
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
                    flex items-center gap-3 px-3 py-2 rounded-lg text-sm 
                    transition-colors duration-200
                    ${
                      isActive
                        ? "bg-primary-900 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100"
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </NavLink>
              )}
            </div>
          ))}

          <div className="pt-4 mt-4 border-t border-gray-200">
            <button className="flex items-center gap-3 px-3 py-2 w-full text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
