import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Pie, Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const [opdBookings, setOpdBookings] = useState([]);
  const [availableBeds, setAvailableBeds] = useState(0);
  const [occupiedBeds, setOccupiedBeds] = useState(0);
  const [totalBeds, setTotalBeds] = useState(0);
  const [bloodData, setBloodData] = useState({
    "A+": 10,
    "B+": 15,
    "AB+": 5,
    "O+": 20,
    "A-": 8
  });
  const [appointmentStats, setAppointmentStats] = useState({ approved: 0, rejected: 0 });
  const [opdStats, setOpdStats] = useState({ approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hospitalName, setHospitalName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchHospitalData(),
          fetchOpdBookings(),
          fetchBedStatus(),
          fetchBloodAvailability(),
          fetchStats()
        ]);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchHospitalData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      // Mock hospital data - replace with actual API call
      const mockHospital = {
        name: "City General Hospital",
        totalBeds: 50
      };
      setHospitalName(mockHospital.name);
      setTotalBeds(mockHospital.totalBeds);
    } catch (error) {
      console.error("Error fetching hospital data:", error);
    }
  };

  const fetchOpdBookings = async () => {
    try {
      // Mock data since API is not working
      const mockData = [
        {
          _id: "1",
          firstName: "John",
          lastName: "Doe",
          phoneNumber: "1234567890",
          date: new Date(),
          time: "10:00 AM",
          bed: "General",
          bedStatus: "pending"
        },
        {
          _id: "2",
          firstName: "Jane",
          lastName: "Smith",
          phoneNumber: "9876543210",
          date: new Date(),
          time: "2:00 PM",
          bed: "ICU",
          bedStatus: "approved"
        }
      ];
      setOpdBookings(mockData);
    } catch (error) {
      console.error("Error fetching OPD bookings:", error);
      setOpdBookings([]);
    }
  };

  const fetchBedStatus = async () => {
    try {
      // Mock data - replace with actual API call
      const mockBedStatus = {
        available: 15,
        occupied: 5
      };
      setAvailableBeds(mockBedStatus.available);
      setOccupiedBeds(mockBedStatus.occupied);
    } catch (error) {
      console.error("Error fetching bed status:", error);
    }
  };

  const fetchBloodAvailability = async () => {
    try {
      // Mock data
      setBloodData({
        "A+": 10,
        "B+": 15,
        "AB+": 5,
        "O+": 20,
        "A-": 8
      });
    } catch (error) {
      console.error("Error fetching blood availability:", error);
    }
  };

  const fetchStats = async () => {
    try {
      // Mock data
      setAppointmentStats({ approved: 25, rejected: 5 });
      setOpdStats({ approved: 18, rejected: 2 });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleBedApproval = async (bookingId, action) => {
    try {
      // Mock implementation
      setOpdBookings(prev => 
        prev.map(booking => 
          booking._id === bookingId 
            ? { ...booking, bedStatus: action === "approve" ? "approved" : "rejected" } 
            : booking
        )
      );
      
      if (action === "approve") {
        setAvailableBeds(prev => prev - 1);
        setOccupiedBeds(prev => prev + 1);
      }
      
      alert(`Bed booking ${action === "approve" ? "approved" : "rejected"}`);
    } catch (error) {
      console.error("Error updating bed status:", error);
    }
  };

  const bedPieData = {
    labels: ["Available Beds", "Occupied Beds"],
    datasets: [
      {
        data: [availableBeds, occupiedBeds],
        backgroundColor: ["#34d399", "#f87171"],
        borderWidth: 1,
      },
    ],
  };

  const bloodPieData = {
    labels: Object.keys(bloodData),
    datasets: [
      {
        data: Object.values(bloodData),
        backgroundColor: ["#e11d48", "#2563eb", "#10b981", "#f59e0b", "#8b5cf6"],
        borderWidth: 1,
      },
    ],
  };

  const approvalDonutData = {
    labels: ["OPD Approved", "OPD Rejected"],
    datasets: [
      {
        data: [opdStats.approved, opdStats.rejected],
        backgroundColor: ["#16a34a", "#dc2626"],
        borderWidth: 1,
      },
    ],
  };

  const appointmentBarData = {
    labels: ["Approved Appointments", "Rejected Appointments"],
    datasets: [
      {
        label: "Appointment Status",
        data: [appointmentStats.approved, appointmentStats.rejected],
        backgroundColor: ["#3b82f6", "#ef4444"],
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const appointmentBarOptions = {
    ...chartOptions,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 p-6 bg-gray-100 flex items-center justify-center">
            <div className="text-xl">Loading dashboard data...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 p-6 bg-gray-100 flex items-center justify-center">
            <div className="text-xl text-red-500">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6 bg-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Hospital Management Dashboard</h1>
            <div className="text-lg font-semibold text-blue-600">
              Welcome, {hospitalName || "Hospital Manager"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-2">Total Beds</h2>
              <div className="text-2xl font-bold text-center py-4">{totalBeds}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-2">Available Beds</h2>
              <div className="text-2xl font-bold text-center py-4 text-green-600">{availableBeds}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-2">Occupied Beds</h2>
              <div className="text-2xl font-bold text-center py-4 text-red-600">{occupiedBeds}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-2">Occupancy Rate</h2>
              <div className="text-2xl font-bold text-center py-4">
                {totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0}%
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-lg h-64">
              <h2 className="text-lg font-semibold mb-2">Bed Availability</h2>
              <div className="h-48">
                <Pie data={bedPieData} options={chartOptions} />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg h-64">
              <h2 className="text-lg font-semibold mb-2">Blood Availability</h2>
              <div className="h-48">
                <Pie data={bloodPieData} options={chartOptions} />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg h-64">
              <h2 className="text-lg font-semibold mb-2">OPD Booking Status</h2>
              <div className="h-48">
                <Doughnut data={approvalDonutData} options={chartOptions} />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-lg h-64">
              <h2 className="text-lg font-semibold mb-2">Appointment Status</h2>
              <div className="h-48">
                <Bar data={appointmentBarData} options={appointmentBarOptions} />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">OPD Bed Approvals</h2>
            {opdBookings.length === 0 ? (
              <div className="text-center py-4">No OPD bookings found</div>
            ) : (
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Patient</th>
                    <th className="border border-gray-300 px-4 py-2">Phone</th>
                    <th className="border border-gray-300 px-4 py-2">Date</th>
                    <th className="border border-gray-300 px-4 py-2">Time</th>
                    <th className="border border-gray-300 px-4 py-2">Requested Bed</th>
                    <th className="border border-gray-300 px-4 py-2">Status</th>
                    <th className="border border-gray-300 px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {opdBookings.map((booking) => (
                    <tr key={booking._id} className="text-center">
                      <td className="border border-gray-300 px-4 py-2">
                        {booking.firstName} {booking.lastName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{booking.phoneNumber}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(booking.date).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{booking.time}</td>
                      <td className="border border-gray-300 px-4 py-2">{booking.bed}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span className={`px-2 py-1 rounded-full ${
                          booking.bedStatus === "approved"
                            ? "bg-green-200 text-green-800"
                            : booking.bedStatus === "rejected"
                            ? "bg-red-200 text-red-800"
                            : "bg-yellow-200 text-yellow-800"
                        }`}>
                          {booking.bedStatus || "pending"}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {(!booking.bedStatus || booking.bedStatus === "pending") && (
                          <>
                            <button
                              className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
                              onClick={() => handleBedApproval(booking._id, "approve")}
                              disabled={availableBeds <= 0}
                            >
                              Approve
                            </button>
                            <button
                              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                              onClick={() => handleBedApproval(booking._id, "reject")}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;