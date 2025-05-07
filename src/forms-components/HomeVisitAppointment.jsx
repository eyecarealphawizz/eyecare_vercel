import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { HomeVisit } from "../redux-components/Becameparson/Becameparson/BecameSlice";
import { useNavigate } from "react-router-dom";

function HomeVisitAppointment() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formdata, SetFormData] = useState({
    patient_name: "",
    patient_age: "",
    patient_gender: "",
    patient_email: "",
    patient_mobile: "",
    house_number: "",
    street_name: "",
    locality: "",
    pincode: "",
    area: "",
    landmark: "",
    complaint: "",
    booking_datetime: "",
    alternate_datetime: "",
    paid_amount: 100,
    google_address: "",
    latitude: 165432,
    longitude: 7652,
  });

  const [error, setError] = useState({
    patient_name: "",
    patient_age: "",
    patient_gender: "",
    patient_email: "",
    patient_mobile: "",
    house_number: "",
    street_name: "",
    locality: "",
    pincode: "",
    area: "",
    landmark: "",
    complaint: "",
    booking_datetime: "",
  });

  const handleChang = (e) => {
    SetFormData({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  // Function to validate the fields
  const validateFields = () => {
    const newError = {};

    if (!formdata.patient_name) newError.patient_name = "Name is required.";
    if (!formdata.patient_age) newError.patient_age = "Age is required.";
    if (!formdata.patient_gender) newError.patient_gender = "Gender is required.";
    if (!formdata.patient_email) {
      newError.patient_email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formdata.patient_email)) {
      newError.patient_email = "Email format is invalid.";
    }
    if (!formdata.patient_mobile) {
      newError.patient_mobile = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formdata.patient_mobile)) {
      newError.patient_mobile = "Phone number should be 10 digits.";
    }
    if (!formdata.house_number) newError.house_number = "House number is required.";
    if (!formdata.street_name) newError.street_name = "Street name is required.";
    if (!formdata.pincode) newError.pincode = "Pincode is required.";
    if (!formdata.area) newError.area = "Area is required.";
    if (!formdata.landmark) newError.landmark = "Landmark is required.";
    if (!formdata.locality) newError.locality = "City is required.";
    if (!formdata.complaint) newError.complaint = "Complaint is required.";
    if (!formdata.booking_datetime) newError.booking_datetime = "Appointment date and time is required.";

    // Validate if booking date is in the future
    if (formdata.booking_datetime && new Date(formdata.booking_datetime) <= new Date()) {
      newError.booking_datetime = "Booking date must be in the future.";
    }
    
    // Validate alternate date if provided
    if (formdata.alternate_datetime && new Date(formdata.alternate_datetime) <= new Date()) {
      newError.alternate_datetime = "Alternate date must be in the future.";
    }

    setError(newError);
    return Object.keys(newError).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateFields()) {
      return;
    }
    handlePayment();
  };

  // Razorpay
  const AMOUNT = 100;
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => console.log("Razorpay Script Loaded");
      document.body.appendChild(script);
    };

    loadRazorpayScript();
  }, []);

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const options = {
        key: "rzp_test_BTD7NrW2lajZXK",
        amount: AMOUNT * 100,
        currency: "INR",
        name: "Your Company Name",
        description: "Test Transaction",
        handler: function (response) {
          console.log("Payment successful", response);
          dispatch(HomeVisit(formdata)).then((res) => {
            console.log(res, "33333");
            if (res.payload.status === true) {
              navigate("/Profile");
            }
          });
        },
        prefill: {
          name: formdata.patient_name,
          email: formdata.patient_email,
          contact: formdata.patient_mobile,
        },
        theme: {
          color: "#3399cc",
        },
      };

      if (typeof window !== "undefined" && window.Razorpay) {
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        console.error("Razorpay SDK not loaded properly");
      }
    } catch (error) {
      console.error("Payment failed", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="Becameparson">
      <div className="Becameparson-form">
        <div className="services">
          <div className="services-5">
            <section className="formSection">
              <div className="formImage col-md-5">
                <img src="/additional/formImg.jpg" alt="" />
              </div>
              <div className="formcontainerDiv col-md-7">
                <h3>HOME VISIT APPOINTMENT</h3>
                <div className="formContainer">
                  <form onSubmit={handleSubmit}>
                    <div className="inputHead">
                      <div className="customWrapper">
                      <div className="inputFeald">
                        <span className="material-symbols-outlined">
                          person
                        </span>
                        <input
                          type="text"
                          placeholder="First Name"
                          name="patient_name"
                          onChange={handleChang}
                          value={formdata.patient_name}
                          // required
                        />
                      </div>
                        {error.patient_name && <div className="error">{error.patient_name}</div>}
                      </div>
                      <div className="customWrapper">
                      <div className="inputFeald">
                        <span className="material-symbols-outlined">
                          person
                        </span>
                        <input
                          type="text"
                          placeholder="Age"
                          name="patient_age"
                          onChange={handleChang}
                          value={formdata.patient_age}
                          // required
                        />
                        </div>
                        {error.patient_age && <div className="error">{error.patient_age}</div>}
                      </div>
                      <div className="customWrapper">
                      <div className="inputFeald">
                        <span className="material-symbols-outlined">
                          person
                        </span>
                        <select
                          name="patient_gender"
                          onChange={handleChang}
                          value={formdata.patient_gender}
                          // required
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                        </div>
                        {error.patient_gender && <div className="error">{error.patient_gender}</div>}
                      </div>
                    </div>
                    <div className="inputWrapper">
                      <div>
                      <div className="inputFeald">
                        <span className="material-symbols-outlined">mail</span>
                        <input
                          type="text"
                          placeholder="Email"
                          name="patient_email"
                          onChange={handleChang}
                          value={formdata.patient_email}
                        />
                        </div>
                        {error.patient_email && <div className="error">{error.patient_email}</div>}
                      </div>
                      <div>
                  
                      <div className="inputFeald">
                        <span className="material-symbols-outlined">call</span>
                        <input
                          type="text"
                          placeholder="Phone No."
                          name="patient_mobile"
                          onChange={handleChang}
                          value={formdata.patient_mobile}
                        />
                        </div>
                        {error.patient_mobile && <div className="error">{error.patient_mobile}</div>}
                      </div>
                    </div>
                    <div className="formLable">Address</div>
                    <div className="inputWrapper">
                      <div>
                      <div className="inputFeald">
                        <span className="material-symbols-outlined">home</span>
                        <input
                          type="text"
                          placeholder="House No."
                          name="house_number"
                          onChange={handleChang}
                          value={formdata.house_number}
                          // required
                        />
                        </div>
                        {error.house_number && <div className="error">{error.house_number}</div>}
                      </div>
                      <div>
                      <div className="inputFeald">
                        <span className="material-symbols-outlined">
                          my_location
                        </span>
                        <input
                          type="text"
                          placeholder="Pin Code"
                          name="pincode"
                          onChange={handleChang}
                          value={formdata.pincode}
                        />
                        </div>
                        {error.pincode && <div className="error">{error.pincode}</div>}
                      </div>
                    </div>
                    <div className="inputWrapper">
                      <div>
                    <div className="inputFeald">
                      <span className="material-symbols-outlined">
                        person_pin_circle
                      </span>
                      <input
                        type="text"
                        placeholder="Street Name/No."
                        name="street_name"
                        onChange={handleChang}
                        value={formdata.street_name}
                      />
                    </div>
                      {error.street_name && <div className="error">{error.street_name}</div>}
                      </div>
                      <div>
                    <div className="inputFeald">
                      <span className="material-symbols-outlined">
                        location_city
                      </span>
                      <input
                        type="text"
                        placeholder="Area"
                        name="area"
                        onChange={handleChang}
                        value={formdata.area}
                      />
                    </div>
                      {error.area && <div className="error">{error.area}</div>}
                      </div>
                      </div>
                      <div className="inputWrapper">
                        <div>
                    <div className="inputFeald">
                      <span className="material-symbols-outlined">
                        things_to_do
                      </span>
                      <input
                        type="text"
                        placeholder="Landmark"
                        name="landmark"
                        onChange={handleChang}
                        value={formdata.landmark}
                      />
                    </div>
                      {error.landmark && <div className="error">{error.landmark}</div>}
                      </div>
                      <div>
                    <div className="inputFeald">
                      <span className="material-symbols-outlined">passkey</span>
                      <input
                        type="text"
                        placeholder="city"
                        name="locality"
                        onChange={handleChang}
                        value={formdata.locality}
                      />
                    </div>
                    {error.locality && <div className="error">{error.locality}</div>}
                    </div>
                    </div>
                    <div className="inputWrapper">
                      <div>
                    <div className="inputFeald">
                      <span className="material-symbols-outlined">
                        mobile_friendly
                      </span>
                      <input
                        type="text"
                        placeholder="Complaint in Brief"
                        name="complaint"
                        onChange={handleChang}
                        value={formdata.complaint}
                      />
                    </div>
                      {error.complaint && <div className="error">{error.complaint}</div>}
                      </div>
                      </div>
                    <div className="inputWrapper mt-3">
                      <div>
                        Schedule Appointment Date and Time
                        <div className="inputFeald">
                          <span className="material-symbols-outlined">
                            calendar_month
                          </span>
                          <input
                            type="datetime-local"
                            name="booking_datetime"
                            onChange={handleChang}
                            value={formdata.booking_datetime}
                          />
                        </div>
                          {error.booking_datetime && <div className="error">{error.booking_datetime}</div>}
                      </div>
                      <div>
                        Alternate Date and Time
                        <div className="inputFeald">
                          <span className="material-symbols-outlined">
                            event_note
                          </span>
                          <input
                            type="datetime-local"
                            name="alternate_datetime"
                            onChange={handleChang}
                            value={formdata.alternate_datetime}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="formSubminBtn">
                      <button 
                        // onClick={handlePayment}
                        // disabled={isProcessing || !validateFields()}
                      >
                        Submit
                        {/* {isProcessing ? "Processing...." : "Submit"} */}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomeVisitAppointment;
