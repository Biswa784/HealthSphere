import React from "react";

const WorkingHoursSection = () => {
  return (
    <div
      className="py-20 bg-cover bg-center"
      style={{ backgroundImage: "url('images/photo-1485848395967-65dff62dc35b.avif')" }} // Add your background image path
    >
      <div className="container mx-auto text-center">
        {/* Heading with Animation */}
        <h2 className="text-4xl font-bold mb-6 text-white animate-fade-in">
          Working Hours
        </h2>

        {/* Phone Number */}
        <p className="text-2xl text-white mb-8 animate-fade-in">
          1-800-700-6200
        </p>

        {/* Two Div Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Div 1: About Hospital */}
          <div
            className="p-8 bg-white bg-opacity-90 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in"
          >
            <h3 className="text-2xl font-bold mb-4" style={{ color: "#1D503A" }}>
              About Our Hospital
            </h3>
            <p className="text-gray-700">
              Our hospital is dedicated to providing the highest quality healthcare services. With state-of-the-art facilities and a team of experienced professionals, we ensure the best care for our patients.
            </p>
          </div>

          {/* Div 2: Our Mission */}
          <div
            className="p-8 bg-white bg-opacity-90 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl animate-fade-in"
          >
            <h3 className="text-2xl font-bold mb-4" style={{ color: "#722F37" }}>
              Our Mission
            </h3>
            <p className="text-gray-700">
              Our mission is to improve the health and well-being of our community by delivering compassionate, patient-centered care. We strive to innovate and excel in all aspects of healthcare.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkingHoursSection;