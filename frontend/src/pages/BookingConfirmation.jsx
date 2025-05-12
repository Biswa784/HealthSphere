import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Lottie from "lottie-react";
import successAnimation from "../assets/Animation - 1742411731130.json";

const BookingConfirmation = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    navigate('/');
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full text-center">
          <Lottie 
            animationData={successAnimation} 
            loop={false} 
            className="w-48 h-48 mx-auto mb-6" 
          />
          <h2 className="text-2xl font-bold text-green-600 mb-4">Booking Confirmed!</h2>
          
          <div className="space-y-3 text-left mb-6">
            <p><span className="font-semibold">Patient:</span> {state.booking.firstName} {state.booking.lastName}</p>
            <p><span className="font-semibold">Doctor:</span> Dr. {state.booking.doctor}</p>
            <p><span className="font-semibold">Department:</span> {state.booking.department}</p>
            <p><span className="font-semibold">Date:</span> {new Date(state.booking.date).toLocaleDateString()}</p>
            <p><span className="font-semibold">Time:</span> {state.booking.time}</p>
            <p><span className="font-semibold">Bed Number:</span> 
              <span className="inline-block ml-2 px-3 py-1 bg-red-500 text-white rounded-full">
                {state.booking.bed}
              </span>
            </p>
          </div>

          <button
            onClick={() => navigate('/')}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-300"
          >
            Back to Home
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingConfirmation;