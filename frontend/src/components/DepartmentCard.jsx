import React from 'react';

const DepartmentCard = ({ image, name, description }) => {
  return (
    <div className="bg-white p-6 shadow-lg rounded-lg text-center">
      <img
        src={image}
        alt={name}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  );
};

export default DepartmentCard;