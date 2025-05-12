import React from "react";

const ServicesSection = () => {
  return (
    <div data-aos="flip-up" className="py-10" style={{ backgroundColor: "#FEF1E6" }}>
      <div className="container mx-auto">
        {/* Heading with Color #722F37 */}
        <h2 className="text-3xl font-bold text-center mb-8" style={{ color: "#722F37" }}>
          Our Services
        </h2>

        {/* Grid of Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 24 Hours Service */}
          <div
            className="p-6 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{ backgroundColor: "#FAF5EE" }}
          >
            <h3 className="text-xl font-bold mb-2" style={{ color: "#722F37" }}>
              24 Hours Service
            </h3>
            <p style={{ color: "#1D503A" }}>
              We provide round-the-clock services for your health needs.
            </p>
          </div>

          {/* Timing Schedule */}
          <div
            className="p-6 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{ backgroundColor: "#1D503A" }}
          >
            <h3 className="text-xl font-bold mb-2" style={{ color: "#FAF5EE" }}>
              Timing Schedule
            </h3>
            <p style={{ color: "#FAF5EE" }}>
              Flexible timing to suit your schedule.
            </p>
          </div>

          {/* Emergency Cases */}
          <div
            className="p-6 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
            style={{ backgroundColor: "#722F37" }}
          >
            <h3 className="text-xl font-bold mb-2" style={{ color: "#FAF5EE" }}>
              Emergency Cases
            </h3>
            <p style={{ color: "#FAF5EE" }}>
              Immediate attention for emergency cases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;