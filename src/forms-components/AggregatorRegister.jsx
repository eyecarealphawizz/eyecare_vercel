import React, { useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { Formik } from "formik";
import { AggratorRegistervalidationSchema } from "./validation";
import { useDispatch } from "react-redux";
import { registerAggregator } from "../redux-components/features/cartSlice";

const AggregatorRegister = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleRegisterAggregtor = (values) => {
    console.log(values, "values-->");

    const urlencoded = new FormData();
    const formDataObject = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      pan_card: values.pan_card,
      address: values.address,
      gst: values.gst,
      zipcode: values.zipcode,
      aadhar_number: values.aadhar_number,
      password: values.password,
      image: values.image,
      bank_statement: values.bank_statement,
    };

    for (let key in formDataObject) {
      if (formDataObject[key] !== null && formDataObject[key] !== undefined) {
        if (Array.isArray(formDataObject[key])) {
          formDataObject[key].forEach((item, index) => {
            urlencoded.append(`${key}[${index}]`, item);
          });
        } else {
          urlencoded.append(key, formDataObject[key]);
        }
      }
    }

    if (formDataObject.image) {
      urlencoded.append("image", formDataObject.image);
    }
    if (formDataObject.bank_statement) {
      urlencoded.append("bank_statement", formDataObject.bank_statement);
    }
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
    dispatch(registerAggregator(urlencoded)).then((res) => {
      console.log(res, "33333");
      if (res.payload.data.status == true) {
        navigate("/Profile");
      }
    });
  };

  return (
    <section className="formSection">
      <div className="formImage col-md-5">
        <img src="/additional/formImg.jpg" alt="Form Illustration" />
      </div>
      <div className="formcontainerDiv col-md-7">
        <h3>Aggregator Registration</h3>
        <div className="formContainer">
          <Formik
            initialValues={{
              name: "",
              email: "",
              phone: "",
              pan_card: "",
              address: "",
              gst: "",
              zipcode: "",
              aadhar_number: "",
              password: "",
              image: null,
              bank_statement: null,
            }}
            onSubmit={handleRegisterAggregtor}
            validationSchema={AggratorRegistervalidationSchema}
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
                        onChange={(e) => {
                          const newValue = e.target.value.replace(/\s+/g, " ");
                          setFieldValue("name", newValue);
                          setFieldTouched("name", true);
                        }}
                        value={values.name}
                        onBlur={handleBlur}
                        name="name"
                        type="text"
                        placeholder="Name"
                      />
                    </div>
                    {touched.name && errors.name && (
                      <div className="error">{errors.name}</div>
                    )}
                  </div>
                  <div>
                    <div className="inputFeald">
                      <span className="material-symbols-outlined">phone</span>
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
                    {touched.phone && errors.phone && (
                      <div className="error">{errors.phone}</div>
                    )}
                  </div>
                </div>
               
                  <div className="inputWrapper">
                    <div>
                      <div className="inputFeald">
                        <span className="material-symbols-outlined">badge</span>
                        <input
                          onChange={(e) => {
                            const newValue = e.target.value;
                            setFieldValue(`pan_card`, newValue);
                            setFieldTouched(`pan_card`, true);
                          }}
                          value={values.pan_card}
                          name="pan_card"
                          type="text"
                          placeholder="Pan Card"
                        />
                      </div>
                 
                    {errors.pan_card && touched.pan_card && (
                      <div className="error">{errors.pan_card}</div>
                    )}
                     </div>
                
                    <div>
                      <div className="inputFeald">
                        <span className="material-symbols-outlined">email</span>
                        <input
                          onChange={(e) => {
                            const newValue = e.target.value.replace(
                              /\s+/g,
                              " "
                            );
                            setFieldValue(`email`, newValue);
                            setFieldTouched(`email`, true);
                          }}
                          value={values.email}
                          name="email"
                          type="email"
                          placeholder="Email"
                        />
                      </div>
                      {touched.name && errors.name && (
                        <div className="error">{errors.name}</div>
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
                          const newValue = e.target.value;
                          setFieldValue(`gst`, newValue);
                          setFieldTouched(`gst`, true);
                        }}
                        value={values.gst}
                        name="gst"
                        type="text"
                        placeholder="GST"
                      />
                    </div>
                    {errors.gst && touched.gst && (
                      <div className="error">{errors.gst}</div>
                    )}
                  </div>
                  <div>
                    <div className="inputFeald">
                      <span className="material-symbols-outlined">home</span>
                      <input
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setFieldValue(`address`, newValue);
                          setFieldTouched(`address`, true);
                        }}
                        value={values.address}
                        name="address"
                        type="text"
                        placeholder="Address"
                      />
                    </div>
                    {errors.gst && touched.gst && (
                      <div className="error">{errors.gst}</div>
                    )}
                  </div>
                  <div>
                    <div className="inputFeald">
                      <span className="material-symbols-outlined">
                        location_on
                      </span>
                      <input
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setFieldValue(`zipcode`, newValue);
                          setFieldTouched(`zipcode`, true);
                        }}
                        value={values.zipcode}
                        name="zipcode"
                        type="text"
                        placeholder="ZIP Code"
                      />
                    </div>
                    {errors.zipcode && touched.zipcode && (
                      <div className="error">{errors.zipcode}</div>
                    )}
                  </div>
                </div>
                <div className="inputWrapper">
                  <div>
                    <div className="inputFeald">
                      <span className="material-symbols-outlined">
                        credit_card
                      </span>
                      <input
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setFieldValue(`aadhar_number`, newValue);
                          setFieldTouched(`aadhar_number`, true);
                        }}
                        value={values.aadhar_number}
                        name="aadhar_number"
                        type="text"
                        placeholder="Aadhar Number"
                      />
                    </div>
                    {errors.aadhar_number && touched.aadhar_number && (
                      <div className="error">{errors.aadhar_number}</div>
                    )}
                  </div>
                  <div>
                    <div className="inputFeald">
                      <span className="material-symbols-outlined">lock</span>
                      <input
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setFieldValue(`password`, newValue);
                          setFieldTouched(`password`, true);
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
                <div className="inputWrapper mt-3">
                  <div>
                    User Image
                    <div className="inputFeald">
                      <span className="material-symbols-outlined">image</span>
                      <label className="inputLable" htmlFor="inputFile5">
                        Upload Image
                      </label>
                      <input
                        id="inputFile5"
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
                  <div>
                    Bank Statement
                    <div className="inputFeald">
                      <span className="material-symbols-outlined">
                        file_copy
                      </span>
                      <label className="inputLable" htmlFor="inputFile4">
                        Upload File
                      </label>
                      <input
                        id="inputFile4"
                        className="inputFealdClass"
                        accept="image/png, image/jpeg"
                        onChange={(e) =>
                          setFieldValue("bank_statement", e.target.files[0])
                        }
                        // value={values.image}
                        type="file"
                        // value={values.bank_statement}
                        name="bank_statement"
                      />
                    </div>
                    {errors.bank_statement && touched.bank_statement && (
                      <div className="error">{errors.bank_statement}</div>
                    )}
                  </div>
                </div>

                <div className="formSubminBtn">
                  <button type="submit">Register</button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </section>
  );
};

export default AggregatorRegister;
