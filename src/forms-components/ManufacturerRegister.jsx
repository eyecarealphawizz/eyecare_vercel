import React, { useState } from "react";
import "../Global.css";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { manuFactureRegister } from "../redux-components/features/cartSlice";
import { manuFacturevalidationSchema } from "./validation";

const ManufacturerRegister = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Form submit handler
  const handleSubmitRegister = (values) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("phone", values.phone);
    formData.append("address", values.address);
    formData.append("gst", values.gst);
    formData.append("password", values.password);
    formData.append("image", values.image);
    formData.append("pan_card", values.pan_card);
    formData.append("specialization", values.specialization);
    const authToken = localStorage.getItem("token");

    if (!authToken) {
      Swal.fire({
        icon: "error",
        title: "Log in first",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
      // navigate("/UserLogin");
      return;
    }
    dispatch(manuFactureRegister(formData)).then((res) => {
      console.log(res, "33333");
      if (res.payload.data.status == true) {
        navigate("/Profile");
      }
    });
  };

  return (
    <>
      <section className="formSection">
        <div className="formImage col-md-5">
          <img src="/additional/formImg.jpg" alt="" />
        </div>
        <div className="formcontainerDiv col-md-7">
          <h3>Manufacturer Registration</h3>
          <div className="formContainer">
            <Formik
              initialValues={{
                name: "",
                phone: "",
                email: "",
                pan_card: "",
                address: "",
                gst: "",
                specialization: "",
                password: "",
                image: null,
              }}
              onSubmit={handleSubmitRegister}
              validationSchema={manuFacturevalidationSchema}
            >
              {({
                values,
                handleChange,
                setFieldValue,
                errors,
                touched,
                handleSubmit,
                handleBlur,
                setFieldTouched,
              }) => (
                <form onSubmit={handleSubmit}>
                  <div className="inputWrapper">
                    <div>
                    <div className="inputFeald">
                      <span className="material-symbols-outlined">person</span>
                      <input
                        name="name"
                        value={values.name}
                        onChange={(e) => {
                          const newValue = e.target.value.replace(/\s+/g, " ");
                          setFieldValue("name", newValue);
                          setFieldTouched("name", true);
                        }}
                        onBlur={handleBlur}
                        type="text"
                        placeholder="Full Name"
                      />
                    </div>
                    {touched.name && errors.name && (
                      <div className="error">{errors.name}</div>
                    )}
                  </div>
                  </div>
                  <div className="inputWrapper">
                    <div>
                    <div className="inputFeald">
                    <span className="material-symbols-outlined">person</span>
                    <input
                      onChange={(e) => {
                        const newValue = e.target.value.replace(/\s+/g, "");
                        setFieldValue("email", newValue);
                        setFieldTouched("email", true);
                      }}
                      onBlur={handleBlur}
                      value={values.email}
                      type="email"
                      placeholder="Email"
                    />
                  </div>
                  {errors.email && touched.email && (
                    <div className="error">{errors.email}</div>
                  )}
                    </div>
                    <div>
                    <div className="inputFeald">
                      <span className="material-symbols-outlined">person</span>
                      <input
                        onChange={(e) => {
                          const inputValue = e.target.value.replace(/\D/g, "");
                          if (inputValue !== "0") {
                            setFieldValue("phone", inputValue.slice(0, 10));
                          }
                        }}
                        type="tel"
                        name="phone"
                        value={values.phone}
                        placeholder="Phone"
                      />
                    </div>
                    {errors.phone && touched.phone && (
                      <div className="error">{errors.phone}</div>
                    )}
                  </div>
                  </div>
                  <div className="formLable">Address</div>
                  <div className="inputWrapper">
                    <div>
                    <div className="inputFeald">
                      <span className="material-symbols-outlined">
                        pin_drop
                      </span>
                      <input
                        name="address"
                        onChange={(e) => {
                          const newValue = e.target.value.replace(/\s+/g, "");
                          setFieldValue("address", newValue);
                          setFieldTouched("address", true);
                        }}
                        value={values.address}
                        type="text"
                        placeholder="Current Address"
                      />
                    </div>
                    {errors.address && touched.address && (
                      <div className="error">{errors.address}</div>
                    )}
                    </div>
                  </div>
                  <div className="inputWrapper">
                    <div>
                    <div className="inputFeald">
                      <span className="material-symbols-outlined">id_card</span>
                      <input
                        onChange={(e) => {
                          const newValue = e.target.value.replace(/\s+/g, "");
                          setFieldValue("gst", newValue);
                          setFieldTouched("gst", true);
                        }}
                        value={values.gst}
                        name="gst"
                        type="text"
                        placeholder="GST Number"
                      />
                    </div>
                    {errors.gst && touched.gst && (
                      <div className="error">{errors.gst}</div>
                    )}
                    </div>
                    <div>
                    <div className="inputFeald">
                      <span className="material-symbols-outlined">badge</span>
                      <input
                        onChange={(e) => {
                          const newValue = e.target.value.replace(/\s+/g, "");
                          setFieldValue("pan_card", newValue);
                          setFieldTouched("pan_card", true);
                        }}
                        value={values.pan_card}
                        name="pan_card"
                        type="text"
                        placeholder="PAN Card No."
                      />
                    </div>
                    {errors.pan_card && touched.pan_card && (
                      <div className="error">{errors.pan_card}</div>
                    )}
                    </div>
                  </div>
                  <div className="inputWrapper mt-3">
                    <div>
                    <div className="inputFeald">
                      <span className="material-symbols-outlined">
                        fact_check
                      </span>
                      <input
                        onChange={(e) => {
                          const newValue = e.target.value.replace(/\s+/g, "");
                          setFieldValue("specialization", newValue);
                          setFieldTouched("specialization", true);
                        }}
                        value={values.specialization}
                        name="specialization"
                        type="text"
                        placeholder="Specialization:"
                      />
                    </div>
                    {errors.specialization && touched.specialization && (
                      <div className="error">{errors.specialization}</div>
                    )}
                    </div>
                    <div>
                    <div className="inputFeald">
                      <span className="material-symbols-outlined">
                        calendar_month
                      </span>
                      <input
                        onChange={(e) => {
                          const newValue = e.target.value.replace(/\s+/g, "");
                          setFieldValue("password", newValue);
                          setFieldTouched("password", true);
                        }}
                        value={values.password}
                        name="password"
                        type="password"
                        placeholder="Password"
                      />
                    </div>
                    {errors.password && touched.password && (
                      <div className="error">{errors.password}</div>
                    )}
                    </div>
                  </div>
                  <div className="inputWrapper">
                    <div>
                    <div className="inputFeald">
                      <span className="material-symbols-outlined">image</span>
                      <label className="inputLable" htmlFor="inputFile7">
                        Upload Image
                      </label>
                      <input
                        id="inputFile7"
                        className="inputFealdClass"
                        accept="image/png, image/jpeg"
                        onChange={(e) =>
                          setFieldValue("image", e.target.files[0])
                        }
                        name="image"
                        // value={values.image}
                        type="file"
                      />
                    </div>
                    {errors.image && touched.image && (
                      <div className="error">{errors.image}</div>
                    )}
                    </div>
                  </div>
                  <div className="formSubminBtn">
                    <button type="submit">Submit</button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      </section>
    </>
  );
};

export default ManufacturerRegister;
