import React from 'react';
import Navbar from '../components/Navbar';
import Banner from '../components/SliderBanner';
import HeroSection from '../components/HeroSection';
import AnimatedCardCarousel from "../components/AnimatedCardCarousel";
import ServicesSection from '../components/ServicesSection';
import AppointmentSection from '../components/AppointmentSection';
import WorkingHoursSection from '../components/WorkingHoursSection';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="bg-white text-black dark:bg-gray-900 dark:text-white min-h-screen">
  {/* Page content */}

      <Navbar />
      <Banner/>
      <HeroSection />
      <AnimatedCardCarousel /> 
      <ServicesSection />
      <AppointmentSection />
      <WorkingHoursSection />
      <Footer />
    </div>
  );
};

export default Home;