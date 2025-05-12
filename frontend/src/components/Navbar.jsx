import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSun, FaMoon } from "react-icons/fa";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const dropdownRef = useRef(null);
  const loginDropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const toggleServicesDropdown = () => setIsServicesOpen(!isServicesOpen);
  const toggleLoginDropdown = () => setIsLoginDropdownOpen(!isLoginDropdownOpen);

  // Theme toggle handler
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsServicesOpen(false);
      }
      if (loginDropdownRef.current && !loginDropdownRef.current.contains(event.target)) {
        setIsLoginDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-blue-600 dark:bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Healthsphere
        </Link>

        <ul className="flex space-x-6 items-center">
          {!user && (
            <>
              <li><Link to="/" className="hover:text-blue-200">Home</Link></li>
              <li><Link to="/about" className="hover:text-blue-200">About</Link></li>
              <li><Link to="/doctors" className="hover:text-blue-200">Doctors</Link></li>
              <li><Link to="/contact" className="hover:text-blue-200">Contact</Link></li>
            </>
          )}

          <li className="relative" ref={dropdownRef}>
            <button onClick={toggleServicesDropdown} className="hover:text-blue-200 focus:outline-none">
              Services
            </button>
            {isServicesOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -10, scale: 0.8, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                exit={{ opacity: 0, y: -10, scale: 0.8, rotateX: -90 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute bg-blue-600 dark:bg-gray-800 text-white -ml-24 mt-6 py-2 w-48 rounded-lg shadow-lg z-50 origin-top"
              >
                <li><Link to="/services" className="block px-4 py-2 hover:bg-blue-500" onClick={() => setIsServicesOpen(false)}>All Services</Link></li>
                <li><Link to="/blood-donation" className="block px-4 py-2 hover:bg-blue-500" onClick={() => setIsServicesOpen(false)}>Blood Donation</Link></li>
                <li><Link to="/online-opd-booking" className="block px-4 py-2 hover:bg-blue-500" onClick={() => setIsServicesOpen(false)}>Online OPD Booking</Link></li>
              </motion.ul>
            )}
          </li>

          {user && (
            <>
              <li><Link to="/appointment-booking" className="hover:text-blue-200">Appointment Booking</Link></li>
              <li><Link to="/profile" className="hover:text-blue-200">Profile</Link></li>
              <li><button onClick={handleLogout} className="hover:text-blue-200">Logout</button></li>
            </>
          )}

          {!user && (
            <li className="relative" ref={loginDropdownRef}>
              <button onClick={toggleLoginDropdown} className="hover:text-blue-200 focus:outline-none">
                Login
              </button>
              {isLoginDropdownOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -10, scale: 0.8, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
                  exit={{ opacity: 0, y: -10, scale: 0.8, rotateX: -90 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute bg-blue-600 dark:bg-gray-800 text-white -ml-36 mt-6 py-2 w-48 rounded-lg shadow-lg z-50 origin-top"
                >
                  <li><Link to="/login" className="block px-4 py-2 hover:bg-blue-500" onClick={() => setIsLoginDropdownOpen(false)}>Patient Login</Link></li>
                  <li><Link to="/login" className="block px-4 py-2 hover:bg-blue-500" onClick={() => setIsLoginDropdownOpen(false)}>Doctor Login</Link></li>
                  <li><Link to="/login" className="block px-4 py-2 hover:bg-blue-500" onClick={() => setIsLoginDropdownOpen(false)}>Officer / Hospital Login</Link></li>
                  <li><Link to="/login" className="block px-4 py-2 hover:bg-blue-500" onClick={() => setIsLoginDropdownOpen(false)}>Superadmin Login</Link></li>
                </motion.ul>
              )}
            </li>
          )}

          {/* Theme Toggle Icon */}
          <li>
            <button onClick={toggleTheme} className="text-white hover:text-yellow-300 transition-colors text-xl">
              {theme === "light" ? <FaMoon /> : <FaSun />}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
