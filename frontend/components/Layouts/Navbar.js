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
  Home,
  Phone,
  Shield,
} from 'lucide-react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleSearch = () => setSearchOpen((prev) => !prev);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);

    const userJson = localStorage.getItem('kazilinkUser');
    if (userJson) {
      setUser(JSON.parse(userJson));
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const profileLink =
    user?.role === 'employer'
      ? '/employer/dashboard'
      : user?.role === 'worker'
      ? '/worker/dashboard'
      : '#';

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
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
<<<<<<< HEAD
            {/* Links */}
            <div className="flex space-x-8">
              <NavItem href="/" label="Home" icon={<Home size={18} />} />
              <NavItem href="/contact" label="Contact" icon={<Phone size={18} />} />
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
                href="/signin"
                className="flex items-center space-x-1.5 text-gray-700 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50"
              >
                <LogIn className="w-4 h-4" />
                <span className="font-medium">Login</span>
              </Link>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-indigo-600 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center space-x-1.5 shadow-md hover:shadow-indigo-200"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </Link>
            </div>
=======
            <NavItem href="/" label="Home" icon={<Home size={18} />} />
            {user?.isLoggedIn && (
              <>
                <NavItem href="/contact" label="Contact" icon={<Phone size={18} />} />
                <button
                  onClick={toggleSearch}
                  className="ml-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5 text-gray-600" />
                </button>
                <Link
                  href={profileLink}
                  className="ml-4 flex items-center space-x-1.5 text-gray-700 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50"
                >
                  <User className="w-4 h-4" />
                  <span className="font-medium">Profile</span>
                </Link>
              </>
            )}
            {!user?.isLoggedIn && (
              <div className="flex items-center space-x-4 ml-6">
                <Link
                  href="/signin"
                  className="flex items-center space-x-1.5 text-gray-700 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="font-medium">Login</span>
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-indigo-600 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center space-x-1.5 shadow-md hover:shadow-indigo-200"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register</span>
                </Link>
              </div>
            )}
>>>>>>> 1e4ac84 (initial commit)
          </div>

          {/* Mobile Menu Buttons */}
          <div className="flex lg:hidden items-center space-x-4">
            {user?.isLoggedIn && (
              <button
                onClick={toggleSearch}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>
            )}
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
        {user?.isLoggedIn && (searchOpen || menuOpen) && (
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
          <div className="lg:hidden mt-2 space-y-3 pb-6">
            <MobileNavItem href="/" label="Home" icon={<Home size={18} />} onClick={toggleMenu} />
<<<<<<< HEAD
            <MobileNavItem href="/benefits" label="Benefits" icon={<Shield size={18} />} onClick={toggleMenu} />
            <MobileNavItem href="/contact" label="Contact" icon={<Phone size={18} />} onClick={toggleMenu} />
            <div className="pt-2 space-y-3 border-t border-gray-100 mt-2">
              <MobileNavItem href="/signin" label="Login" icon={<LogIn size={18} />} onClick={toggleMenu} />
              <Link
                href="/signup"
                className="flex items-center space-x-2 justify-center bg-gradient-to-r from-indigo-600 to-purple-500 text-white px-4 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md"
                onClick={toggleMenu}
              >
                <UserPlus className="w-5 h-5" />
                <span>Register</span>
              </Link>
            </div>
=======
            {user?.isLoggedIn ? (
              <>
                <MobileNavItem href="/contact" label="Contact" icon={<Phone size={18} />} onClick={toggleMenu} />
                <MobileNavItem href={profileLink} label="Profile" icon={<User size={18} />} onClick={toggleMenu} />
              </>
            ) : (
              <div className="pt-2 space-y-3 border-t border-gray-100 mt-2">
                <MobileNavItem href="/signin" label="Login" icon={<LogIn size={18} />} onClick={toggleMenu} />
                <Link
                  href="/signup"
                  className="flex items-center space-x-2 justify-center bg-gradient-to-r from-indigo-600 to-purple-500 text-white px-4 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-md"
                  onClick={toggleMenu}
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Register</span>
                </Link>
              </div>
            )}
>>>>>>> 1e4ac84 (initial commit)
          </div>
        )}
      </div>

      {/* Desktop Search Panel */}
<<<<<<< HEAD
      {searchOpen && (
=======
      {user?.isLoggedIn && searchOpen && (
>>>>>>> 1e4ac84 (initial commit)
        <div className="hidden lg:block absolute top-20 left-0 w-full bg-white shadow-md py-4 px-6 border-t border-gray-100">
          <div className="max-w-7xl mx-auto relative">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs, skills or workers..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <button
              onClick={toggleSearch}
              className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-700"
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
      className="relative group text-gray-700 hover:text-indigo-600 transition-colors flex items-center space-x-1.5 px-2 py-1 rounded-lg hover:bg-gray-50"
    >
      {icon && <span className="text-indigo-500">{icon}</span>}
      <span className="font-medium">{label}</span>
      <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-4/5"></span>
    </Link>
  );
}

// Reusable Nav Item for mobile
function MobileNavItem({ href, label, icon, onClick }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex items-center space-x-3 text-gray-700 hover:text-indigo-600 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
    >
      {icon && <span className="text-indigo-500">{icon}</span>}
      <span className="font-medium">{label}</span>
    </Link>
  );
}
