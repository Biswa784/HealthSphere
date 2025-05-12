import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Sidebar = () => {
  const [user, setUser] = useState({
    name: "Loading...",
    uniqueId: "Loading...",
    lastLogin: "Loading...",
    avatar: "https://via.placeholder.com/150", // Placeholder or default avatar
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await fetch("http://localhost:5000/api/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user");

        const userData = await response.json();
        setUser({
          name: userData.name,
          uniqueId: userData.uniqueId,
          lastLogin: userData.lastLogin,
          avatar: userData.avatar,
        });

        localStorage.setItem("user", JSON.stringify(userData));
      } catch (error) {
        console.error("User fetch error:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleAvatarUpdate = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({ ...prev, avatar: reader.result }));
        localStorage.setItem(
          "user",
          JSON.stringify({ ...user, avatar: reader.result })
        );
      };
      reader.readAsDataURL(file);
    }
 };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-64 bg-green-700 text-white p-4 h-screen flex flex-col"
    >
      {/* Profile */}
      <div className="text-center mb-6">
        <div className="avatar mx-auto mb-4 relative">
          <img
            src={user.avatar}
            alt="User Avatar"
            className="rounded-full w-24 h-24 border-4 border-white"
          />
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 bg-green-600 rounded-full p-1 cursor-pointer hover:bg-green-800 transition"
          >
            <i className="fas fa-camera text-white text-sm"></i>
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpdate}
          />
        </div>
        <h5 className="text-lg font-bold">{user.name}</h5>
        <p className="text-sm text-green-200">User ID: {user.uniqueId}</p>
        <p className="text-xs text-gray-300">Last Login: {user.lastLogin}</p>
      </div>

      {/* Navigation */}
      <div className="flex-1">
        <ul className="space-y-2">
          <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/dashboard"
              className="flex items-center p-2 hover:bg-green-800 rounded-lg transition"
            >
              <i className="fas fa-home mr-3"></i>
              Dashboard
            </Link>
          </motion.li>

          <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/book-appointment"
              className="flex items-center p-2 hover:bg-green-800 rounded-lg transition"
            >
              <i className="fas fa-calendar-check mr-3"></i>
              Book Appointment
            </Link>
          </motion.li>

          <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/my-appointments"
              className="flex items-center p-2 hover:bg-green-800 rounded-lg transition"
            >
              <i className="fas fa-notes-medical mr-3"></i>
              My Appointments
            </Link>
          </motion.li>

          <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/departments"
              className="flex items-center p-2 hover:bg-green-800 rounded-lg transition"
            >
              <i className="fas fa-hospital mr-3"></i>
              Departments
            </Link>
          </motion.li>

          <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/doctors"
              className="flex items-center p-2 hover:bg-green-800 rounded-lg transition"
            >
              <i className="fas fa-user-md mr-3"></i>
              Doctors
            </Link>
          </motion.li>

          <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/chat"
              className="flex items-center p-2 hover:bg-green-800 rounded-lg transition"
            >
              <i className="fas fa-comments mr-3"></i>
              Chat
            </Link>
          </motion.li>

          <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/settings"
              className="flex items-center p-2 hover:bg-green-800 rounded-lg transition"
            >
              <i className="fas fa-cogs mr-3"></i>
              Settings
            </Link>
          </motion.li>

          <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/logout"
              className="flex items-center p-2 hover:bg-green-800 rounded-lg transition"
            >
              <i className="fas fa-sign-out-alt mr-3"></i>
              Logout
            </Link>
          </motion.li>
        </ul>
      </div>
    </motion.div>
  );
};

export default Sidebar;
