import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex h-screen overflow-hidden bg-gray-50 dark:bg-dark-950">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-0 h-96 w-96 rounded-full bg-primary-500/10 blur-3xl dark:bg-primary-600/5" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-accent-500/10 blur-3xl dark:bg-accent-500/5" />
      </div>

      <div className="relative z-10 flex h-screen w-full overflow-hidden">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

        <div className="flex min-w-0 flex-1 flex-col">
          <TopNav setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
