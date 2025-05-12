import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PrescribeMedicine = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/api/doctor/prescribe-medicine/${appointmentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicine }),
      });

      if (response.ok) {
        alert('Medicine prescribed successfully!');
        navigate('/doctor-dashboard');
      } else {
        alert('Failed to prescribe medicine');
      }
    } catch (error) {
      console.error('Error prescribing medicine:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Prescribe Medicine</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md"
            rows="4"
            placeholder="Enter medicine details..."
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 mt-4 rounded hover:bg-blue-700">
            Submit Prescription
          </button>
        </form>
      </div>
    </div>
  );
};

export default PrescribeMedicine;
