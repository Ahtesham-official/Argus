import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (isSidebarCollapsed) {
      document.body.classList.add('argus-sidebar-collapsed');
    } else {
      document.body.classList.remove('argus-sidebar-collapsed');
    }

    return () => {
      document.body.classList.remove('argus-sidebar-collapsed');
    };
  }, [isSidebarCollapsed]);

  return (
    <div className="min-h-screen bg-[#f1fafc] text-gray-800 font-sans">

      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main
        className={`
          min-h-screen
          transition-all duration-300
          md:ml-[260px]
        `}
      >
        {/* Top Header */}
        <header className="h-[82px] bg-white/90 backdrop-blur-md border-b border-[#a3d2d4]/40 sticky top-0 z-30 px-5 md:px-8 flex items-center justify-between">

          <div className="flex items-center min-w-0">

            {/* Desktop menu */}
            <button
              id="sidebar-toggle-btn"
              type="button"
              className="mr-4 hidden md:flex items-center justify-center w-10 h-10 text-[#007979] hover:bg-[#007979]/10 rounded-xl transition-colors"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              aria-label="Toggle sidebar"
            >
              <span className="material-symbols-outlined">
                menu
              </span>
            </button>

            {/* Mobile menu */}
            <button
              type="button"
              className="mr-3 flex md:hidden items-center justify-center w-10 h-10 text-[#007979] hover:bg-[#007979]/10 rounded-xl transition-colors"
              onClick={() => setIsSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <span className="material-symbols-outlined">
                menu
              </span>
            </button>

            <h1 className="text-xl font-bold text-[#007979] truncate">
              Argus Claims
            </h1>
          </div>

          <div className="flex items-center gap-3 md:gap-4">

            <button
              type="button"
              className="w-10 h-10 flex items-center justify-center text-[#007979] hover:bg-[#007979]/10 rounded-full transition-colors relative"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined">
                notifications
              </span>

              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#007979] to-[#00b0b0] text-white flex items-center justify-center font-bold shadow-md">
              DR
            </div>

          </div>
        </header>

        {/* Page content */}
        <div className="w-full min-h-[calc(100vh-82px)]">
          <Outlet />
        </div>

      </main>
    </div>
  );
};

export default Layout;