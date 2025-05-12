import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BloodDonation = () => {
  // Static blood inventory data
  const bloodInventory = [
    { type: "A+", units: 15 },
    { type: "A-", units: 5 },
    { type: "B+", units: 12 },
    { type: "B-", units: 3 },
    { type: "O+", units: 25 },
    { type: "O-", units: 8 },
    { type: "AB+", units: 4 },
    { type: "AB-", units: 2 },
  ];

  // Chart data configuration
  const bloodChartData = {
    labels: bloodInventory.map(item => item.type),
    datasets: [
      {
        label: "Blood Units Available",
        data: bloodInventory.map(item => item.units),
        backgroundColor: [
          "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0",
          "#9966FF", "#FF9F40", "#8AC249", "#EA5545"
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Units Available"
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-red-600 mb-4">Blood Donation Center</h1>
          <p className="text-xl text-gray-600">Your donation can save lives</p>
        </section>

        {/* Blood Inventory Section */}
        <section className="mb-12 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Current Blood Inventory</h2>
          <div className="h-96">
            <Bar data={bloodChartData} options={chartOptions} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {bloodInventory.map((blood, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg text-center">
                <h3 className="text-2xl font-bold text-red-600">{blood.type}</h3>
                <p className="text-lg">{blood.units} units</p>
                <div className={`h-2 mt-2 rounded-full ${
                  blood.units < 5 ? "bg-red-500" : 
                  blood.units < 10 ? "bg-yellow-500" : "bg-green-500"
                }`}></div>
              </div>
            ))}
          </div>
        </section>

        {/* Donation and Request Forms */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Donation Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-red-600">Donate Blood</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Blood Type</label>
                <select className="w-full p-2 border border-gray-300 rounded">
                  <option value="">Select your blood type</option>
                  {bloodInventory.map((blood, index) => (
                    <option key={index} value={blood.type}>{blood.type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="123-456-7890"
                />
              </div>
              
              <button
                type="button"
                className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
              >
                Register as Donor
              </button>
            </form>
          </div>

          {/* Request Form */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">Request Blood</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Patient Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Patient's name"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Blood Type Needed</label>
                <select className="w-full p-2 border border-gray-300 rounded">
                  <option value="">Select required blood type</option>
                  {bloodInventory.map((blood, index) => (
                    <option key={index} value={blood.type}>{blood.type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Units Needed</label>
                <input
                  type="number"
                  min="1"
                  className="w-full p-2 border border-gray-300 rounded"
                  defaultValue="1"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Hospital Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Hospital name"
                />
              </div>
              
              <button
                type="button"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>

        {/* Info Section */}
        <section className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-center">Why Donate Blood?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="text-red-600 text-5xl mb-3">1</div>
              <h3 className="text-xl font-medium mb-2">Donation Takes 1 Hour</h3>
              <p className="text-gray-600">The entire process from registration to refreshment takes about an hour.</p>
            </div>
            <div className="text-center p-4">
              <div className="text-red-600 text-5xl mb-3">3</div>
              <h3 className="text-xl font-medium mb-2">Lives Saved</h3>
              <p className="text-gray-600">A single donation can save up to three lives when separated into components.</p>
            </div>
            <div className="text-center p-4">
              <div className="text-red-600 text-5xl mb-3">56</div>
              <h3 className="text-xl font-medium mb-2">Days Between Donations</h3>
              <p className="text-gray-600">You can donate whole blood every 56 days to allow your body to replenish.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BloodDonation;