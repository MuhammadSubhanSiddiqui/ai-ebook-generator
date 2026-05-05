import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">AI eBook Creator</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex gap-6">
            {userInfo && (
              <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-indigo-600">Dashboard</Link>
            )}
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-indigo-600">Features</a>
            <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-indigo-600">Testimonials</a>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {userInfo ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="hidden sm:block">{userInfo.name}</span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
                  Log in
                </Link>
                <Link to="/signup" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;