import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const OnlineOPDBooking = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    gender: "",
    symptoms: "",
    department: "",
    doctor: "",
    date: "",
    time: "",
    bed: null,
    previousAppointmentDoc: null,
    userPhoto: null,
  });

  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fileUploads, setFileUploads] = useState({
    previousAppointmentDoc: null,
    userPhoto: null,
  });
  const [bedAvailability, setBedAvailability] = useState({});
  const [socket, setSocket] = useState(null);

  // Department options
  const departments = [
    { value: "cardiologist", label: "Cardiologist" },
    { value: "dentist", label: "Dentist" },
    { value: "general", label: "General Physician" },
    { value: "neurologist", label: "Neurologist" },
    { value: "orthopedic", label: "Orthopedic" },
  ];

  // Initialize Socket.IO connection
  useEffect(() => {
    if (typeof window !== "undefined") {
      const newSocket = io("http://localhost:5000", {
        withCredentials: true,
        transports: ["websocket"],
        path: "/socket.io",
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
  
      setSocket(newSocket);
  
      newSocket.on("connect", () => {
        console.log("Socket connected!");
      });
  
      newSocket.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });
  
      return () => {
        newSocket.disconnect();
      };
    }
  }, []);
  

  // Bed status updates via Socket.IO
  useEffect(() => {
    if (!socket) return;

    socket.on("bedStatusUpdate", (updatedBed) => {
      setBedAvailability((prev) => ({
        ...prev,
        [updatedBed.number]: updatedBed.status === "available",
      }));
    });

    return () => {
      socket.off("bedStatusUpdate");
    };
  }, [socket]);

  // Check if user is logged in
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.role !== "patient") {
      alert("Only patients can book an appointment!");
      navigate("/login");
    } else {
      setFormData((prev) => ({
        ...prev,
        firstName: storedUser.firstName || "",
        lastName: storedUser.lastName || "",
        phoneNumber: storedUser.phoneNumber || "",
        gender: storedUser.gender || "",
      }));
    }
  }, [navigate]);

  // Fetch doctors when department changes
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
          if (data.success && data.message) {
            setDoctors(data.message);
          } else {
            throw new Error("Invalid data structure received from the server");
          }
        })
        .catch((error) => {
          console.error("Error fetching doctors:", error);
          setError("Failed to fetch doctors. Please try again.");
        });
    }
  }, [formData.department, navigate]);

  // Check bed availability when component mounts
  useEffect(() => {
    const checkBedAvailability = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(
          "http://localhost:5000/api/beds/availability",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setBedAvailability(data);
        }
      } catch (error) {
        console.error("Error checking bed availability:", error);
      }
    };

    checkBedAvailability();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];

    if (file) {
      if (
        name === "previousAppointmentDoc" &&
        file.type !== "application/pdf"
      ) {
        setError("Previous appointment document must be a PDF");
        return;
      }

      if (name === "userPhoto" && !file.type.match("image/jpeg|image/jpg")) {
        setError("User photo must be a JPG image");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("File size should be less than 5MB");
        return;
      }

      setFileUploads((prev) => ({
        ...prev,
        [name]: file,
      }));
      setError("");
    }
  };

  const handleBedSelection = (bedNumber) => {
      setFormData({
        ...formData,
        bed: Number(bedNumber), // Force numeric type
      });
    };
    

  const checkBedAvailability = async (bedNumber) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5000/api/beds/check/${bedNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to check bed availability");
      }

      return data.available !== false && data.message !== "Bed is occupied";
    } catch (error) {
      console.error("Bed availability check failed:", error);
      return true;
    }
  };
  const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setError("");
    
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }
    
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user._id) {
          throw new Error("Invalid user session. Please log in again.");
        }
    
        const formDataToSend = new FormData();
    
        formDataToSend.append("patient", JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          gender: formData.gender
        }));
    
        formDataToSend.append("symptoms", formData.symptoms);
        formDataToSend.append("department", formData.department);
        formDataToSend.append("doctor", formData.doctor);
        formDataToSend.append("appointmentDate", new Date(`${formData.date}T${formData.time}`).toISOString());
        formDataToSend.append("patientId", user._id);
    
        // Only append bedNumber if it's selected
        // Only append bedNumber if it's selected
