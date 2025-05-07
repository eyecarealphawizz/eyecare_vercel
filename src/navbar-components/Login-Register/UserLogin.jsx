import "../../App.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Login = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  
  // State for login method
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const [otpSent, setOtpSent] = useState("");
  
  // State for user inputs
  const [user, setUser] = useState({
    email: "",
    password: "",
    phone: "",
    otp: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.email.trim() && !isOtpLogin) {
      errors.email = "Email is required";
    } else if (data.email && !/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Invalid email format";
    }
    if (!data.password.trim() && !isOtpLogin) {
      errors.password = "Password is required";
    } else if (data.password && data.password.length < 4) {
      errors.password = "Password must be at least 4 characters";
    }
    if (isOtpLogin && !data.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (isOtpLogin && !/^\d{10}$/.test(data.phone)) {
      errors.phone = "Phone number must be exactly 10 digits";
    }
    if (isOtpLogin && !data.otp.trim()) {
      errors.otp = "OTP is required";
    }
    return errors;
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm(user);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (isOtpLogin) {
        await verifyOtp();
      } else {
        try {
          const res = await axios.post(`${baseUrl}/api/v1/auth/login`, user);
          console.log("response-->", res);

          if (res.status === 200) {
            Swal.fire({
              icon: "success",
              title: "Login successful",
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 1000,
              timerProgressBar: true,
            });

            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("token", res.data.token);

            setUser({ email: "", password: "", phone: "", otp: "" });
            navigate("/");
            window.location.reload();
          }
        } catch (error) {
          handleError(error);
        }
      }
    } else {
      showErrorToast();
    }
  };

  const handleError = (error) => {
    let errorMessage = "Something went wrong! Please try again.";
    if (error.response) {
      const errorRes = error.response.data.errors?.map((error) => {
        if (error.code === "auth-001") {
          return "Invalid credentials";
        } else {
          return `${error.code}: ${error.message}`;
        }
      });
      errorMessage = errorRes ? errorRes.join(", ") : "Login failed!";
    } else if (error.request) {
      errorMessage = "Something went wrong.";
    } else {
      errorMessage = "An error occurred. Please try again later.";
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
  };

  const showErrorToast = () => {
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
  };

  const sendOtp = async (e) => {
    e.preventDefault();
  
    // Reset errors for phone
    const newErrors = validateForm(user);
    setErrors(newErrors);
  
    if (user.phone.trim() && /^\d{10}$/.test(user.phone)) {
      try {
        const res = await axios.post(`${baseUrl}/api/v1/auth/send_otp`, { phone: user.phone });
        console.log(res);
  
        if (res.data.status === 'success') {
          setOtpSent(res.data.otp);
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
    } else {
      // If the phone number is invalid or empty, set an error
      const updatedErrors = { ...newErrors, phone: "Phone number is required" };
      setErrors(updatedErrors);
    }
  };
  
  const resendOtp = async (e) => {
    e.preventDefault();
    sendOtp(e); // Call sendOtp to resend OTP
  };

  const verifyOtp = async () => {
    if (user.otp.trim()) {
      try {
        const res = await axios.post(`${baseUrl}/api/v1/auth/login_with_otp`, {
          phone: user.phone,
          otp: user.otp,
        });
        console.log(res);
        
        if (res.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Login successful",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
          });
          localStorage.setItem("user", JSON.stringify(res.data.user));
          localStorage.setItem("token", res.data.token);
          navigate("/");
          window.location.reload();
        } else {
          Swal.fire({
            icon: "error",
            title: res.data.message,
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1000,
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
          timer: 1000,
          timerProgressBar: true,
        });
      }
    }
  };

  return (
    <>
      <section className="loninSection">
        <div className="container">
          <div className="loginContainerSection">
            <div className="loginImg col-md-6 col-12">
              <img src="/images/loginImg.jpg" alt="Login" />
            </div>
            <div className="loginContainer col-md-6 col-12">
              <h3>Welcome Back!</h3>
              <p>Please enter your details.</p>
              <div className="loginFormDiv">
                <div className="tab loginTabBtn">
                  <button onClick={() => setIsOtpLogin(false)}>Email Login</button>
                  <button onClick={() => setIsOtpLogin(true)}>OTP Login</button>
                </div>
                <form onSubmit={formSubmit}>
                  {!isOtpLogin && (
                    <>
                      <div className="loginInput">
                        <span className="material-symbols-outlined">mail</span>
                        <input
                          name="email"
                          placeholder="Email"
                          className="login-inp"
                          type="email"
                          value={user.email}
                          onChange={handleChange}
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
                        />
                      </div>
                      {errors.password && (
                        <span className="errorValidationDiv">{errors.password}</span>
                      )}

<div className="forget">
                    <span>Forget Password</span>
                  </div>
                    </>
                  )}

                  {isOtpLogin && (
                    <>
                      <div className="loginInput">
                        <span className="material-symbols-outlined">phone</span>
                        <input
                          name="phone"
                          placeholder="Phone Number"
                          className="login-inp"
                          type="text"
                          maxLength={10}
                          value={user.phone}
                          onChange={handleChange}
                          readOnly={otpSent}
                        />
                      </div>
                      {errors.phone && (
                        <span className="errorValidationDiv">{errors.phone}</span>
                      )}
                      {!otpSent ? (
                        <div className="loginBtnDiv5">
                        <button type="button" onClick={sendOtp} className="otpButton">Send OTP</button>
                        </div>
                      ) : (
                        <>
                        <div className="loginInput">
                        <span className="material-symbols-outlined">key</span>
                        <input
                          name="otp"
                          placeholder="Enter OTP"
                          className="login-inp"
                          type="text"
                          value={user.otp}
                          onChange={handleChange}
                        />
                      </div>
                        <div className="loginBtnDiv5"><button type="button" onClick={resendOtp} className="otpButton">Resend OTP</button></div>
                        </>
                      )}
                      {otpSent && <span>Sent OTP: {otpSent}</span>}
                     
                      {errors.otp && !errors.phone &&(
                        <span className="errorValidationDiv">{errors.otp}</span>
                      )}
                    </>
                  )}

                  
                  <div className="loginBtn">
                    <button type="submit">Login</button>
                  </div>
                  <div className="signupDiv">
                    Don't have an account?{" "}
                    <Link className="signupA" to="/UserRegister">Sign up</Link>
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

export default Login;
