'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  Search,
  User,
  Briefcase,
  LogIn,
  UserPlus,
} from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleSearch = () => setSearchOpen((prev) => !prev);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navbar top */}
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-500 rounded-lg flex items-center justify-center">
              <Briefcase className="w-4 h-4 text-white" />
            </span>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
              Kazilink
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Links */}
            <div className="flex space-x-8">
              <NavItem href="/workers" label="For Workers" icon={<User />} />
              <NavItem href="/jobs" label="For Employers" icon={<Briefcase />} />
            </div>

            {/* Search button */}
            <button
              onClick={toggleSearch}
              className="ml-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>

            {/* Auth buttons */}
            <div className="flex items-center space-x-4 ml-6">
              <Link
                href="/auth/login"
                className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </Link>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-indigo-600 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center space-x-1"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Buttons */}
          <div className="flex lg:hidden items-center space-x-4">
            <button
              onClick={toggleSearch}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={toggleMenu}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {(searchOpen || menuOpen) && (
          <div className="lg:hidden mt-2 pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs, skills or workers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/90"
              />
            </div>
          </div>
        )}

        {/* Mobile Menu Links */}
        {menuOpen && (
          <div className="lg:hidden mt-2 space-y-4 pb-6">
            <MobileNavItem href="/workers" label="For Workers" icon={<User />} onClick={toggleMenu} />
            <MobileNavItem href="/jobs" label="For Employers" icon={<Briefcase />} onClick={toggleMenu} />
            <MobileNavItem href="/auth/login" label="Login" icon={<LogIn />} onClick={toggleMenu} />
            <Link
              href="/auth/register"
              className="flex items-center space-x-2 justify-center bg-gradient-to-r from-indigo-600 to-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
              onClick={toggleMenu}
            >
              <UserPlus className="w-5 h-5" />
              <span>Register</span>
            </Link>
          </div>
        )}
      </div>

      {/* Desktop Search Panel */}
      {searchOpen && (
        <div className="hidden lg:block absolute top-20 left-0 w-full bg-white shadow-md py-4 px-6 border-t">
          <div className="max-w-7xl mx-auto relative">
            <Search className="absolute left-4 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs, skills or workers..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <button
              onClick={toggleSearch}
              className="absolute right-4 top-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

// Reusable Nav Item for desktop
function NavItem({ href, label, icon }) {
  return (
    <Link
      href={href}
      className="relative group text-gray-700 hover:text-indigo-600 transition-colors"
    >
      <div className="flex items-center space-x-1">
        {icon}
        <span>{label}</span>
      </div>
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );
}

// Reusable Nav Item for mobile
function MobileNavItem({ href, label, icon, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
