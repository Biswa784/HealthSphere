import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
  return (
    <div
    className="absolute inset-0 w-full h-full bg-cover bg-center z-0"
    style={{ backgroundImage: "url('images/contactus.avif')" }}
  >
      {/* Background Image */}
    
      {/* Overlay with background color and font color */}
      <div className="relative z-10" style={{ backgroundColor: '#DFE8E6', color: '#A0430A' }}>
        <Navbar />
      
        <div data-aos="flip-up" className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
          <p className="text-lg mb-4">
            Reach out to us for any inquiries or appointments.
          </p>
          <div data-aos="zoom-in" className="bg-white p-6 shadow-lg rounded">
            <p><strong>Address:</strong> 1a-134/A, Odisha, INDIA</p>
            <p><strong>Email:</strong> Support@healthsphear.com</p>
            <p><strong>Phone:</strong> 001-4565-13456</p>
          </div>
        </div>
        </div>
        <Footer />
      </div>
   
  );
};

export default Contact;