import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Doctors from './pages/Doctors';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Profile from './pages/Profile';
import BloodDonation from './pages/BloodDonation';
import OnlineOPDBooking from './pages/OnlineOPDBooking';
import PatientDashboard from './pages/PatientDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import Dashboard from './pages/Dashboard';
import BloodBankStatus from "./components/BloodBankStatus";
import AppointmentBookingPage from './pages/AppointmentBooking';
import AppointmentSection from './components/AppointmentSection';
import AppointmentBooking from './pages/AppointmentBooking';
import VerifyUser from './pages/VerifyUser';
import BookingConfirmation from './pages/BookingConfirmation';
function App() {
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    AOS.init({
      duration: 600,
      easing: "ease-in-sine",
      once: true, // Ensures animation runs only once
    });
  }, []);

  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/profile" element={<Profile />} />  
        <Route path="/blood-donation" element={<BloodDonation />} />
        <Route path="/online-opd-booking" element={<OnlineOPDBooking />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/superadmin-dashboard" element={<SuperAdminDashboard />} />

        {/* {user && user.role === 'patient' &&
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
        }
        {user && user.role === 'hospital' &&
                <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
        }
        {user && user.role === 'doctor' &&
                <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        }
        {user && user.role === 'superadmin' &&
          <Route path="/superadmin-dashboard" element={<SuperAdminDashboard />} />
        } */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/blood-bank-status" element={<BloodBankStatus />} />
        <Route path="/appointment-booking" element={<AppointmentBookingPage />} />
        <Route path="/appointment-section" element={<AppointmentSection />} />

        <Route path="/book-appointment" element={<AppointmentBooking />} /> 
        <Route path="/verify-user" element={<VerifyUser />} />
        <Route path='/booking-confirmation' element={<BookingConfirmation/>}/>
      </Routes>
    </Router>
  );
}

export default App;