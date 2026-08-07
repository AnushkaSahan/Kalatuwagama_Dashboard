import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, Moon, Sun, ChevronDown, User, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export default function TopNav({ setSidebarOpen }) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
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
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-100 bg-white/70 px-4 backdrop-blur-xl dark:border-white/5 dark:bg-dark-900/70 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-dark-800 dark:hover:text-gray-100 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          title={
            theme === "dark"
              ? t("topnav.switchToLight")
              : t("topnav.switchToDark")
          }
          className="group relative flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 shadow-sm transition-all duration-200 hover:border-accent-500/50 hover:text-accent-700 dark:border-white/10 dark:bg-dark-800 dark:text-gray-300 dark:hover:border-accent-500/40 dark:hover:text-accent-400"
        >
          {theme === "dark" ? (
            <Sun className="h-[18px] w-[18px] transition-transform duration-300 group-hover:rotate-45" />
          ) : (
            <Moon className="h-[18px] w-[18px] transition-transform duration-300 group-hover:-rotate-12" />
          )}
        </button>

        <div className="mx-1 hidden h-6 w-px bg-gray-200 dark:bg-white/10 sm:block" />

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-gray-100 dark:hover:bg-dark-800"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-sm font-semibold text-white shadow-md shadow-primary-900/30">
              {initial}
            </div>
            <div className="hidden text-left leading-tight sm:block">
              <p className="max-w-[9rem] truncate text-sm font-medium text-gray-800 dark:text-gray-100">
                {displayName}
              </p>
              <p className="text-[11px] capitalize leading-tight text-gray-400 dark:text-gray-500">
                {(user?.role || "viewer").toLowerCase()}
              </p>
            </div>
            <ChevronDown
              className={`hidden h-4 w-4 text-gray-400 transition-transform duration-200 sm:block dark:text-gray-500 ${
                menuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-gray-100 bg-white/95 py-1.5 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-dark-850/95 animate-fade-in">
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-dark-800 dark:hover:text-white"
              >
                <User className="h-4 w-4" />
                {t("common.profile")}
              </Link>
              <div className="my-1 h-px bg-gray-100 dark:bg-white/5" />
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" />
                {t("common.logout")}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
