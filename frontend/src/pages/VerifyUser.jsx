import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const VerifyUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Verifying user...');

  useEffect(() => {
    const checkUser = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user'));

      if (!storedUser) {
        setMessage('You need to log in first. Redirecting...');
        setTimeout(() => navigate('/login'), 2000);
        setLoading(false);
        return;
      }

      if (storedUser.role !== 'patient') {
        setMessage('Only patients can book an appointment. Redirecting...');
        setTimeout(() => navigate('/login'), 2000);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/users/check-verification/${storedUser.email}`);
        const data = await response.json();

        if (response.ok && data.verified) {
          navigate('/book-appointment');
        } else {
          setMessage('Your email is not verified. Please verify your email first.');
        }
      } catch (error) {
        console.error('Verification error:', error);
        setMessage('Error verifying email. Please try again.');
      }

      setLoading(false);
    };

    checkUser();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center p-6 bg-gray-800 shadow-lg rounded-lg animate-fade-in">
        <h2 className="text-2xl font-semibold">{loading ? 'Verifying User...' : 'Verification Status'}</h2>
        <p className="mt-2 text-gray-400">{message}</p>
        {loading && <div className="mt-4 animate-spin rounded-full h-8 w-8 border-t-2 border-blue-400"></div>}
      </div>
    </div>
  );
};

export default VerifyUser;

