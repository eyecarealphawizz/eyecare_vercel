import "../../App.css";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const Login = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
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
    if (!data.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = "Invalid email format";
    }
    if (!data.password.trim()) {
      errors.password = "Password is required";
    } else if (data.password.length < 4) {
      errors.password = "Password must be at least 4 characters";
    }
    return errors;
  };

  const formSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm(user);
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length === 0) {
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
  
          setUser({ email: "", password: "" });
  
          navigate("/");
          window.location.reload();
        }
      } catch (error) {
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
          errorMessage = "something went wrong.";
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
        title: "Fill all the fields",
      });
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
                <form onSubmit={formSubmit}>
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
                    <span className="errorValidationDiv">
                      {errors.password}
                    </span>
                  )}
                  <div className="forget">
                    <span>Forget Password</span>
                  </div>
                  <div className="loginBtn">
                    <button type="submit">Login</button>
                  </div>
                  <div className="signupDiv">
                    Don't have an account?{" "}
                    <Link to="/UserRegister">Sign up</Link>
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
