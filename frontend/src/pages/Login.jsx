import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Lottie from 'lottie-react';
import cartoonAnimation from '../assets/Animation - 1740681871213.json'; // Ensure correct path
import successAnimation from '../assets/Animation - 1742411731130.json'; // Import your success animation

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showCartoon, setShowCartoon] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (!showCartoon && value.trim() !== '') {
      setShowCartoon(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log('Login Response:', data);

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('userId', data.user.user);
        setLoginSuccess(true); // Set login success to true

        // Wait for 3 seconds before navigating
        setTimeout(() => {
          if (data.user && data.user.role) {
            switch (data.user.role) {
              case 'patient':
                navigate('/patient-dashboard');
                break;
              case 'hospital':
                navigate('/hospital-dashboard');
                break;
              case 'doctor':
                navigate('/doctor-dashboard');
                break;
              case 'superadmin':
                navigate('/superadmin-dashboard');
                break;
              default:
                navigate('/');
            }
          } else {
            alert('Invalid user data received');
          }
        }, 3000); // 3 seconds delay
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cover bg-center" style={{ backgroundImage: "url('/images/background.jpg')" }}>
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4">
        {loginSuccess ? (
          <div className="flex flex-col items-center justify-center">
            <Lottie animationData={successAnimation} loop={false} className="w-48 h-48" />
            <p className="text-2xl font-bold text-[#BDD9D7] mt-4">Login Successful!</p>
          </div>
        ) : (
          <div className="max-w-md w-full space-y-8 bg-[#03363D] p-8 rounded-lg shadow-2xl shadow-gray-800/50 transform transition-all hover:scale-105">
            <h2 className="text-center text-3xl font-extrabold text-[#BDD9D7]">Log in to your account</h2>
            <p className="text-center text-sm text-[#BDD9D7]">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300 transition">Register here</Link>
            </p>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <input
                  type="email"
                  name="email"
                  required
                  className="w-full px-3 py-2 border border-gray-500 rounded-md bg-[#BDD9D7] text-[#03363D] placeholder-gray-700"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
                <input
                  type="password"
                  name="password"
                  required
                  className="w-full px-3 py-2 border border-gray-500 rounded-md bg-[#BDD9D7] text-[#03363D] placeholder-gray-700"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {showCartoon && (
                <div className="flex justify-center animate-bounce">
                  <Lottie animationData={cartoonAnimation} loop={true} className="w-24 h-24" />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-300 shadow-lg shadow-blue-500/50 hover:shadow-blue-700/50"
              >
                Log in
              </button>
            </form>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Login;