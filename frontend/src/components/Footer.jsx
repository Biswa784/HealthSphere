import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4">
      <div className="container mx-auto">
        <div className="row flex flex-wrap">
          {/* Important Links Column */}
          <div className="col-md-6 col-lg-3 mb-4">
            <h5 className="text-lg font-bold mb-3">Important Links</h5>
            <ul className="nav flex flex-col space-y-2">
              <li className="nav-item">
                <a
                  href="javascript:void(0);"
                  className="nav-link flex items-center hover:text-blue-200"
                  title="Apply Freeship Card"
                >
                  <i className="icon-angle-right mr-2"></i>
                  <span>Apply For Appointment</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="/website/ifsc-code"
                  className="nav-link flex items-center hover:text-blue-200"
                  title="IFSC Code"
                >
                  <i className="icon-angle-right mr-2"></i>
                  <span>State Code</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="/website/institute-list"
                  className="nav-link flex items-center hover:text-blue-200"
                  title="Institute List"
                >
                  <i className="icon-angle-right mr-2"></i>
                  <span>Hospital List</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="/website/check-eligibility"
                  className="nav-link flex items-center hover:text-blue-200"
                  title="Check Scholarship Eligibility"
                >
                  <i className="icon-angle-right mr-2"></i>
                  <span>Check Eligibility</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Other Links Column */}
          <div className="col-md-6 col-lg-3 mb-4">
            <h5 className="text-lg font-bold mb-3">Other Links</h5>
            <ul className="nav flex flex-col space-y-2">
              <li className="nav-item">
                <a
                  href="https://scholarships.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link flex items-center hover:text-blue-200"
                  title="National Scholarship Portal"
                >
                  <i className="icon-angle-right mr-2"></i>
                  <span>National Hospital Portal</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  href=""
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link flex items-center hover:text-blue-200"
                  title="Government of Odisha"
                >
                  <i className="icon-angle-right mr-2"></i>
                  <span>Government of Delhi</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="https://www.india.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link flex items-center hover:text-blue-200"
                  title="Government of India"
                >
                  <i className="icon-angle-right mr-2"></i>
                  <span>Government of India</span>
                </a>
              </li>
            </ul>
          </div>

          {/* External Links Column */}
          <div className="col-lg-6 mb-4 mg-8">
          <ul className="nav grid grid-cols-2 gap-4 m-8">
              <li className="nav-item">
                <a
                  href="https://www.google.co.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link flex items-center hover:text-blue-200"
                  title="Government of Odisha"
                >
                  <img
                    src="images/india-flag.jpg"
                    alt="Government of Odisha"
                    className="w-8 h-8 mr-2"
                  />
                  <span>Government of Delhi</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="https://www.india.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link flex items-center hover:text-blue-200"
                  title="Government of India"
                >
                  <img
                    src="images/amrit-mahotsav_nn.jpg"
                    alt="Government of India"
                    className="w-8 h-8 mr-2"
                  />
                  <span>Government of India</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="https://www.samsodisha.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link flex items-center hover:text-blue-200"
                  title="SAMS"
                >
                  <img
                    src="images/ashok-stambh-satyamev-jayete-government-india-symbol-golden-colour-emblem-india-306407064.webp"
                    alt="SAMS"
                    className="w-8 h-8 mr-2"
                  />
                  <span>India Capital Hospital</span>
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="https://spdp.odisha.gov.in/#/spdpwebsite/spdphome/eligibilityForm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-link flex items-center hover:text-blue-200"
                  title="SPDP"
                >
                  <img
                    src="images/holy family.jpeg"
                    alt="SPDP"
                    className="w-8 h-8 mr-2"
                  />
                  <span>Medicine Provide</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;