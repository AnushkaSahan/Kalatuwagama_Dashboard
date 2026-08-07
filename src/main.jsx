import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import "./i18n";
import "./index.css";

// Apply saved theme class before React mounts to avoid flash of wrong theme
(() => {
  const saved = localStorage.getItem("kalatuwagama_theme");
  const isDark =
    saved === "dark" ||
    (saved !== "light" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches);
  if (isDark) document.documentElement.classList.add("dark");
})();

function ThemedToaster() {
  const { isDark } = useTheme();
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: isDark ? "#1e2126" : "#fff",
          color: isDark ? "#f4f5f6" : "#1f2937",
          boxShadow: isDark
            ? "0 10px 40px -10px rgba(0,0,0,0.6)"
            : "0 10px 40px -10px rgba(0,0,0,0.12)",
          borderRadius: "12px",
          padding: "12px 16px",
        },
        success: {
          iconTheme: {
            primary: "#22C55E",
            secondary: isDark ? "#141619" : "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#EF4444",
            secondary: isDark ? "#141619" : "#fff",
          },
        },
      }}
    />
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
          <ThemedToaster />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
