import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const [showSidebar, setShowSidebar] = useState(true); // State to control sidebar visibility

  return (
    <div>
      <Navbar />
      <div className="flex">
        {showSidebar && <Sidebar />} {/* Conditionally render Sidebar */}
        <div className="flex-1 p-4">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          <button onClick={() => setShowSidebar(!showSidebar)}>
            Toggle Sidebar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;