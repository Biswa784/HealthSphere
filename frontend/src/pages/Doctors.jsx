import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Doctors = () => {
  const doctors = [
    {
      id: 1,
      name: 'Dr. John Doe',
      specialization: 'Cardiologist',
      image: '/images/doctors/dr-john.jpg',
      experience: '15 years'
    },
    {
      id: 2,
      name: 'Dr. Jane Smith',
      specialization: 'Neurologist',
      image: '/images/doctors/dr-jane.jpg',
      experience: '12 years'
    },
    {
      id: 3,
      name: 'Dr. Emily Brown',
      specialization: 'Orthopedic Surgeon',
      image: '/images/doctors/dr-emily.jpg',
      experience: '10 years'
    },
    {
      id: 1,
      name: 'Dr. John Doe',
      specialization: 'Cardiologist',
      image: '/images/doctors/dr-john.jpg',
      experience: '15 years'
    },
    {
      id: 2,
      name: 'Dr. Jane Smith',
      specialization: 'Neurologist',
      image: '/images/doctors/dr-jane.jpg',
      experience: '12 years'
    },
    {
      id: 3,
      name: 'Dr. Emily Brown',
      specialization: 'Orthopedic Surgeon',
      image: '/images/doctors/dr-emily.jpg',
      experience: '10 years'
    },
    // Add more doctors as needed
  ];

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-blue-600">
          Our Expert Doctors
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <div 
              key={doctor.id}
              className="relative group overflow-hidden rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              {/* Doctor Image */}
              <div className="h-80 relative">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h3 className="text-2xl font-bold mb-2">{doctor.name}</h3>
                    <p className="text-lg">{doctor.specialization}</p>
                    <p className="text-sm mt-2">{doctor.experience} experience</p>
                    <button className="mt-4 bg-white text-blue-600 px-6 py-2 rounded-full hover:bg-blue-100 transition-colors">
                      View Profile
                    </button>
        
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Doctors;