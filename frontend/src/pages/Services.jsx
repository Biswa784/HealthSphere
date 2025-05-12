import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Services = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        {/* Heading with Combo Color */}
        <h1 className="text-3xl font-bold mb-4" style={{ color: "#FEF1E6" }}>
          Our Services
        </h1>
        <p className="text-lg mb-4" style={{ color: "#FC350B" }}>
          We offer a wide range of healthcare services to meet your needs.
        </p>

        {/* Grid of Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 24 Hours Service */}
          <div
            className="p-6 shadow-lg rounded transform transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: "#FAF5EE" }}
          >
            <h3 className="text-xl font-bold mb-2" style={{ color: "#FC350B" }}>
              24 Hours Service
            </h3>
            <p style={{ color: "#1D503A" }}>
              We provide round-the-clock services for your health needs.
            </p>
          </div>

          {/* Timing Schedule */}
          <div
            className="p-6 shadow-lg rounded transform transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: "#1D503A" }}
          >
            <h3 className="text-xl font-bold mb-2" style={{ color: "#FEF1E6" }}>
              Timing Schedule
            </h3>
            <p style={{ color: "#FAF5EE" }}>
              Flexible timing to suit your schedule.
            </p>
          </div>

          {/* Emergency Cases */}
          <div
            className="p-6 shadow-lg rounded transform transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: "#722F37" }}
          >
            <h3 className="text-xl font-bold mb-2" style={{ color: "#FEF1E6" }}>
              Emergency Cases
            </h3>
            <p style={{ color: "#FAF5EE" }}>
              Immediate attention for emergency cases.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Services;