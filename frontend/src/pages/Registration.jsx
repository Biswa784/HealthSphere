import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Lottie from "lottie-react";
import cartoonAnimation from "../assets/Animation - 1740681871213.json";
import successAnimation from "../assets/Animation - 1742414579967.json"; // Add your success animation JSON file

const Registration = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    role: "", // Removed default value
    licenseNumber: "", // Added for hospital role
    address: "", // Added for hospital role
  });

  const [showCartoon, setShowCartoon] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (!showCartoon && value.trim() !== "") {
      setShowCartoon(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!formData.role) {
      alert("Please select a role.");
      return;
    }

    // Validate hospital-specific fields
    if (formData.role === "hospital" && (!formData.licenseNumber || !formData.address)) {
      alert("License Number and Address are required for hospital registration.");
      return;
    }

    const payload = { ...formData };

    if (formData.role === "doctor") {
      payload.category = "Cardiologist"; // Example
      payload.department = "Cardiology"; // Example
    } else if (formData.role === "patient") {
      payload.age = 30; // Example
      payload.gender = "male"; // Example
    }

    // Debugging: Log the payload
    console.log("Payload:", payload);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Response from server:", data); // Debugging

      if (response.ok) {
        setShowSuccessAnimation(true); // Show success animation
        setTimeout(() => {
          navigate("/login"); // Redirect to login after animation
        }, 3000); // Adjust the delay as needed
      } else {
        // Handle duplicate registration or other errors
        if (data.message.includes("duplicate key error")) {
          setErrorMessage("User already exists. Please log in or use a different email.");
        } else {
          setErrorMessage(data.message || "Registration failed");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div
        className="flex-grow flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url('images/Hospital_Discharg.jpg')` }} // Add your background image path
      >
        <div
          className="max-w-md w-full space-y-8 backdrop-blur-sm p-8 rounded-lg shadow-lg"
          style={{ backgroundColor: "#1C2529" }} // Form background color
        >
          <h2 className="text-center text-3xl font-extrabold" style={{ color: "#A1D1B1" }}>
            Create an Account
          </h2>
          <p className="text-center text-sm" style={{ color: "#A1D1B1" }}>
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Log in here
            </Link>
          </p>

          {errorMessage && (
            <div className="text-red-500 text-center mb-4">{errorMessage}</div>
          )}

          {showSuccessAnimation ? (
            <div className="flex justify-center">
              <Lottie animationData={successAnimation} loop={false} className="w-48 h-48" />
            </div>
          ) : (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <input
                  type="text"
                  name="firstName"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  style={{ backgroundColor: "#1C2529", color: "#A1D1B1" }}
                />
                <input
                  type="text"
                  name="lastName"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  style={{ backgroundColor: "#1C2529", color: "#A1D1B1" }}
                />
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  style={{ backgroundColor: "#1C2529", color: "#A1D1B1" }}
                />
                <input
                  type="tel"
                  name="phoneNumber"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  style={{ backgroundColor: "#1C2529", color: "#A1D1B1" }}
                />
                <select
                  name="role"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.role}
                  onChange={handleChange}
                  style={{ backgroundColor: "#1C2529", color: "#A1D1B1" }}
                >
                  <option value="">Select Role</option>
                  <option value="patient">Patient</option>
                  <option value="doctor">Doctor</option>
                  <option value="superadmin">Super Admin</option>
                  <option value="hospital">Hospital</option>
                </select>

                {/* Hospital-specific fields */}
                {formData.role === "hospital" && (
                  <>
                    <input
                      type="text"
                      name="licenseNumber"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="License Number"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      style={{ backgroundColor: "#1C2529", color: "#A1D1B1" }}
                    />
                    <input
                      type="text"
                      name="address"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Address"
                      value={formData.address}
                      onChange={handleChange}
                      style={{ backgroundColor: "#1C2529", color: "#A1D1B1" }}
                    />
                  </>
                )}

                <input
                  type="password"
                  name="password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ backgroundColor: "#1C2529", color: "#A1D1B1" }}
                />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{ backgroundColor: "#1C2529", color: "#A1D1B1" }}
                />
              </div>

              {showCartoon && (
                <div className="flex justify-center animate-bounce">
                  <Lottie animationData={cartoonAnimation} loop={true} className="w-24 h-24" />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
              >
                Register
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Registration;