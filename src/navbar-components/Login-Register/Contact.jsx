// import React, { useState } from "react";
// import "../../App.css";

// const Contact = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     subject: "",
//     description: "",
//   });

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   // const handleSubmit = (e) => {
//   //   e.preventDefault();
//   //   console.log("Form submitted:", formData);
//   //   setFormData({
//   //     name: "",
//   //     email: "",
//   //     subject: "",
//   //     description: "",
//   //   });
//   // };

//   return (
//     <>
//       <section className="contactSection">
//         <div className="container">
//           <div className="contactContainer">
//             <div className="contactHead col-md-6 col-12">
//               <h3>Feel free to <span>Contact !</span></h3>
//               <p>
//                 Lorem ipsum dolor sit amet consectetur, adipisicing elit.
//                 Tenetur veniam explicabo, modi at nisi consequuntur!
//               </p>
//               <div className="contactForm">
//                 <form action="">
//                   <div className="contactInputFeald">
//                     <span className="material-symbols-outlined">person</span>
//                     <input
//                       type="text"
//                       id="name"
//                       name="name"
//                       value={formData.name}
//                       placeholder="Full Name"
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>
//                   <div className="contactInputFeald">
//                     <span className="material-symbols-outlined">mail</span>
//                     <input
//                       type="email"
//                       id="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       placeholder="Email"
//                       required
//                     />
//                   </div>
//                   <div className="contactInputWrapper">
//                     <div className="contactInputFeald">
//                       <span className="material-symbols-outlined">description</span>
//                       <input
//                         type="text"
//                         id="subject"
//                         name="subject"
//                         value={formData.subject}
//                         placeholder="Subject"
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>
//                     <div className="contactInputFeald">
//                       <span className="material-symbols-outlined">
//                         location_city
//                       </span>
//                       <input type="text" placeholder="City" />
//                     </div>
//                   </div>
//                   <div className="contactTextarea">
//                     <span className="material-symbols-outlined">chat</span>
//                     <textarea
//                       id="description"
//                       name="description"
//                       value={formData.description}
//                       placeholder="Message"
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>
//                   <div className="contactBtn">
//                     <button className="submit-btn">Submit</button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//             <div className="contactImg col-md-5 col-12">
//              <img src="../../../additional/contactImg.png" alt="" />
//             </div>
//           </div>
//         </div>
//       </section>
      
//     </>
//   );
// };

// export default Contact;



import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import "../../App.css";

const Contact = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      subject: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(2, "Name must be at least 2 characters")
        .required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      subject: Yup.string()
        .min(3, "Subject must be at least 3 characters")
        .required("Subject is required"),
      description: Yup.string()
        .min(10, "Message must be at least 10 characters")
        .required("Message is required"),
    }),
    onSubmit: (values, { resetForm }) => {
      Swal.fire({
        icon: "success",
        title: "We will contact you soon.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
      console.log(values);
      resetForm();
    },
  });

  return (
    <>
      <section className="contactSection">
        <div className="container">
          <div className="contactContainer">
            <div className="contactHead col-md-6 col-12">
              <h3>
                Feel free to <span>Contact!</span>
              </h3>
              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Tenetur veniam explicabo, modi at nisi consequuntur!
              </p>
              <div className="contactForm">
                <form onSubmit={formik.handleSubmit}>
                  <div className="contactInputFeald">
                    <span className="material-symbols-outlined">person</span>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Full Name"
                      {...formik.getFieldProps("name")}
                    />
                  </div>
                    {formik.touched.name && formik.errors.name ? (
                      <div className="error">{formik.errors.name}</div>
                    ) : null}
                  <div className="contactInputFeald">
                    <span className="material-symbols-outlined">mail</span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email"
                      {...formik.getFieldProps("email")}
                    />
                  </div>
                    {formik.touched.email && formik.errors.email ? (
                      <div className="error">{formik.errors.email}</div>
                    ) : null}
                  <div className="contactInputWrapper">
                  <div className="customWrapper">
                    <div className="contactInputFeald">
                      <span className="material-symbols-outlined">
                        description
                      </span>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        placeholder="Subject"
                        {...formik.getFieldProps("subject")}
                      />
                    </div>
                      {formik.touched.subject && formik.errors.subject ? (
                        <div className="error">{formik.errors.subject}</div>
                      ) : null}
                 </div>
                    <div className="contactInputFeald">
                      <span className="material-symbols-outlined">
                        location_city
                      </span>
                      <input type="text" placeholder="City" />
                    </div>
                  </div>
                  <div className="contactTextarea">
                    <span className="material-symbols-outlined">chat</span>
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Message"
                      {...formik.getFieldProps("description")}
                    />
                  </div>
                    {formik.touched.description && formik.errors.description ? (
                      <div className="error">{formik.errors.description}</div>
                    ) : null}
                  <div className="contactBtn">
                    <button type="submit" className="submit-btn">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
            <div className="contactImg col-md-5 col-12">
              <img src="../../../additional/contactImg.png" alt="" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
