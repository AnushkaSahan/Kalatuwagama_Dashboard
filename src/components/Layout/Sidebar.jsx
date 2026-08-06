import { useEffect, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
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
  { key: "dashboard", icon: LayoutDashboard, href: "/dashboard" },
  {
    key: "temple",
    icon: Building2,
    children: [
      { key: "history", href: "/temple-history" },
      { key: "monks", href: "/monks" },
      { key: "events", href: "/events" },
      { key: "announcements", href: "/announcements" },
      { key: "gallery", href: "/gallery" },
      { key: "donations", href: "/donations" },
      { key: "messages", href: "/messages" },
    ],
  },
  {
    key: "dahamPasala",
    icon: GraduationCap,
    children: [
      { key: "teachers", href: "/teachers" },
      { key: "students", href: "/students" },
    ],
  },
  {
    key: "foundation",
    icon: HeartHandshake,
    children: [{ key: "projects", href: "/foundation-projects" }],
  },
  {
    key: "administration",
    icon: Users,
    children: [
      { key: "users", href: "/users" },
      { key: "roles", href: "/roles" },
    ],
  },
  { key: "settings", icon: Settings, href: "/settings" },
];

const isChildActive = (item, pathname) =>
  item.children?.some((child) => pathname.startsWith(child.href));

// Role -> avatar letter, used whenever we don't have a real first name yet
const roleInitial = (role) => (role ? role.charAt(0).toUpperCase() : "A");

export default function Sidebar({ open, setOpen }) {
  const { t } = useTranslation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [expanded, setExpanded] = useState(() =>
    navigation
      .filter((item) => item.children && isChildActive(item, location.pathname))
      .map((item) => item.key),
  );

  useEffect(() => {
    const activeGroup = navigation.find(
      (item) => item.children && isChildActive(item, location.pathname),
    );
    if (activeGroup && !expanded.includes(activeGroup.key)) {
      setExpanded((prev) => [...prev, activeGroup.key]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const toggleGroup = (key) => {
    setExpanded((prev) =>
      prev.includes(key) ? prev.filter((n) => n !== key) : [...prev, key],
    );
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
    if (setOpen) {
      setOpen(false);
    }
  };

  // "User" is just AuthContext's placeholder until we fetch the real profile,
  // so fall back to the role (ADMIN -> "A") instead of showing "U".
  const hasRealName = user?.firstName && user.firstName !== "User";
  const initial = hasRealName
    ? user.firstName.charAt(0).toUpperCase()
    : roleInitial(user?.role) || (user?.email || "A").charAt(0).toUpperCase();

  const displayName = hasRealName
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
                {t("sidebar.brand")}
              </p>
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-primary-200/70">
                {t("sidebar.portal")}
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
            const groupOpen = expanded.includes(item.key);
            const groupActive = isChildActive(item, location.pathname);

            if (item.children) {
              return (
                <div key={item.key} className="space-y-1">
                  {/* Parent Dropdown Button */}
                  <button
                    type="button"
                    onClick={() => toggleGroup(item.key)}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                      groupActive
                        ? "bg-primary-50/80 text-primary-950 font-semibold"
                        : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 shrink-0" />
                      <span>{t(`sidebar.${item.key}`)}</span>
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
                            key={child.key}
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
                            <span>{t(`sidebar.${child.key}`)}</span>
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
                key={item.key}
                to={item.href}
                className={linkClasses}
                onClick={() => setOpen && setOpen(false)}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                <span>{t(`sidebar.${item.key}`)}</span>
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
              title={t("common.logout")}
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
