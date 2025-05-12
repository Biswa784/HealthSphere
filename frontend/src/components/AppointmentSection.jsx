import React from "react";
import { useNavigate } from "react-router-dom";

const AppointmentSection = () => {
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate("/verify-user"); // Redirect to verification page first
  };

  return (
    <div className="py-10" style={{ backgroundColor: "#FEF1E6" }}>
      <div className="container mx-auto text-center">
        {/* Heading with Color #722F37 */}
        <h2 className="text-3xl font-bold mb-4" style={{ color: "#722F37" }}>
          Online Appointment
        </h2>

        {/* Paragraph with Color #722F37 */}
        <p className="mb-6" style={{ color: "#722F37" }}>
          Book your appointment online easily and quickly.
        </p>

        {/* Button with Custom Styling */}
        <button
          onClick={handleBookNow}
          className="px-6 py-2 rounded transition duration-300"
          style={{
            backgroundColor: "#722F37",
            color: "#FAF5EE",
            border: "2px solid #722F37",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#FAF5EE";
            e.target.style.color = "#722F37";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#722F37";
            e.target.style.color = "#FAF5EE";
          }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
};

export default AppointmentSection;