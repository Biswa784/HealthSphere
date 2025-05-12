import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarCheck, Clock, LogOut } from 'lucide-react'; // Lucide icons

const DoctorSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: 'Appointments', icon: <CalendarCheck className="w-5 h-5" />, path: '/doctor-dashboard' },
    { name: 'Set Availability', icon: <Clock className="w-5 h-5" />, path: '/availability' },
    { name: 'Logout', icon: <LogOut className="w-5 h-5" />, path: '/logout' },
  ];

  return (
    <div className="min-h-screen w-64 bg-[#1f2937] text-white shadow-lg p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Doctor Panel</h2>
      <ul className="space-y-3">
        {menuItems.map((item, index) => (
          <li key={index}>
            <Link
              to={item.path}
              className={`flex items-center gap-3 p-2 rounded-md transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-gray-700 text-white'
                  : 'hover:bg-gray-700 hover:text-white text-gray-300'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorSidebar;
