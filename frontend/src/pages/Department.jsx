import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import DepartmentCard from '../components/DepartmentCard';

const Department = () => {
  const departments = [
    {
      image: '/images/cardiology.jpg',
      name: 'Cardiology',
      description: 'Expert care for heart-related conditions.',
    },
    {
      image: '/images/neurology.jpg',
      name: 'Neurology',
      description: 'Advanced treatment for neurological disorders.',
    },
    {
      image: '/images/orthopedics.jpg',
      name: 'Orthopedics',
      description: 'Specialized care for bone and joint issues.',
    },
    {
      image: '/images/pediatrics.jpg',
      name: 'Pediatrics',
      description: 'Comprehensive care for children and adolescents.',
    },
    {
      image: '/images/dermatology.jpg',
      name: 'Dermatology',
      description: 'Treatment for skin, hair, and nail conditions.',
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Our Departments</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((department, index) => (
            <DepartmentCard
              key={index}
              image={department.image}
              name={department.name}
              description={department.description}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Department;