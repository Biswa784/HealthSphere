import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


const DoctorProfile = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data - Replace with API call
  const doctorsData = [
    {
      id: 1,
      name: 'Dr. John Doe',
      specialization: 'Cardiologist',
      image: '/images/doctors/dr-john.jpg',
      experience: '15 years',
      education: 'MD, Cardiology (Harvard Medical School)',
      bio: 'Award-winning cardiologist with extensive experience in...',
      schedule: 'Mon-Fri: 9 AM - 5 PM',
      contact: 'john.doe@hospital.com'
    },
    // Add other doctors
  ];

  useEffect(() => {
    const fetchDoctor = () => {
      const foundDoctor = doctorsData.find(d => d.id === parseInt(id));
      setDoctor(foundDoctor);
      setLoading(false);
    };
    
    fetchDoctor();
  }, [id]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (!doctor) return <div className="text-center py-8">Doctor not found</div>;

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Doctor Header */}
          <div className="md:flex">
            <div className="md:w-1/3 p-8">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
              <div className="mt-4 text-center">
                <button className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors">
                  Book Appointment
                </button>
              </div>
            </div>
            
            <div className="md:w-2/3 p-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">{doctor.name}</h1>
              <p className="text-2xl text-blue-600 mb-4">{doctor.specialization}</p>
              
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-2">About Doctor</h2>
                  <p className="text-gray-600">{doctor.bio}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Experience</h3>
                    <p>{doctor.experience} of experience</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Education</h3>
                    <p>{doctor.education}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Contact Information</h3>
                  <p>Email: {doctor.contact}</p>
                  <p>Schedule: {doctor.schedule}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DoctorProfile;