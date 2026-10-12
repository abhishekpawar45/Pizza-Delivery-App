import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ cartCount = 0 }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-gray-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl transition-transform duration-300 group-hover:rotate-12">🍕</span>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-red-600 to-amber-500 bg-clip-text text-transparent">
            PizzaHub
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            to="/builder"
            className="text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors"
          >
            Custom Builder
          </Link>
          
          {user?.role === 'admin' && (
            <Link
              to="/admin/dashboard"
              className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200"
            >
              Admin Panel
            </Link>
          )}

          {/* Cart Icon / Button */}
          <Link
            to="/cart"
            className="relative p-2 text-gray-700 hover:text-red-600 transition-colors"
          >
            <span className="text-xl">🛒</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Profile / Auth */}
          {token ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-gray-500 hidden sm:inline-block">
                Hi, <b className="text-gray-800">{user.name?.split(' ')[0] || 'User'}</b>
              </span>
              <button
                onClick={handleLogout}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-xs font-semibold px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow transition-all"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;