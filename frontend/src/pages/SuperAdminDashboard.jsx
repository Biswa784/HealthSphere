import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Doughnut, Bar } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [opdBookings, setOpdBookings] = useState([]);
  const [adminName, setAdminName] = useState("");
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [bookedBeds, setBookedBeds] = useState([]);

  // Fetch logged-in admin's details
  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:5000/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch admin details");
        }

        const data = await response.json();
        setAdminName(`${data.firstName} ${data.lastName}`);
      } catch (error) {
        console.error("Error fetching admin details:", error);
      }
    };

    fetchAdminDetails();
  }, [navigate]);

  // Fetch appointments with patient and doctor details
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch("http://localhost:5000/api/appointments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [navigate]);

  // Fetch OPD bookings and related data
  useEffect(() => {
    const fetchOpdData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch OPD bookings
        const bookingsResponse = await fetch("http://localhost:5000/api/opdbooks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!bookingsResponse.ok) {
          throw new Error("Failed to fetch OPD bookings");
        }
        const bookingsData = await bookingsResponse.json();
        setOpdBookings(bookingsData);

        // Fetch departments
        const deptResponse = await fetch("http://localhost:5000/api/opdbooks/departments", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (deptResponse.ok) {
          const deptData = await deptResponse.json();
          setDepartments(deptData.departments);
        }

        // Fetch booked beds
        const bedsResponse = await fetch("http://localhost:5000/api/opdbooks/booked-beds", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (bedsResponse.ok) {
          const bedsData = await bedsResponse.json();
          setBookedBeds(bedsData.bookedBeds);
        }

      } catch (error) {
        console.error("Error fetching OPD data:", error);
      }
    };

    fetchOpdData();
  }, [navigate]);

  // Fetch doctors by department
  const fetchDoctorsByDepartment = async (department) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(
        `http://localhost:5000/api/opdbooks/available-doctors?department=${department}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setDoctors(data.doctors);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  // Update status for both appointments and OPD bookings
  const updateStatus = async (id, status, type = 'appointment') => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not authorized. Please log in.");
        navigate("/login");
        return;
      }

      const endpoint = type === 'appointment' 
        ? `http://localhost:5000/api/appointments/update-status/${id}`
        : `http://localhost:5000/api/opdbooks/update-status/${id}`;

      const response = await fetch(endpoint, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update the local state based on type
      if (type === 'appointment') {
        setAppointments(prev => prev.map(item => 
          item._id === id ? { ...item, status } : item
        ));
      } else {
        setOpdBookings(prev => prev.map(item => 
          item._id === id ? { ...item, status } : item
        ));
      }

      alert(`Status updated to ${status}`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  // Prepare data for donut chart (appointment status)
  const getAppointmentStatusData = () => {
    const statusCounts = {
      pending: 0,
      approved: 0,
      rejected: 0,
      completed: 0
    };

    appointments.forEach(app => {
      statusCounts[app.status] = (statusCounts[app.status] || 0) + 1;
    });

    return {
      labels: ['Pending', 'Approved', 'Rejected', 'Completed'],
      datasets: [
        {
          label: 'Appointments',
          data: [statusCounts.pending, statusCounts.approved, statusCounts.rejected, statusCounts.completed],
          backgroundColor: [
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 99, 132, 0.7)',
            'rgba(153, 102, 255, 0.7)'
          ],
          borderColor: [
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Prepare data for clustered bar chart (comparison between appointment types)
  const getComparisonData = () => {
    const appointmentStatusCounts = {
      pending: 0,
      approved: 0,
      rejected: 0,
      completed: 0
    };

    const opdStatusCounts = {
      pending: 0,
      approved: 0,
      rejected: 0,
      completed: 0
    };

    appointments.forEach(app => {
      appointmentStatusCounts[app.status] = (appointmentStatusCounts[app.status] || 0) + 1;
    });

    opdBookings.forEach(booking => {
      opdStatusCounts[booking.status] = (opdStatusCounts[booking.status] || 0) + 1;
    });

    return {
      labels: ['Pending', 'Approved', 'Rejected', 'Completed'],
      datasets: [
        {
          label: 'Doctor Appointments',
          data: [appointmentStatusCounts.pending, appointmentStatusCounts.approved, appointmentStatusCounts.rejected, appointmentStatusCounts.completed],
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'OPD Bookings',
          data: [opdStatusCounts.pending, opdStatusCounts.approved, opdStatusCounts.rejected, opdStatusCounts.completed],
          backgroundColor: 'rgba(153, 102, 255, 0.7)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6 bg-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Welcome, {adminName || "Admin"}
          </h1>

          {/* Charts Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Donut Chart */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Appointment Status Distribution</h2>
              <div className="h-64">
                <Doughnut 
                  data={getAppointmentStatusData()} 
                  options={{ 
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }} 
                />
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Appointments vs OPD Bookings</h2>
              <div className="h-64">
                <Bar 
                  data={getComparisonData()} 
                  options={{ 
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true
                      }
                    },
                    plugins: {
                      legend: {
                        position: 'bottom'
                      }
                    }
                  }} 
                />
              </div>
            </div>
          </div>

          {/* Appointment Approvals Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Appointment Approvals</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Patient</th>
                    <th className="border border-gray-300 px-4 py-2">Doctor</th>
                    <th className="border border-gray-300 px-4 py-2">Date</th>
                    <th className="border border-gray-300 px-4 py-2">Time</th>
                    <th className="border border-gray-300 px-4 py-2">Status</th>
                    <th className="border border-gray-300 px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length > 0 ? (
                    appointments.map((appointment) => (
                      <tr key={appointment._id} className="text-center">
                        <td className="border border-gray-300 px-4 py-2">
                          {appointment.patientId?.firstName} {appointment.patientId?.lastName}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {appointment.doctorId?.firstName} {appointment.doctorId?.lastName}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {new Date(appointment.date).toLocaleDateString()}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{appointment.time}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            appointment.status === 'approved' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {appointment.status === "pending" && (
                            <>
                              <button
                                className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
                                onClick={() => updateStatus(appointment._id, "approved", 'appointment')}
                              >
                                Approve
                              </button>
                              <button
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                onClick={() => updateStatus(appointment._id, "rejected", 'appointment')}
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="border border-gray-300 px-4 py-2 text-center text-gray-500">
                        No appointments found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* OPD Bookings Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">OPD Bookings</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Patient</th>
                    <th className="border border-gray-300 px-4 py-2">Department</th>
                    <th className="border border-gray-300 px-4 py-2">Symptoms</th>
                    <th className="border border-gray-300 px-4 py-2">Doctor</th>
                    <th className="border border-gray-300 px-4 py-2">Date & Time</th>
                    <th className="border border-gray-300 px-4 py-2">Bed</th>
                    <th className="border border-gray-300 px-4 py-2">Status</th>
                    <th className="border border-gray-300 px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {opdBookings.length > 0 ? (
                    opdBookings.map((booking) => (
                      <tr key={booking._id} className="text-center">
                        <td className="border border-gray-300 px-4 py-2">
                          {booking.patientId?.firstName} {booking.patientId?.lastName}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">{booking.department}</td>
                        <td className="border border-gray-300 px-4 py-2">{booking.symptoms}</td>
                        <td className="border border-gray-300 px-4 py-2">
                          {booking.doctor?.firstName} {booking.doctor?.lastName}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {new Date(booking.appointmentDate).toLocaleString()}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {booking.bed?.bedNumber || 'N/A'}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                            booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-purple-100 text-purple-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {booking.status === "pending" && (
                            <>
                              <button
                                className="bg-green-500 text-white px-4 py-2 rounded mr-2 hover:bg-green-600"
                                onClick={() => updateStatus(booking._id, "approved", 'opd')}
                              >
                                Approve
                              </button>
                              <button
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                onClick={() => updateStatus(booking._id, "rejected", 'opd')}
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="border border-gray-300 px-4 py-2 text-center text-gray-500">
                        No OPD bookings found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;