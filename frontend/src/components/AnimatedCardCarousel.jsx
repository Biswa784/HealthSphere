import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";

const AnimatedCardCarousel = () => {
  const cards = [
    {
      id: 1,
      title: "Card 1",
      image: "images/pexels-shkrabaanthony-5215006.jpg",
    },
    { id: 2, title: "Card 2", image: "images/Pulmonology.jpeg" },
    { id: 3, title: "Card 3", image: "images/Gastroenterology.jpg" },
    { id: 4, title: "Card 4", image: "images/Radiology.jpg" },
    { id: 5, title: "Card 5", image: "images/Emergency.jpg" },
    { id: 6, title: "Card 6", image: "images/Radiology.jpg" },
  ];

  return (
    <div
      className="relative mx-auto py-10 overflow-hidden"
      style={{
        backgroundImage: "url('images/Ministry-of-tribal.png')", // Add your background image path here
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background Blur Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-500 to-green-500 opacity-40 blur-3xl"></div>

      {/* Heading */}
      <h1
        className="text-2xl font-bold text-center text-white mb-5 relative z-10"
        style={{ fontFamily: "'Portal Canva', sans-serif" }} // Use the Portal Canva font
      >
        Our Facilities
      </h1>

      {/* Swiper Carousel */}
      <Swiper
        slidesPerView={3}
        spaceBetween={20}
        loop={true}
        speed={5000} // Smooth animation
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          reverseDirection: true, // Moves left to right
        }}
        modules={[Autoplay]}
        className="relative w-full"
      >
        {cards.map((card) => (
          <SwiperSlide key={card.id}>
            <motion.div
              whileHover={{ scale: 1.1 }} // Animation on hover
              transition={{ duration: 0.3 }}
              className="w-60 h-40 bg-white shadow-xl rounded-lg overflow-hidden"
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover"
              />
              <div className="p-2 text-center font-bold text-gray-800">
                {card.title}
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AnimatedCardCarousel;
