import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";
const Footer = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const [logoUrl, setLogoUrl] = useState("");

  useEffect(() => {

    fetch(`${baseUrl}/api/v1/config`)
      .then((response) => response.json())
      .then((data) => {
        setLogoUrl(data.company_logo); 
      })
      .catch((error) => {
        console.error("Error fetching company logo:", error);
      });
  }, []);


  const navigate = useNavigate();
  function doctorRegister() {
    navigate("/DoctorRegister");
  }
  function ManufacturerRegister() {
    navigate("/ManufacturerRegister");
  }
  function AggregatorRegister() {
    navigate("/AggregatorRegister");
  }
  return (
    <>
      <section className="footerSection">
        <div className="container">
          <div className="footerContainer">
            <div className="footerHead col-lg-5 col-md-5 col-xl-3">
              <div className="footerLogo">
              <Link to="/" className="text-black">
              {logoUrl ? (
                <img className="nav-img w-50" src={logoUrl} alt="Logo" />
              ) : (
                <img className="nav-img w-50" src="/additional/logooffline.png" alt="Logo" />
              )}
            </Link>

                <p>See the World with a Vision !</p>
              </div>
              <h3 className="socialMediaText">Connect With Us</h3>
              <div className="socialMediaDiv">
                <img src="/images/facebook.png" alt="" />
                <img src="/images/instagram.png" alt="" />
                <img src="/images/twitter.png" alt="" />
                <img src="/images/linkedin.png" alt="" />
              </div>
            </div>
            <div className="footerHead col-lg-5 col-md-5 col-xl-3">
              <h3>Partner With Us</h3>
              {/* <li onClick={Appointment}>Book Appointment</li> */}
              <li
                onClick={() => {
                  doctorRegister();
                  window.scroll(0, 0);
                }}
              >
                Doctor Registration
              </li>
              {/* <li onClick={visitHomeAppointment}>Home Visit Appointment</li> */}
              <li
                onClick={() => {
                  AggregatorRegister();
                  window.scroll(0, 0);
                }}
              >
                Aggregator Registration
              </li>
              <li
                onClick={() => {
                  ManufacturerRegister();
                  window.scroll(0, 0);
                }}
              >
                Manufacturer Registration
              </li>
            </div>
            <div className="footerHead col-lg-5 col-md-5 col-xl-3">
              <h3>Customer Service</h3>
              <Link
                to="/FAQHelp"
                onClick={() => {
                  window.scroll(0, 0);
                }}
              >
                <li>FAQ & Helps</li>
              </Link>
              {/* <Link
                to="/VendorRefundPolicy"
                onClick={() => {
                  window.scroll(0, 0);
                }}
              >
                <li>Vendor Refund Policies</li>
              </Link> */}
              <Link
                to="/CustomerRefundPolicy"
                onClick={() => {
                  window.scroll(0, 0);
                }}
              >
                <li>Customer Refund Policies</li>
              </Link>
              <Link
                to="/TermsAndConditions"
                onClick={() => {
                  window.scroll(0, 0);
                }}
              >
                <li>Terms & Conditions</li>
              </Link>
              <Link
                to="/PrivacyPolicy"
                onClick={() => {
                  window.scroll(0, 0);
                }}
              >
                <li>Privacy Policy</li>
              </Link>
            </div>
            <div className="footerHead col-lg-5 col-md-5 col-xl-3">
              <h3>Subcribe Now</h3>
              <div>
                Subscribe your email for based on your newsletter and featured
                news
              </div>
              <div className="emailFeald">
                <input type="text" placeholder="Write Email" />
                <button>Send</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Footer;
