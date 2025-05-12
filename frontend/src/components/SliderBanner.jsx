import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules'; // Correct import path
import 'swiper/swiper-bundle.css'; // Import Swiper styles

const slides = [
  {
    id: 1,
    title: '',
    description: '',
    image: 'images/gov delhi 2.jpg',
  },
  {
    id: 2,
    title: '',
    description: '',
    image: 'images/gov delhi 3.jpg',
  },
  {
    id: 3,
    title: '',
    description: '',
    image: 'images/gov delhi 5.png',
  },
];

const SliderBanner = () => {
  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      navigation={true}
      modules={[Autoplay, Pagination, Navigation]} // Add modules here
      className="mySwiper"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="relative h-96">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-4xl font-bold">{slide.title}</h2>
                <p className="mt-4 text-xl">{slide.description}</p>
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SliderBanner;