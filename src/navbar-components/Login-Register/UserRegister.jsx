import "../../App.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Registration = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const [user, setUser] = useState({
    f_name: "",
    l_name: "",
    email: "",
    phone: "",
    password: "",
    city: "indore",
  });

  const [otp, setOtp] = useState("");
  const [receivedOtp, setReceivedOtp] = useState(null);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.f_name.trim()) {
      errors.f_name = "First name is required";
    } else if (data.f_name.length < 3) {
      errors.f_name = "First name must be at least 3 characters";
    }

    if (!data.l_name.trim()) {
      errors.l_name = "Last name is required";
    } else if (data.l_name.length < 3) {
      errors.l_name = "Last name must be at least 3 characters";
    }

    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email is invalid";
    }

    if (!data.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(data.phone)) {
      errors.phone = "Phone number must be exactly 10 digits";
    }

    if (!data.password.trim()) {
      errors.password = "Password is required";
    } else if (data.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    return errors;
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!user.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(user.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const res = await axios.post(`${baseUrl}/api/v1/auth/verify_otp`, { phone: user.phone });
        if (res.data.status === 'success') {
          setReceivedOtp(res.data.otp);
          localStorage.setItem("otp", res.data.otp);
          setOtpSent(true); // Set OTP sent to true
          Swal.fire({
            icon: "success",
            title: "OTP sent successfully!",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: res.data.message,
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error sending OTP!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    }
  };

  const verifyOtp = () => {
    const storedOtp = localStorage.getItem("otp");
    if (otp === storedOtp) {
      setOtpVerified(true); // Set OTP verified to true
      Swal.fire({
        icon: "success",
        title: "OTP verified! You can now register.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Incorrect OTP!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm(user);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0 && otpVerified) {
      try {
        const res = await axios.post(`${baseUrl}/api/v1/auth/register`, user);
        console.log(res.data.errors, "response-->");

        if (res.data.errors && Array.isArray(res.data.errors)) {
          const errorRes = res.data.errors.map((error) => {
            if (error.code === "email") {
              return `${error.message}`;
            } else if (error.code === "phone") {
              return `${error.message}`;
            } else {
              return `${error.code}: ${error.message}`;
            }
          });

          Swal.fire({
            icon: "error",
            title: errorRes.join(", "),
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "Registered Successfully",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
          });

          navigate("/UserLogin");
        }

        setUser({
          f_name: "",
          l_name: "",
          email: "",
          phone: "",
          password: "",
        });
      } catch (error) {
        console.error("Error registering user:", error);

        let errorMessage = "Something went wrong! Please try again.";
        if (error.response) {
          errorMessage = error.response.data?.message || "Registration failed!";
        } else if (error.request) {
          errorMessage = "Something went wrong";
        }

        Swal.fire({
          icon: "error",
          title: errorMessage,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } else {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });

      Toast.fire({
        icon: "error",
        title: "Fill all the fields correctly",
      });
    }
  };

  return (
    <>
      <section className="loginSection">
        <div className="container">
          <div className="loginContainerSection">
            <div className="loginImg col-md-6">
              <img src="/images/signup.png" alt="Login" />
            </div>
            <div className="loginContainer col-md-6">
              <h3>Register Your Account!</h3>
              <p>Please enter your details.</p>
              <div className="loginFormDiv">
                {/* OTP Form */}
                <form onSubmit={sendOtp}>
                  <div className="loginInput">
                    <span className="material-symbols-outlined">phone</span>
                    <input
                      name="phone"
                      placeholder="Phone Number"
                      className="login-inp"
                      type="text"
                      value={user.phone}
                      onChange={handleChange}
                      maxLength={10}
                      readOnly={otpSent} // Readonly if OTP is sent
                    />
                  </div>
                  {errors.phone && (
                    <span className="errorValidationDiv">{errors.phone}</span>
                  )}
                  <div className="otpContainer">
                    <div className="sendOtpDiv">
                      {!otpSent && (
                        <button type="submit" className="otpButton" disabled={otpVerified}>Send OTP</button>
                      )}
                      {otpSent && !otpVerified && (
                        <>
                        {!otpVerified && otpSent && ( 
                  <div className="otpVerificationDiv">
                    

                    <input
                      type="text"
                      className="otpInput w-100 optRegisterInput"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                    <span className="otpMessage">Received OTP: {receivedOtp}</span>
                    <div className="registerOTPDiv">
                    <button type="button" className="otpButton" onClick={sendOtp}>Resend OTP</button>
                    <button type="button" className="verifyButton" onClick={verifyOtp}>Verify OTP</button>
                    </div>
                  </div>
                )}
                        </>
                      )}
                    </div>
                  </div>
                </form>

                

                {/* Registration Form */}
                <form onSubmit={formSubmit}>
                  <div className="loginInput">
                    <span className="material-symbols-outlined">person</span>
                    <input
                      name="f_name"
                      placeholder="First Name"
                      className="login-inp"
                      type="text"
                      value={user.f_name}
                      onChange={handleChange}
                      disabled={!otpVerified} // Disable until OTP is verified
                    />
                  </div>
                  {errors.f_name && (
                    <span className="errorValidationDiv">{errors.f_name}</span>
                  )}
                  <div className="loginInput">
                    <span className="material-symbols-outlined">person</span>
                    <input
                      name="l_name"
                      placeholder="Last Name"
                      className="login-inp"
                      type="text"
                      value={user.l_name}
                      onChange={handleChange}
                      disabled={!otpVerified}
                    />
                  </div>
                  {errors.l_name && (
                    <span className="errorValidationDiv">{errors.l_name}</span>
                  )}
                  <div className="loginInput">
                    <span className="material-symbols-outlined">mail</span>
                    <input
                      name="email"
                      placeholder="Email"
                      className="login-inp"
                      type="email"
                      value={user.email}
                      onChange={handleChange}
                      disabled={!otpVerified}
                    />
                  </div>
                  {errors.email && (
                    <span className="errorValidationDiv">{errors.email}</span>
                  )}
                  <div className="loginInput">
                    <span className="material-symbols-outlined">password</span>
                    <input
                      name="password"
                      placeholder="Password"
                      className="login-inp"
                      type="password"
                      value={user.password}
                      onChange={handleChange}
                      disabled={!otpVerified}
                    />
                  </div>
                  {errors.password && (
                    <span className="errorValidationDiv">{errors.password}</span>
                  )}
                  <div className="loginBtn">
                    <button type="submit" disabled={!otpVerified}>Sign Up</button>
                  </div>
                  <div className="signupDiv">
                    Already have an Account <Link className="signupA" to="/UserLogin">Log in</Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Registration;