if (formData.bed !== null) {
  console.log("Sending bedNumber:", Number(formData.bed));
  formDataToSend.append('bedNumber', Number(formData.bed)); // ✅ fixed here
}

      
    
        if (fileUploads.previousAppointmentDoc) {
          formDataToSend.append("document", fileUploads.previousAppointmentDoc);
        }
    
        if (fileUploads.userPhoto) {
          formDataToSend.append("image", fileUploads.userPhoto);
        }
    
        const response = await fetch("http://localhost:5000/api/opdbooks", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formDataToSend,
        });
    
        const responseText = await response.text();
    
        try {
          const data = JSON.parse(responseText);
    
          if (!response.ok) {
            throw new Error(data.message || "Failed to book appointment");
          }
    
          navigate("/booking-confirmation", {
            state: {
              booking: data.data,
              doctor: doctors.find((d) => d._id === formData.doctor),
              bedNumber: formData.bed,
            },
          });
        } catch (jsonError) {
          if (responseText.startsWith("<!DOCTYPE html>")) {
            throw new Error("Server returned an HTML error page. Check the API endpoint.");
          } else {
            throw new Error(responseText || "Server returned unexpected response");
          }
        }
      } catch (error) {
        console.error("Booking error:", error);
        setError(error.message);
      } finally {
        setIsSubmitting(false);
      }
    };
    
 
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8 text-center text-blue-800">
          Online OPD Booking
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 shadow-lg rounded-lg max-w-4xl mx-auto"
          encType="multipart/form-data"
        >
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 mb-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full p-2 mb-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full p-2 mb-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full p-2 mb-2 border rounded"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Medical Information */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Symptoms</label>
            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              className="w-full p-2 mb-2 border rounded"
              rows="3"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 mb-2">
                Previous Appointment Document (PDF)
              </label>
              <input
                type="file"
                name="previousAppointmentDoc"
                onChange={handleFileChange}
                accept=".pdf"
                className="w-full p-2 mb-2 border rounded"
              />
              {fileUploads.previousAppointmentDoc && (
                <p className="text-sm text-green-600">
                  {fileUploads.previousAppointmentDoc.name} selected
                </p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 mb-2">
                User Photo (JPG format)
              </label>
              <input
                type="file"
                name="userPhoto"
                onChange={handleFileChange}
                accept=".jpg,.jpeg"
                className="w-full p-2 mb-2 border rounded"
              />
              {fileUploads.userPhoto && (
                <p className="text-sm text-green-600">
                  {fileUploads.userPhoto.name} selected
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 mb-2">Department</label>
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
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Doctor</label>
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
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 mb-2 border rounded"
                required
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full p-2 mb-2 border rounded"
                required
              />
            </div>
          </div>

          {/* Bed Selection */}
          <div className="mb-8">
            <label className="block text-gray-700 mb-4 text-lg font-semibold">
              Select Bed Number
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {Array.from({ length: 20 }, (_, i) => i + 1).map((bed) => {
                const isAvailable = bedAvailability[bed] !== false;
                return (
                  <button
                    key={bed}
                    type="button"
                    onClick={() => isAvailable && handleBedSelection(bed)}
                    className={`p-4 border rounded-lg transition-all duration-300 ${
                      formData.bed === bed
                        ? "bg-blue-600 text-white shadow-lg transform scale-105"
                        : !isAvailable
                        ? "bg-red-200 text-red-800 cursor-not-allowed opacity-50"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                    title={
                      !isAvailable
                        ? `Bed ${bed} is occupied`
                        : `Select bed ${bed}`
                    }
                    disabled={!isAvailable}
                  >
                    {bed}
                    {!isAvailable && (
                      <span className="block text-xs mt-1">Occupied</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <button
  type="submit"
  disabled={isSubmitting}
  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
>
  {isSubmitting ? "Booking..." : "Book Appointment"}
</button>

        </form>
      </div>
      <Footer />
    </div>
  );
};

export default OnlineOPDBooking;