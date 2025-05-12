import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import DoctorSidebar from "../components/DoctorSidebar";
import { motion } from "framer-motion";
import { io } from "socket.io-client";

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [opdAppointments, setOpdAppointments] = useState([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [doctorName, setDoctorName] = useState("");
  const [doctorCategory, setDoctorCategory] = useState("");
  const [department, setDepartment] = useState("");
  const [socket, setSocket] = useState(null);
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();

  // Connect to WebSocket server
  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    return () => newSocket.disconnect(); // Cleanup on unmount
  }, []);

  // Fetch doctor's details and appointments
  useEffect(() => {
    fetchDoctorDetails();
    fetchApprovedAppointments();
    fetchOpdAppointments();
  }, []);

  // Fetch doctor's details based on role from the database
  const fetchDoctorDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect to login if no token is found
        return;
      }

      const response = await fetch("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const data = await response.json();
      console.log("User API Response:", data); // Debugging log

      // Check if the user is a doctor
      if (data.role === "doctor") {
        setDoctorName(`${data.firstName || ""} ${data.lastName || ""}`.trim() || "Unknown");
        setDoctorCategory(data.category || "Unknown");
        setIsAvailable(data.availability || false);

        // Join the doctor's room in the WebSocket
        if (socket) {
          socket.emit("joinDoctorRoom", data._id);
          socket.on("newAppointment", (appointment) => {
            setAppointments((prevAppointments) => [appointment, ...prevAppointments]);
          });
        }
      } else {
        console.error("Access Denied: User is not a doctor");
        setDoctorName("Access Denied");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setDoctorName("Error Loading");
    }
  };

  // Fetch approved appointments for the doctor
  const fetchApprovedAppointments = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/appointments/doctor-appointments");
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // Fetch OPD appointments for the doctor
  const fetchOpdAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("http://localhost:5000/api/appointments/doctor-opd-appointments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch OPD appointments");
      }

      const data = await response.json();
      setOpdAppointments(data);
    } catch (error) {
      console.error("Error fetching OPD appointments:", error);
    }
  };

  // Update doctor's availability
  const updateAvailability = async (availability) => {
    if (!department) {
      alert("Please select a department");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/doctors/update-availability", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ availability, department }),
      });

      const data = await response.json();
      console.log("Availability Response:", data); // Debugging log

      if (response.ok) {
        setIsAvailable(availability);
        alert(`You are now ${availability ? "available" : "unavailable"} in ${department}`);
      } else {
        alert(data.message || "Failed to update availability");
      }
    } catch (error) {
      console.error("Error updating availability:", error);
      alert("An error occurred while updating availability");
    }
  };

  // Handle appointment status (accept/reject)
  const handleAppointmentStatus = async (appointmentId, status) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not authorized. Please log in.");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/appointments/${appointmentId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(`Appointment ${status}`);
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment._id === appointmentId ? { ...appointment, status } : appointment
          )
        );
      } else {
        alert(data.message || "Failed to update appointment status");
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
    }
  };

  // Add doctor notes to an OPD appointment
  const addDoctorNotes = async (appointmentId, notes) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not authorized. Please log in.");
        navigate("/login");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/appointments/${appointmentId}/notes`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ notes }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert("Notes added successfully");
        fetchOpdAppointments(); // Refresh OPD appointments
      } else {
        alert(data.message || "Failed to add notes");
      }
    } catch (error) {
      console.error("Error adding notes:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <DoctorSidebar />
        <div className="flex-1 p-6 bg-gray-100">
          {/* Welcome Message */}
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-6"
          >
            Welcome, Dr. {doctorName || "Loading..."}
          </motion.h1>

          {/* Availability Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-lg shadow-md mb-6"
          >
            <h2 className="text-2xl font-semibold mb-4">Set Availability</h2>
            <div className="flex items-center space-x-4">
              <p className="text-lg font-medium">
                Category: <span className="font-bold">{doctorCategory}</span>
              </p>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="p-2 border rounded"
              >
                <option value="">Select Department</option>
                <option value="cardiologist">Cardiologist</option>
                <option value="dentist">Dentist</option>
                <option value="general">General Physician</option>
                <option value="neurologist">Neurologist</option>
                <option value="orthopedic">Orthopedic</option>
              </select>
              <button
                onClick={() => updateAvailability(true)}
                className={`px-4 py-2 rounded-lg ${isAvailable ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"} transition-all duration-300`}
              >
                Available
              </button>
              <button
                onClick={() => updateAvailability(false)}
                className={`px-4 py-2 rounded-lg ${!isAvailable ? "bg-red-500 text-white" : "bg-gray-200 text-gray-700"} transition-all duration-300`}
              >
                Unavailable
              </button>
            </div>
          </motion.div>

          {/* Appointments Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-md mb-6"
          >
            <h2 className="text-2xl font-semibold mb-4">Appointment Requests</h2>
            {appointments.length === 0 ? (
              <p>No appointments yet.</p>
            ) : (
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Patient Name</th>
                    <th className="px-4 py-2 border">Phone</th>
                    <th className="px-4 py-2 border">Email</th>
                    <th className="px-4 py-2 border">Date</th>
                    <th className="px-4 py-2 border">Symptoms</th>
                    <th className="px-4 py-2 border">Status</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment._id} className="text-center">
                      <td className="px-4 py-2 border">
                        {appointment.patientId?.firstName} {appointment.patientId?.lastName}
                      </td>
                      <td className="px-4 py-2 border">{appointment.patientId?.phoneNumber}</td>
                      <td className="px-4 py-2 border">{appointment.patientId?.email}</td>
                      <td className="px-4 py-2 border">
                        {new Date(appointment.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2 border">{appointment.symptoms}</td>
                      <td className="px-4 py-2 border">{appointment.status || "Pending"}</td>
                      <td className="px-4 py-2 border">
                        {appointment.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleAppointmentStatus(appointment._id, "accepted")}
                              className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleAppointmentStatus(appointment._id, "rejected")}
                              className="bg-red-500 text-white px-2 py-1 rounded"
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
          </motion.div>

          {/* OPD Appointments Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <h2 className="text-2xl font-semibold mb-4">OPD Appointments</h2>
            {opdAppointments.length === 0 ? (
              <p>No OPD appointments found.</p>
            ) : (
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">Patient Name</th>
                    <th className="px-4 py-2 border">Symptoms</th>
                    <th className="px-4 py-2 border">Doctor Notes</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {opdAppointments.map((appointment) => (
                    <tr key={appointment._id} className="text-center">
                      <td className="px-4 py-2 border">
                        {appointment.patientId?.firstName} {appointment.patientId?.lastName}
                      </td>
                      <td className="px-4 py-2 border">{appointment.symptoms}</td>
                      <td className="px-4 py-2 border">{appointment.doctorNotes || "No notes yet"}</td>
                      <td className="px-4 py-2 border">
                        <textarea
                          placeholder="Add notes..."
                          className="w-full p-2 border border-gray-300 rounded"
                          onChange={(e) => setNotes(e.target.value)}
                        />
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600"
                          onClick={() => addDoctorNotes(appointment._id, notes)}
                        >
                          Submit Notes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;