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
    // address: "vijay nagar, indore 452010",
  });

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
    // First name validation
    if (!data.f_name.trim()) {
      errors.f_name = "First name is required";
    } else if (data.f_name.length < 3) {
      errors.f_name = "First name must be at least 3 characters";
    }

    // Last name validation
    if (!data.l_name.trim()) {
      errors.l_name = "Last name is required";
    } else if (data.l_name.length < 3) {
      errors.l_name = "Last name must be at least 3 characters";
    }

    // Email validation
    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Email is invalid";
    }

    // Phone validation
    if (!data.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(data.phone)) {
      errors.phone = "Phone number must be exactly 10 digits";
    }

    // Password validation
    if (!data.password.trim()) {
      errors.password = "Password is required";
    } else if (data.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }

    return errors;
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm(user);
    setErrors(newErrors);
  
    // Proceed if there are no validation errors
    if (Object.keys(newErrors).length === 0) {
      try {
        const res = await axios.post(`${baseUrl}/api/v1/auth/register`, user);
        console.log(res.data.errors, "reponse-->");
  
        // Check if errors exist in the response
        if (res.data.errors && Array.isArray(res.data.errors)) {
          const errorRes = res.data.errors.map((error) => {
            // Handle different error codes (like email or phone)
            if (error.code === "email") {
              return `${error.message}`;
            } else if (error.code === "phone") {
              return `${error.message}`;
            } else {
              return `${error.code}: ${error.message}`;
            }
          });
  
          // Display error messages
          Swal.fire({
            icon: "error",
            title: errorRes.join(", "), // Join the errors into a single string
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
          });
        } else {
          // If no errors, display success message
          Swal.fire({
            icon: "success",
            title: "Registered Successfully",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
          });
  
          // Navigate to the login page after successful registration
          navigate("/UserLogin");
        }
  
        // Clear the form fields after successful submission or error
        setUser({
          f_name: "",
          l_name: "",
          email: "",
          phone: "",
          password: "",
        });
      } catch (error) {
        console.error("Error registering user:", error);
  
        // Check if error has a response and display a suitable message
        let errorMessage = "Something went wrong! Please try again.";
        if (error.response) {
          errorMessage = error.response.data?.message || "Registration failed!";
        } else if (error.request) {
          errorMessage = "Something went wrong";
        }
  
        // Show error message in case of unexpected errors
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
      // If form validation fails, show a warning message
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
      <section className="loninSection">
        <div className="container">
          <div className="loginContainerSection">
            <div className="loginImg col-md-6">
              <img src="/images/signup.png" alt="Login" />
            </div>
            <div className="loginContainer col-md-6">
              <h3>Register Your Account!</h3>
              <p>Please enter your details.</p>
              <div className="loginFormDiv">
                <form onSubmit={formSubmit}>
                  {/* First Name */}
                  <div className="loginInput">
                    <span className="material-symbols-outlined">person</span>
                    <input
                      name="f_name"
                      placeholder="First Name"
                      className="login-inp"
                      type="text"
                      value={user.f_name}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.f_name && (
                    <span className="errorValidationDiv">{errors.f_name}</span>
                  )}
                  {/* Last Name */}
                  <div className="loginInput">
                    <span className="material-symbols-outlined">person</span>
                    <input
                      name="l_name"
                      placeholder="Last Name"
                      className="login-inp"
                      type="text"
                      value={user.l_name}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.l_name && (
                    <span className="errorValidationDiv">{errors.l_name}</span>
                  )}
                  {/* Email */}
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
                  {/* Phone */}
                  <div className="loginInput">
                    <span className="material-symbols-outlined">phone</span>
                    <input
                      name="phone"
                      placeholder="Phone Number"
                      className="login-inp"
                      type="text"
                      value={user.phone}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.phone && (
                    <span className="errorValidationDiv">{errors.phone}</span>
                  )}
                  {/* Password */}
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
                    <span className="errorValidationDiv">
                      {errors.password}
                    </span>
                  )}
                  <div className="loginBtn">
                    <button type="submit">Sign up</button>
                  </div>
                  {/* <div className="googleBtn">
                    <button>
                      <img src="/images/google.png" alt="Google" /> Sign in with Google
                    </button>
                  </div> */}
                  <div className="signupDiv">
                    Already have an Account <Link to="/UserLogin">Log in</Link>
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
