import React, { useState } from "react";
import "../Global.css";
import { useNavigate } from "react-router-dom";
import { Formik } from "formik";
import { DoctorRegistervalidationSchema } from "./validation";
import { useDispatch } from "react-redux";
import { registerDoctor } from "../redux-components/features/cartSlice";
import Swal from "sweetalert2";

const DoctorRegister = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const doctorRegister = async (values) => {
    console.log(values, "alert-items");
    const urlencoded = new FormData();
    const formDataObject = {
      name: values.name,
      qualification: values.qualification,
      passing_year: values.passing_year,
      email: values.email,
      phone: values.phone,
      clinic_name: values.clinic_name,
      clinic_address: values.clinic_address,
      license_number: values.license_number,
      medical_council: values.medical_council,
      pan_card: values.pan_card,
      gender: values.gender,
      address: values.address,
      password: values.password,
      certificate_image: values.certificate_image,
      image: values.image,
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

    if (formDataObject.certificate_image) {
      urlencoded.append("certificate_image", formDataObject.certificate_image);
    }
    if (formDataObject.image) {
      urlencoded.append("image", formDataObject.image);
    }

    console.log("URL Encoded Data:", urlencoded); 
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
      return;
    }
    dispatch(registerDoctor(urlencoded)).then((res) => {
      console.log(res, "33333");
      if (res.payload.data.status == true) {
        navigate("/Profile");
      }
    });
  };

  return (
    <section className="formSection">
      <div className="formImage col-md-5">
        <img src="/additional/formImg.jpg" alt="" />
      </div>
      <div className="formcontainerDiv col-md-7">
        <h3>Doctor Registration</h3>
        <div className="formContainer">
          <Formik
            initialValues={{
              name: "",
              qualification: [""],
              passing_year: [""],
              email: "",
              phone: "",
              clinic_name: "",
              clinic_address: "",
              license_number: "",
              medical_council: "",
              pan_card: "",
              gender: "",
              address: "",
              password: "",
              certificate_image: null,
              image: null,
            }}
            validationSchema={DoctorRegistervalidationSchema}
            onSubmit={doctorRegister}
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
                {console.log(errors, "errors")}
                <div className="inputFeald">
                  <input
                    name="name"
                    onChange={(e) => {
                      const newValue = e.target.value.replace(/\s+/g, " ");
                      setFieldValue("name", newValue);
                      setFieldTouched("name", true);
                    }}
                    value={values.name}
                    onBlur={handleBlur}
                    type="text"
                    placeholder="Full Name"
                  />
                </div>
                {touched.name && errors.name && (
                  <div className="error">{errors.name}</div>
                )}

                <div className="formLable">Qualifications:</div>
                <div className="dynamicInputFealds">
                  {values.qualification.map((qual, index) => (
                    <div key={index} className="dynamicField inputFeald">
                      <input
                        name={`qualification[${index}]`}
                        type="text"
                        value={qual}
                        placeholder="Qualification"
                        onChange={(e) => {
                          const newValue = e.target.value.replace(/\s+/g, " ");
                          setFieldValue(`qualification[${index}]`, newValue);
                          setFieldTouched(`qualification[${index}]`, true);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedQualifications = [
                            ...values.qualification,
                          ];
                          updatedQualifications.splice(index, 1);
                          setFieldValue("qualification", updatedQualifications);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="addQualification"
                    onClick={() =>
                      setFieldValue("qualification", [
                        ...values.qualification,
                        "",
                      ])
                    }
                  >
                    Add Qualification
                  </button>
                </div>

                {errors.qualification && touched.qualification && (
                  <div className="error">{errors.qualification}</div>
                )}

                <div className="formLable">Passing Years:</div>
                <div className="dynamicInputFealds">
                  {values.passing_year.map((year, index) => (
                    <div key={index} className="dynamicField inputFeald">
                      <input
                        name={`passing_year[${index}]`}
                        type="text"
                        value={year}
                        placeholder="Passing Year"
                        onChange={(e) => {
                          const newValue = e.target.value.replace(/\s+/g, " ");
                          setFieldValue(`passing_year[${index}]`, newValue);
                          setFieldTouched(`passing_year[${index}]`, true);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedYears = [...values.passing_year];
                          updatedYears.splice(index, 1);
                          setFieldValue("passing_year", updatedYears);
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    className="addQualification"
                    onClick={() =>
                      setFieldValue("passing_year", [
                        ...values.passing_year,
                        "",
                      ])
                    }
                  >
                    Add Passing Year
                  </button>
                </div>
                {errors.passing_year && touched.passing_year && (
                  <div className="error">{errors.passing_year}</div>
                )}
                <div className="inputWrapper">
                  <div>
                    <div className="inputFeald">
                      <input
                        name="email"
                        onChange={(e) => {
                          const newValue = e.target.value.replace(/\s+/g, " ");
                          setFieldValue(`email`, newValue);
                          setFieldTouched(`email`, true);
                        }}
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
                      <input
                        name="phone"
                        onChange={(e) => {
                          const inputValue = e.target.value.replace(/\D/g, "");
                          if (inputValue !== "0") {
                            setFieldValue("phone", inputValue.slice(0, 10));
                          }
                        }}
                        value={values.phone}
                        type="text"
                        placeholder="Phone No."
                      />
                    </div>
                    {errors.phone && touched.phone && (
                      <div className="error">{errors.phone}</div>
                    )}
                  </div>
                </div>

                <div className="inputWrapper">
                  <div>
                    <div className="inputFeald">
                      <input
                        name="clinic_name"
                        onChange={(e) => {
                          const newValue = e.target.value.replace(/\s+/g, " ");
                          setFieldValue(`clinic_name`, newValue);
                          setFieldTouched(`clinic_name`, true);
                        }}
                        value={values.clinic_name}
                        type="text"
                        placeholder="Clinic Name"
                      />
                    </div>
                    {errors.clinic_name && touched.clinic_name && (
                      <div className="error">{errors.clinic_name}</div>
                    )}
                  </div>
                  <div>
                    <div className="inputFeald">
                      <input
                        name="clinic_address"
                        onChange={(e) => {
                          const newValue = e.target.value.replace(/\s+/g, " ");
                          setFieldValue(`clinic_address`, newValue);
                          setFieldTouched(`clinic_address`, true);
                        }}
                        value={values.clinic_address}
                        type="text"
                        placeholder="Clinic Address"
                      />
                    </div>
                    {errors.clinic_address && touched.clinic_address && (
                      <div className="error">{errors.clinic_address}</div>
                    )}
                  </div>
                </div>

                <div className="inputWrapper">
                  <div>
                    <div className="inputFeald">
                      <input
                        name="license_number"
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setFieldValue(`license_number`, newValue);
                          setFieldTouched(`license_number`, true);
                        }}
                        value={values.license_number}
                        type="text"
                        placeholder="License Number"
                      />
                    </div>
                    {errors.license_number && touched.license_number && (
                      <div className="error">{errors.license_number}</div>
                    )}
                  </div>
                  <div>
                    <div className="inputFeald">
                      <input
                        name="medical_council"
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setFieldValue(`medical_council`, newValue);
                          setFieldTouched(`medical_council`, true);
                        }}
                        value={values.medical_council}
                        type="text"
                        placeholder="Medical Council"
                      />
                    </div>
                    {errors.medical_council && touched.medical_council && (
                      <div className="error">{errors.medical_council}</div>
                    )}
                  </div>
                </div>

                <div className="inputWrapper">
                  <div>
                    <div className="inputFeald">
                      <input
                        name="pan_card"
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setFieldValue(`pan_card`, newValue);
                          setFieldTouched(`pan_card`, true);
                        }}
                        value={values.pan_card}
                        type="text"
                        placeholder="Pan Card"
                      />
                    </div>
                    {errors.pan_card && touched.pan_card && (
                      <div className="error">{errors.pan_card}</div>
                    )}
                  </div>
                  <div>
                    <div className="formLable">Gender:</div>
                    <div className="inputFeald">
                      <select
                        name="gender"
                        value={values.gender}
                        onChange={(e) => {
                          setFieldValue("gender", e.target.value);
                          setFieldTouched("gender", true);
                        }}
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    {errors.gender && touched.gender && (
                      <div className="error">{errors.gender}</div>
                    )}
                </div>
                </div>
                <div className="inputWrapper">
                  <div>
                    <div className="inputFeald">
                      <input
                        name="address"
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setFieldValue(`address`, newValue);
                          setFieldTouched(`address`, true);
                        }}
                        value={values.address}
                        type="text"
                        placeholder="Address"
                      />
                    </div>
                    {errors.address && touched.address && (
                      <div className="error">{errors.address}</div>
                    )}
                  </div>

                  <div>
                    <div className="inputFeald">
                      <input
                        name="password"
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setFieldValue(`password`, newValue);
                          setFieldTouched(`password`, true);
                        }}
                        value={values.password}
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
                    <div>
                      Certificate Image
                      <div className="inputFeald">
                        <label className="inputLable" htmlFor="inputFile3">
                          Upload Image
                        </label>
                        <input
                          id="inputFile3"
                          name="certificate_image"
                          type="file"
                          accept="image/png, image/jpeg"
                          onChange={(e) =>
                            setFieldValue(
                              "certificate_image",
                              e.target.files[0]
                            )
                          }
                        />
                      </div>
                    </div>
                    {errors.certificate_image && touched.certificate_image && (
                      <div className="error">{errors.certificate_image}</div>
                    )}
                  </div>

                  <div>
                    <div>
                      Result Image
                      <div className="inputFeald">
                        <label className="inputLable" htmlFor="inputFile1">
                          Upload Image
                        </label>
                        <input
                          id="inputFile1"
                          name="image"
                          type="file"
                          accept="image/png, image/jpeg"
                          onChange={(e) =>
                            setFieldValue("image", e.target.files[0])
                          }
                        />
                      </div>
                    </div>
                    {errors.certificate_image && touched.certificate_image && (
                      <div className="error">{errors.certificate_image}</div>
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
  );
};

export default DoctorRegister;
