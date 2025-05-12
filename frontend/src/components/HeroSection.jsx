import React, { useState } from "react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative min-h-screeen ">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent"></div>

      {/* Background Image */}
      <div
        style={{
          backgroundImage: "url('/images/medical-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: "0.2",
        }}
        className="absolute inset-0"
        aria-hidden="true"
      ></div>

      {/* Infinite Scrolling Text */}
      <div className="relative z-10 overflow-hidden whitespace-nowrap py-4 bg-green-600 text-white">
        <div className="animate-scroll-text inline-block">
          <p className="text-xl font-bold">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis
            consequuntur quae vitae, quod quo debitis soluta sunt labore optio
            dolor veniam provident sint saepe eaque cupiditate ratione, dolorum
            fugit maxime! Harum quod accusantium velit ad repellendus distinctio
            suscipit reiciendis quae ab aut earum aliquid, dolore odio minus
            consequatur corporis hic reprehenderit in incidunt. Sed quidem autem
            in nobis, doloribus eveniet rerum suscipit magni id corporis veniam
            neque sapiente laudantium amet culpa tempore blanditiis possimus
            dicta nesciunt ratione vel perspiciatis. Dolore ad commodi quidem
            fugiat, dignissimos asperiores aperiam saepe iusto! Architecto,
            itaque. Maxime, voluptatem ducimus. Harum quia enim perspiciatis
            quibusdam beatae in sunt doloremque magni recusandae, tempora error
            molestiae sed? Non molestias libero ipsa quisquam iure minima dicta
            quaerat numquam quo?
          </p>
        </div>
      </div>

      {/* Services Section */}
      <div data-aos="fade-left" className="container mt-8">
        <div className="flex flex-wrap justify-center items-center gap-4">
          {/* Patient Box */}
          <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 mb-4">
            <Link
              to="/patient"
              className="services-box flex flex-col items-center justify-center p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              style={{ backgroundColor: "#1D503A" }}
            >
              <div className="service-icon mb-4">
                <i className="fas fa-user-injured text-5xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold text-white">Patient</h3>
            </Link>
          </div>

          {/* Hospital Box */}
          <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 mb-4">
            <Link
              to="/hospital"
              className="services-box flex flex-col items-center justify-center p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              style={{ backgroundColor: "#278783" }}
            >
              <div className="service-icon mb-4">
                <i className="fas fa-hospital text-5xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold text-white">Hospital</h3>
            </Link>
          </div>

          {/* Officers Box */}
          <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 mb-4">
            <Link
              to="/officers"
              className="services-box flex flex-col items-center justify-center p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              style={{ backgroundColor: "#A0430A" }}
            >
              <div className="service-icon mb-4">
                <i className="fas fa-user-tie text-5xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold text-white">Officers</h3>
            </Link>
          </div>

          {/* Public Box */}
          <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 mb-4">
            <Link
              to="/public"
              className="services-box flex flex-col items-center justify-center p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              style={{ backgroundColor: "#722F37" }}
            >
              <div className="service-icon mb-4">
                <i className="fas fa-users text-5xl text-white"></i>
              </div>
              <h3 className="text-xl font-bold text-white">Public</h3>
            </Link>
          </div>
        </div>
      </div>

      {/* Minister Section */}
      <section data-aos="fade-right"  className="minister mt-12">
        <div className="container">
          <div className="ministerlist flex flex-col md:flex-row items-center justify-center gap-8">
            {/* Minister List */}
            <div className="ministerlist flex-1">
              <ul className="ministerlist_list flex flex-wrap justify-center gap-10">
                {/* Deputy Chief Minister 1 */}
                <li className="flex items-center gap-4">
                  <div className="ministerlist_img transform transition-transform duration-300 hover:scale-105">
                    <img
                      src="images/Dr. Sushil Bhasin.jpeg"
                      alt="Kanak Vardhan Singh Deo"
                      className="rounded-full w-24 h-24 object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold">Dr Arihant Surana</p>
                    <small className="text-red-600">
                    BEST HAIR TRANSPLANT CLINIC IN DELHI
                    </small>
                  </div>
                </li>

                {/* Deputy Chief Minister 2 */}
                <li className="flex items-center gap-4">
                  <div className="ministerlist_img transform transition-transform duration-300 hover:scale-105">
                    <img
                      src="images/parshu.png"
                      alt="Pravati Parida"
                      className="rounded-full w-24 h-24 object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold">Dr. Nishith Chandra</p>
                    <small className="text-gray-600">
                    PRINCIPAL DIRECTOR CARDIOLOGY 
                    </small>
                  </div>
                </li>

                {/* Deputy Chief Minister 3 */}
                <li className="flex items-center gap-4">
                  <div className="ministerlist_img transform transition-transform duration-300 hover:scale-105">
                    <img
                      src="images\Fatima Malik.jpeg"
                      alt="Pravati Parida"
                      className="rounded-full w-24 h-24 object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold">Dr. Sourabh Nagpal</p>
                    <small className="text-gray-600">
                    B.D.S, M.D.S Prosthodontist and Implantologist
                    </small>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

  
    </div>
  );
};

export default HeroSection;