import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import "hover.css/css/hover-min.css";

export const Layout = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const navLinkClass = () =>
    `font-medium hvr-border-fade px-2 py-1 rounded-md ${
      darkMode ? "text-white" : "text-slate-700"
    } hover:border-emerald-500 border-transparent border transition-all duration-300`;

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-500 ${
        darkMode
          ? "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white"
          : "bg-gradient-to-b from-emerald-100 via-green-50 to-white text-slate-900"
      }`}
    >
      {/* Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/90 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          {/* Left side - Back Arrow + Logo + Nav */}
          <div className="flex items-center gap-6">
            {location.pathname !== "/" && (
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-emerald-100 dark:hover:bg-slate-700 transition-all"
                aria-label="Go Back"
              >
                <ArrowLeft className="w-5 h-5 text-emerald-700 dark:text-emerald-300" />
              </button>
            )}

            <Link
              to="/"
              className={`${
                darkMode ? "text-white" : "text-green-700"
              } text-2xl font-extrabold tracking-tight hover:opacity-90 transition-opacity`}
            >
              TalentFlow
            </Link>

            {/* Nav Links with Hover.css Border Effect */}
            <nav className="flex items-center gap-5">
              <Link to="/jobs" className={navLinkClass()}>
                Jobs
              </Link>
              <Link to="/candidates" className={navLinkClass()}>
                Candidates
              </Link>
              <Link to="/kanban" className={navLinkClass()}>
                Kanban
              </Link>
              <Link to="/dashboard" className={navLinkClass()}>
                Dashboard
              </Link>
            </nav>
          </div>

          {/* Right Side - Dark Mode Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/70 dark:bg-slate-700 hover:bg-white dark:hover:bg-slate-600 transition-all shadow"
            >
              {darkMode ? (
                <>
                  <Sun className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm font-medium text-white">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5 text-slate-700" />
                  <span className="text-sm font-medium text-slate-800">Dark</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 flex-grow w-full flex justify-center px-4">
        <div className="w-full max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`text-center border-t border-slate-300 dark:border-slate-700 py-6 mt-8 ${
          darkMode ? "text-white" : "text-slate-600"
        }`}
      >
        <p>© {new Date().getFullYear()} Hiring Platform. Built with ❤️ to simplify hiring.</p>
      </footer>
    </div>
  );
};
