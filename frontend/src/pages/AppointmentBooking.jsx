import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

const AppointmentBookingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    age: "",
    date: "",
    timing: "",
    symptoms: "",
    department: "",
    doctor: "",
  });

  const [user, setUser] = useState(null);
  const [doctors, setDoctors] = useState([]);
  // Check if user is logged in and is a patient
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== "patient") {
      alert("Only patients can book an appointment!");
      navigate("/login");
    } else {
      setUser(storedUser);
    }
  }, [navigate]);

  // Fetch doctors based on selected department and availability
  useEffect(() => {
    if (formData.department) {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You are not authorized. Please log in.");
        navigate("/login");
        return;
      }

      fetch(
        `http://localhost:5000/api/doctors?department=${formData.department}&availability=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error("Failed to fetch doctors");
          }
          return res.json();
        })
        .then((data) => {
          // Ensure the data structure matches the expected format
          if (data.success && data.message) {
            setDoctors(data.message); // Set the list of doctors
          } else {
            throw new Error("Invalid data structure received from the server");
          }
        })
        .catch((error) => {
          console.error("Error fetching doctors:", error);
          alert("Failed to fetch doctors. Please try again.");
        });
    }
  }, [formData.department, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  console.log(doctors);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const user = JSON.parse(localStorage.getItem("user")); // Get the logged-in user
      const role = user.role; // Get the user's role
  
      // Prepare the appointment data
      const appointmentData = {
        date: formData.date,
        time: formData.timing,
        symptoms: formData.symptoms,
        age: formData.age,
        department: formData.department,
      };
  
      // Include doctorId or patientId based on the user's role
      if (role === "patient") {
        // If the user is a patient, send the doctorId
        appointmentData.doctorId = formData.doctor; // Use the selected doctor's ID from the form
        appointmentData.patientId = user._id; // Include the patient's ID
      } else if (role === "doctor") {
        // If the user is a doctor, send the patientId
        appointmentData.patientId = formData.patientId; // Replace with the selected patient's ID
        appointmentData.doctorId = user._id; // Include the doctor's ID
      }
  
      // Send the appointment data to the backend
      const response = await fetch(
        "http://localhost:5000/api/appointments/book",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(appointmentData),
        }
      );
  
      const data = await response.json();
      console.log("Response:", data); // Log the response
  
      if (response.ok) {
        alert("Appointment booked successfully!");
        // Redirect to the patient dashboard or clear the form
        navigate("/patient-dashboard");
      } else {
        alert(data.message || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Error booking appointment:", error); // Log the error
      alert("An error occurred while booking the appointment. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-6 rounded-lg shadow-lg w-96"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">
            Book Appointment
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Form fields for patient details */}
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="tel"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              required
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="time"
              name="timing"
              value={formData.timing}
              onChange={handleChange}
              required
              className="w-full p-2 mb-2 border rounded"
            />
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              required
              className="w-full p-2 mb-2 border rounded"
            >
              <option value="">Select </option>
              <option value="cardiologist">Cardiologist</option>
              <option value="dentist">Dentist</option>
              <option value="general">General Physician</option>
              <option value="neurologist">Neurologist</option>
              <option value="orthopedic">Orthopedic</option>
            </select>
            <select
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              required
              className="w-full p-2 mb-2 border rounded"
            >
              <option value="">Select Doctor</option>
              {doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.user.firstName} {doctor.user.lastName}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No available doctors
                </option>
              )}
            </select>
            <textarea
              name="symptoms"
              placeholder="Describe your symptoms..."
              value={formData.symptoms}
              onChange={handleChange}
              required
              className="w-full p-2 mb-2 border rounded"
            ></textarea>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 mt-4 rounded hover:bg-blue-700 transition-all duration-300"
            >
              Book Appointment
            </button>
          </form>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default AppointmentBookingPage;







