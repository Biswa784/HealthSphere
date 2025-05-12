import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  // Fetch appointments for the logged-in patient
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const patientId = localStorage.getItem("userId"); // Retrieve patientId from localStorage
        const token = localStorage.getItem("token"); // Retrieve token from localStorage

        if (!patientId || !token) {
          throw new Error("Patient ID or token not found in localStorage. Please log in again.");
        }

        const response = await fetch(
          `http://localhost:5000/api/appointments/patient-appointments/${patientId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        alert(error.message); // Show error message to the user
      }
    };

    fetchAppointments();
  }, []);

  // Filter appointments by status
  const approvedAppointments = appointments.filter((app) => app.status === "approved");
  const rejectedAppointments = appointments.filter((app) => app.status === "rejected");
  const pendingAppointments = appointments.filter((app) => app.status === "pending");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6 bg-gray-100">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Patient Dashboard</h1>

          {/* Approved Appointments */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Approved Appointments</h2>
            {approvedAppointments.length === 0 ? (
              <p>No approved appointments found.</p>
            ) : (
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Doctor</th>
                    <th className="border border-gray-300 px-4 py-2">Date</th>
                    <th className="border border-gray-300 px-4 py-2">Time</th>
                    <th className="border border-gray-300 px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedAppointments.map((appointment) => (
                    <tr key={appointment._id} className="text-center">
                      <td className="border border-gray-300 px-4 py-2">
                        {appointment.doctorId?.firstName} {appointment.doctorId?.lastName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(appointment.date).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{appointment.time}</td>
                      <td className="border border-gray-300 px-4 py-2">{appointment.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Rejected Appointments */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Rejected Appointments</h2>
            {rejectedAppointments.length === 0 ? (
              <p>No rejected appointments found.</p>
            ) : (
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Doctor</th>
                    <th className="border border-gray-300 px-4 py-2">Date</th>
                    <th className="border border-gray-300 px-4 py-2">Time</th>
                    <th className="border border-gray-300 px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rejectedAppointments.map((appointment) => (
                    <tr key={appointment._id} className="text-center">
                      <td className="border border-gray-300 px-4 py-2">
                        {appointment.doctorId?.firstName} {appointment.doctorId?.lastName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(appointment.date).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{appointment.time}</td>
                      <td className="border border-gray-300 px-4 py-2">{appointment.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pending Appointments */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pending Appointments</h2>
            {pendingAppointments.length === 0 ? (
              <p>No pending appointments found.</p>
            ) : (
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Doctor</th>
                    <th className="border border-gray-300 px-4 py-2">Date</th>
                    <th className="border border-gray-300 px-4 py-2">Time</th>
                    <th className="border border-gray-300 px-4 py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingAppointments.map((appointment) => (
                    <tr key={appointment._id} className="text-center">
                      <td className="border border-gray-300 px-4 py-2">
                        {appointment.doctorId?.firstName} {appointment.doctorId?.lastName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(appointment.date).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{appointment.time}</td>
                      <td className="border border-gray-300 px-4 py-2">{appointment.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* OPD Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">OPD Appointments</h2>
            {appointments.length === 0 ? (
              <p>No OPD appointments found.</p>
            ) : (
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Doctor</th>
                    <th className="border border-gray-300 px-4 py-2">Department</th>
                    <th className="border border-gray-300 px-4 py-2">Date</th>
                    <th className="border border-gray-300 px-4 py-2">Time</th>
                    <th className="border border-gray-300 px-4 py-2">Bed Number</th>
                    <th className="border border-gray-300 px-4 py-2">Status</th>
                    <th className="border border-gray-300 px-4 py-2">Doctor Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment._id} className="text-center">
                      <td className="border border-gray-300 px-4 py-2">
                        {appointment.doctorId?.firstName} {appointment.doctorId?.lastName}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{appointment.department}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(appointment.date).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{appointment.time}</td>
                      <td className="border border-gray-300 px-4 py-2">{appointment.bedNumber}</td>
                      <td className="border border-gray-300 px-4 py-2">{appointment.status}</td>
                      <td className="border border-gray-300 px-4 py-2">{appointment.doctorNotes}</td>
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

export default PatientDashboard;