import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, LogOut, Menu, X, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    closeMenu();
    if (location.pathname === '/') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200/80 bg-white/85 backdrop-blur-md transition-colors duration-200 dark:border-gray-800/80 dark:bg-gray-900/85">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <div className="flex flex-1 items-center justify-start">
            <Link to="/" className="flex items-center gap-2 group" onClick={closeMenu}>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-transform duration-200 dark:bg-indigo-950/60 dark:text-indigo-400 shadow-sm">
                <BookOpen className="h-5 w-5" />
              </div>
              <span className="font-serif text-lg font-bold tracking-tight text-gray-900 transition-colors sm:text-xl dark:text-white">
                AI eBook Creator
              </span>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden md:flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200/80 bg-gray-50/70 backdrop-blur-md dark:border-gray-800 dark:bg-gray-800/50 shadow-sm">
            {user && (
              <Link
                to="/dashboard"
                className="px-3.5 py-1 text-sm font-medium text-gray-700 hover:text-indigo-600 rounded-full hover:bg-white dark:hover:bg-gray-700/80 transition-all dark:text-gray-300 dark:hover:text-indigo-400"
              >
                Dashboard
              </Link>
            )}
            <a
              href="/#features"
              onClick={(e) => handleScrollTo(e, 'features')}
              className="px-3.5 py-1 text-sm font-medium text-gray-700 hover:text-indigo-600 rounded-full hover:bg-white dark:hover:bg-gray-700/80 transition-all dark:text-gray-300 dark:hover:text-indigo-400"
            >
              Features
            </a>
            <a
              href="/#testimonials"
              onClick={(e) => handleScrollTo(e, 'testimonials')}
              className="px-3.5 py-1 text-sm font-medium text-gray-700 hover:text-indigo-600 rounded-full hover:bg-white dark:hover:bg-gray-700/80 transition-all dark:text-gray-300 dark:hover:text-indigo-400"
            >
              Testimonials
            </a>
          </div>

          {/* Right: Theme Toggle & Desktop Auth */}
          <div className="hidden md:flex flex-1 items-center justify-end gap-3">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-gray-50/50 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all active:scale-95 cursor-pointer dark:border-gray-800 dark:bg-gray-800/60 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-amber-400 transform rotate-0 transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="h-4 w-4 text-indigo-600 transform rotate-0 transition-transform duration-300 hover:-rotate-12" />
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden lg:block">{user.name}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all cursor-pointer dark:border-gray-800 dark:text-gray-400 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                  title="Logout"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors dark:text-gray-300 dark:hover:text-indigo-400"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Actions: Theme Toggle + Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100 cursor-pointer dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-indigo-600" />}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-lg dark:border-gray-800 dark:bg-gray-900/95">
          <div className="mx-auto max-w-7xl px-4 py-4 space-y-3">
            {user && (
              <div className="flex items-center gap-3 border-b border-gray-100 pb-3 dark:border-gray-800">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{user.name}</p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
            )}

            {user && (
              <Link
                to="/dashboard"
                onClick={closeMenu}
                className="block rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                Dashboard
              </Link>
            )}
            <a
              href="/#features"
              onClick={(e) => handleScrollTo(e, 'features')}
              className="block rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Features
            </a>
            <a
              href="/#testimonials"
              onClick={(e) => handleScrollTo(e, 'testimonials')}
              className="block rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              Testimonials
            </a>

            {user ? (
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-red-950/30 dark:hover:text-red-400 mt-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            ) : (
              <div className="flex flex-col gap-2 border-t border-gray-100 pt-3 mt-2 dark:border-gray-800">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="block w-full rounded-xl border border-gray-200 px-3 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="block w-full rounded-xl bg-indigo-600 px-3 py-2.5 text-center text-sm font-medium text-white shadow-md hover:bg-indigo-700"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;