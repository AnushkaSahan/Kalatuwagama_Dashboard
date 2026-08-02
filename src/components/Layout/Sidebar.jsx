import { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  GraduationCap,
  HeartHandshake,
  Users,
  Settings,
  LogOut,
  X,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import TempleMark from "../common/TempleMark";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  {
    name: "Temple",
    icon: Building2,
    children: [
      { name: "History", href: "/temple-history" },
      { name: "Monks", href: "/monks" },
      { name: "Events", href: "/events" },
      { name: "Announcements", href: "/announcements" },
      { name: "Gallery", href: "/gallery" },
      { name: "Donations", href: "/donations" },
      { name: "Messages", href: "/messages" },
    ],
  },
  {
    name: "Daham Pasala",
    icon: GraduationCap,
    children: [
      { name: "Teachers", href: "/teachers" },
      { name: "Students", href: "/students" },
    ],
  },
  {
    name: "Foundation",
    icon: HeartHandshake,
    children: [{ name: "Projects", href: "/foundation-projects" }],
  },
  {
    name: "Administration",
    icon: Users,
    children: [
      { name: "Users", href: "/users" },
      { name: "Roles", href: "/roles" },
    ],
  },
  { name: "Settings", icon: Settings, href: "/settings" },
];

const isChildActive = (item, pathname) =>
  item.children?.some((child) => pathname.startsWith(child.href));

export default function Sidebar({ open, setOpen }) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [expanded, setExpanded] = useState(() =>
    navigation
      .filter((item) => item.children && isChildActive(item, location.pathname))
      .map((item) => item.name),
  );

  useEffect(() => {
    const activeGroup = navigation.find(
      (item) => item.children && isChildActive(item, location.pathname),
    );
    if (activeGroup && !expanded.includes(activeGroup.name)) {
      setExpanded((prev) => [...prev, activeGroup.name]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const toggleGroup = (name) => {
    setExpanded((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name],
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
    if (setOpen) {
      setOpen(false);
    }
  };

  const initial = (user?.firstName || user?.email || "A")
    .charAt(0)
    .toUpperCase();

  const displayName =
    user?.firstName && user?.firstName !== "User"
      ? `${user.firstName} ${user.lastName || ""}`.trim()
      : user?.email || "Admin";

  // Standard standalone link styling
  const linkClasses = ({ isActive }) =>
    `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-primary-900 text-white shadow-sm shadow-primary-900/20"
        : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
    }`;

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col border-r border-gray-200/80 bg-white
          transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand header */}
        <div className="relative flex h-20 shrink-0 items-center justify-between overflow-hidden border-b border-gray-100 bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 px-5">
          <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-accent-500/20 blur-2xl" />
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent-500/40 bg-white/5 text-accent-400">
              <TempleMark className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <p className="font-display text-base font-semibold tracking-wide text-primary-50">
                Kalatuwagama
              </p>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-primary-200/70">
                Admin Portal
              </p>
            </div>
          </div>
          <button
            type="button"
            className="relative z-10 rounded-lg p-2 text-primary-100 hover:bg-white/10 lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-3.5 py-5">
          {navigation.map((item) => {
            const groupOpen = expanded.includes(item.name);
            const groupActive = isChildActive(item, location.pathname);

            if (item.children) {
              return (
                <div key={item.name} className="space-y-1">
                  {/* Parent Dropdown Button */}
                  <button
                    type="button"
                    onClick={() => toggleGroup(item.name)}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                      groupActive
                        ? "bg-primary-50/80 text-primary-950 font-semibold"
                        : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span>{item.name}</span>
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${
                        groupOpen ? "rotate-180 text-gray-600" : ""
                      }`}
                    />
                  </button>

                  {/* Submenu List */}
                  <div
                    className={`grid overflow-hidden transition-all duration-200 ${
                      groupOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="min-h-0 pt-1">
                      {/* Vertical line aligned perfectly under the parent icon center */}
                      <div className="ml-5 space-y-1 border-l-2 border-gray-100 pl-3">
                        {item.children.map((child) => (
                          <NavLink
                            key={child.name}
                            to={child.href}
                            className={({ isActive }) =>
                              `block rounded-lg px-3 py-2 text-sm transition-all duration-150 ${
                                isActive
                                  ? "bg-primary-900 font-medium text-white shadow-sm"
                                  : "text-gray-500 hover:bg-primary-50/60 hover:text-primary-900"
                              }`
                            }
                            onClick={() => setOpen && setOpen(false)}
                          >
                            <span>{child.name}</span>
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // Standalone Links (Dashboard, Settings, etc.)
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={linkClasses}
                onClick={() => setOpen && setOpen(false)}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="shrink-0 border-t border-gray-100 p-3.5">
          <div className="flex items-center gap-3 rounded-xl bg-gray-50/80 px-3 py-2.5 border border-gray-100/80">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-900 text-sm font-semibold text-white">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-800">
                {displayName}
              </p>
              <p className="truncate text-xs font-medium uppercase tracking-wider text-gray-400">
                {user?.role || "viewer"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 focus:outline-none"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
