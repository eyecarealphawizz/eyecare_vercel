import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { TbPlayerTrackNext, TbPlayerTrackPrev } from "react-icons/tb";
import Swal from "sweetalert2";
import "remixicon/fonts/remixicon.css";
import ipdImage5 from '../../Image/ipdImage5.png'
import {
  deleteCart, getCartList, updateCart,
} from "../../redux-components/features/cartSlice";

const Checkout = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, totalQuantity } = useSelector((state) => state.allCart);
  const [loading, setLoading] = useState({});
  const [product, setProduct] = useState(null);
  const cart_status =
    Array.isArray(cart) && cart.every((item) => item.status === 1);
  const token = localStorage.getItem("token");
  const authToken = token;
  const discount = 0;

  const initialState = {
    rightEye: {
      spherical: { sign: '+', value: [0, 0] },
      cylinder: { sign: '+', value: [0, 0] },
      axis: { value: 0 },
      addForNV: { sign: '+', value: [0, 0] },
    },
    leftEye: {
      spherical: { sign: '+', value: [0, 0] },
      cylinder: { sign: '+', value: [0, 0] },
      axis: { value: 0 },
      addForNV: { sign: '+', value: [0, 0] },
    },
  };
  
  const [eyedata, setData] = useState(initialState);
  console.log(eyedata);
  
    const handleChange1 = (eye, category, field, value) => {
      setData((prevData) => {
        const newField = { ...prevData[eye][category] };
  
        if (field === 'value') {
          let numericValue = parseFloat(value);
          
          if (value === '0.25' || value === '0.50' || value === '0.75') {
            newField.value[1] = numericValue;
          } else {
            newField.value[0] = numericValue; 
          }
        } else if (field === 'axis') {
          newField.value = parseInt(value);
        } else {
          newField[field] = value;
        }
  
        return {
          ...prevData,
          [eye]: {
            ...prevData[eye],
            [category]: newField,
          },
        };
      });
    };
  
    const renderSelectOptions = (max, step = 1, includeDecimals = false) => {
      const options = [];
      for (let i = 0; i <= max; i += step) {
        options.push(<option key={`option-${i}`} value={i}>{i}</option>);
      }
      if (includeDecimals) {
        options.push(<option key="option-decimal-0.25" value="0.25">.25</option>);
        options.push(<option key="option-decimal-0.50" value="0.50">.50</option>);
        options.push(<option key="option-decimal-0.75" value="0.75">.75</option>);
      }
      return options;
    };


  const totalPrice = Array.isArray(cart)
    ? cart.reduce((total, item) => total + item.price * item.quantity, 0)
    : 0;
  const totalAfterDiscount = totalPrice - discount;

  const handleQuantityChange = (val, change) => {
    const updatedQuantity = Math.max(
      cart.find((item) => item.id === val.id).quantity + change
    );

    const data = {
      key: val.id,
      quantity: updatedQuantity,
    };

    setLoading((prevState) => ({
      ...prevState,
      [`${val.id}-${change > 0 ? "increment" : "decrement"}`]: true,
    }));

    dispatch(updateCart(data)).then((res) => {
      setLoading((prevState) => ({
        ...prevState,
        [`${val.id}-${change > 0 ? "increment" : "decrement"}`]: false,
      }));
      if (res.payload.data.status === 1) {
        dispatch(getCartList());
      }
    });
  };

  const handleRemoveItem = (itemId) => {
    dispatch(deleteCart(itemId)).then((res) => {
      if (res.payload.status === 200) {
        dispatch(getCartList());
      }
    });
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
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
        icon: "info",
        title: "Your cart is empty",
      }).then(() => {
        navigate("/ProductPage");
      });
      return;
    }
    navigate("/ShippingAndBilling", {
      state: { totalPrice, totalAfterDiscount, totalQuantity },
    });
  };

  let left_spherical = `${eyedata.leftEye.spherical.sign}${(eyedata.leftEye.spherical.value[0] + eyedata.leftEye.spherical.value[1]).toFixed(2)}`;
  let left_cylinder = `${eyedata.leftEye.cylinder.sign}${(eyedata.leftEye.cylinder.value[0] + eyedata.leftEye.cylinder.value[1]).toFixed(2)}`;
  let left_axis = eyedata.leftEye.axis.value;
  let left_addfornv = `${eyedata.leftEye.addForNV.sign}${(eyedata.leftEye.addForNV.value[0] + eyedata.leftEye.addForNV.value[1]).toFixed(2)}`;
  let right_spherical = `${eyedata.rightEye.spherical.sign}${(eyedata.rightEye.spherical.value[0] + eyedata.rightEye.spherical.value[1]).toFixed(2)}`;
  let right_cylinder = `${eyedata.rightEye.cylinder.sign}${(eyedata.rightEye.cylinder.value[0] + eyedata.rightEye.cylinder.value[1]).toFixed(2)}`;
  let right_axis = eyedata.rightEye.axis.value;
  let right_addfornv = `${eyedata.rightEye.addForNV.sign}${(eyedata.rightEye.addForNV.value[0] + eyedata.rightEye.addForNV.value[1]).toFixed(2)}`;

  
  useEffect(() => {
    dispatch(getCartList());
  }, [totalQuantity]);

  const handleOpenModal = (itemId) => {
    const product = cart.find((item) => item.id === itemId);
    setProduct(product);
  };

  const [formData, setFormData] = useState({
    ipd_measure: "",
    age: "",
  });
  
  useEffect(() => {
    if (product) {
      setFormData({
        
        ipd_measure: product.ipd_measure || "",
        age: product.age || "",
      });
    }
  }, [product]);

  const [gender, setGender] = useState("male");
  const prescriptionImageRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleSubmit = async () => {
    let data = new FormData();

    const prescriptionImage = prescriptionImageRef.current.files[0];
    const isMeasurementimageSelected = document.querySelector(
      'button[data-bs-target="#pills-image"].active'
    );

    if (isMeasurementimageSelected) {
      
      if (!prescriptionImage) {
        Swal.fire({
          icon: "warning",
          title: "",
          text: "Prescription image is required.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        return;
      }
    }

    const isMeasurementValuesSelected = document.querySelector(
      'button[data-bs-target="#pills-value"].active'
    );
    if (isMeasurementValuesSelected) {
      function isInvalid(value) {
        return value === null || value === "" || value === 0 || value === "+0.00";
      }
      
      if (
        isInvalid(left_spherical) || isInvalid(left_cylinder) ||
        isInvalid(left_axis) || isInvalid(left_addfornv) ||
        isInvalid(right_spherical) || isInvalid(right_cylinder) ||
        isInvalid(right_axis) || isInvalid(right_addfornv)
      ) {
        Swal.fire({
          icon: "warning",
          title: "please fill all details in Refraction Card",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        return; 
      }
      
      data.append("left_spherical", left_spherical);
      data.append("left_cylinder", left_cylinder);
      data.append("left_axis", left_axis);
      data.append("left_addfornv", left_addfornv);
      data.append("right_spherical", right_spherical);
      data.append("right_cylinder", right_cylinder);
      data.append("right_axis", right_axis);
      data.append("right_addfornv", right_addfornv);

    }

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (prescriptionImage) {
      data.append("prescription_image", prescriptionImage);
    }
    
    data.append("gender", gender);
    data.append("cart_id", product?.id);
    data.append("product_id", product.product.id);
    data.append("status", 1);

    try {
      const response = await fetch(`${baseUrl}/api/v1/cart/add-prescription`, {
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const result = await response.json();
      if (response.ok) {
        Swal.fire({
          icon: "success",
          text: "Prescription added successfully!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        }).then(() => {
          window.location.reload();
        });
      } else {
        Swal.fire({
          icon: "error",
          text: result.message || "Failed to add prescription.",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        text: "Something went wrong!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1000,
        timerProgressBar: true,
      });
    }
  };

  const handleFaceIpdClick = () => {
    navigate("/Faceipd")
    window.location.reload(); 
  };

  return (
    <>
      <section className="checkoutSection">
        <h3>SHOPPING CART</h3>
        <div className="checkoutContainer">
          <div className="col-md-8">
            <div className="checkoutTableDiv">
              <h5>Cart Products</h5>
              <div className="table-responsive scrollable-table">
                <table className="table">
                  <thead className="table-light position-sticky top-0 z-2 checkoutTableHEad">
                    <tr>
                      <th>Sr No.</th>
                      <th>Product Name</th>
                      <th>Unit Price</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Prescription</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody className="checkoutBody">
                    {cart.length > 0 ? (
                      cart.map((item, index) => (
                        <tr key={item.id}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="tableImg">
                              <img
                                src={`${baseUrl}/storage/app/public/product/thumbnail/${item.thumbnail}`}
                                alt={item.name}
                                height={60}
                                width={60}
                                className="rounded-1"
                              />
                            </div>
                            <span className="ps-2">{item.name}</span>
                          </td>
                          <td>₹ {item.price}/-</td>
                          <td>
                            <div className="qtyInputDiv">
                              <button
                                onClick={() => handleQuantityChange(item, -1)}
                                disabled={
                                  loading[`${item.id}-decrement`] ||
                                  item.quantity <= 1
                                }
                              >
                                {loading[`${item.id}-decrement`] ? (
                                  <span className="spinner-border spinner-border-sm" />
                                ) : (
                                  "-"
                                )}
                              </button>

                              <input
                                value={item.quantity}
                                readOnly
                                className="form-control"
                              />
                              <button
                                onClick={() => handleQuantityChange(item, 1)}
                                disabled={loading[`${item.id}-increment`]}
                              >
                                {loading[`${item.id}-increment`] ? (
                                  <span className="spinner-border spinner-border-sm" />
                                ) : (
                                  "+"
                                )}
                              </button>
                            </div>
                          </td>
                          <td>₹ {Math.floor(item.price * item.quantity)}/-</td>
                          
                          <td>
                            <button
                              type="button"
                              className={` btn ${item.status === 1 ? 'pencilModelblue' : 'pencilModelyellow'}`} 
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModalPencil"
                              onClick={() => handleOpenModal(item.id)}
                            >
                              <i className="ri-pencil-fill"></i>
                          </button>
                          </td>

                          <td>
                            <div
                              className="removeBtn"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <span className="material-symbols-outlined">
                                close
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center">
                          No items in the cart.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="checkoutBtnDiv">
              <Link to="/ProductPage">
                <button className="btn btn-primary px-lg-3 p-2 mt-2">
                  <TbPlayerTrackPrev /> Continue shopping
                </button>
              </Link>

              {cart_status !== false ? (
                <button
                  onClick={handleCheckout}
                  className="btn btn-primary px-lg-5 p-2 mt-2"
                >
                  Continue Checkout <TbPlayerTrackNext />
                </button>
              ) : (
                <button className="btn btn-primary px-lg-5 p-2 mt-2" disabled>
                  Continue Checkout <TbPlayerTrackNext />
                </button>
              )}
            </div>
          </div>
          <div className="col-md-4 checkoutRightSide">
            <h5>Payment Details</h5>
            <ul className="list-unstyled paymentListMenu">
              <li className="d-flex justify-content-between mb-2">
                <span>GST</span>
                <strong>₹ 0.00</strong>
              </li>
              <li className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <strong>₹ 0.00</strong>
              </li>
              <li className="d-flex justify-content-between mb-2">
                <span>Discount on product</span>
                <strong className="text-danger">
                  -₹ {discount.toLocaleString()}
                </strong>
              </li>
              <li className="d-flex justify-content-between mb-2">
                <span>Sub Total</span>
                <strong>₹ {totalPrice.toLocaleString()}</strong>
              </li>
            </ul>
            <div className="couponDiv">
              <div className="inputFeald">
                <span className="material-symbols-outlined">receipt</span>
                <input
                  type="text"
                  placeholder="Coupon code"
                  style={{ outline: "none" }}
                />
              </div>
              <button>Apply code</button>
            </div>
            <div className="totalAmountDiv">
              <span>Total</span>
              <strong>₹ {totalAfterDiscount.toLocaleString()}/-</strong>
            </div>
            <div className="policyContainer">
              <div className="col-md-3 policyDiv">
                <i className="bi bi-truck fs-1 text-primary"></i>
                <p>3 Days Free Delivery</p>
              </div>

              <div className="col-md-3 policyDiv">
                <i className="bi bi-box-arrow-in-left fs-1 text-warning"></i>
                <p>Money Back Guarantee</p>
              </div>

              <div className="col-md-3 policyDiv">
                <i className="bi bi-shield-check fs-1 text-success"></i>
                <p>100% Genuine Product</p>
              </div>

              <div className="col-md-3 policyDiv">
                <i className="bi bi-credit-card fs-1 text-info"></i>
                <p>Authentic Payment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        className="modal fade"
        id="exampleModalPencil"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered checkoutModal">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Eye Prescription
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body modalConatinerDiv">
              <ul className="nav nav-pills mb-3 ref-IpdDiv" id="pills-tab" role="tablist">
                <li className="nav-item w-50" role="presentation">
                  <button
                    className="nav-link active w-100"
                    id="pills-refrection-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-refrection"
                    type="button"
                    role="tab"
                    aria-controls="pills-refrection"
                    aria-selected="true"
                  >
                    Refraction Card
                  </button>
                </li>
                <li className="nav-item w-50" role="presentation">
                  <button
                    className="nav-link w-100"
                    id="pills-IprdInfo-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-IprdInfo"
                    type="button"
                    role="tab"
                    aria-controls="pills-IprdInfo"
                    aria-selected="false"
                  >
                    IPD Info
                  </button>
                </li>
              </ul>
              <div className="tab-content" id="pills-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="pills-refrection"
                  role="tabpanel"
                  aria-labelledby="pills-refrection-tab"
                  tabindex="0"
                >
                  <ul className="nav nav-pills mb-3 img-valueDiv" id="pills-tab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        id="pills-image-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-image"
                        type="button"
                        role="tab"
                        aria-controls="pills-image"
                        aria-selected="true"
                      >
                        Image
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="pills-value-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-value"
                        type="button"
                        role="tab"
                        aria-controls="pills-value"
                        aria-selected="false"
                      >
                        Value
                      </button>
                    </li>                  
                  </ul>
                  <div className="tab-content" id="pills-tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="pills-image"
                      role="tabpanel"
                      aria-labelledby="pills-image-tab"
                      tabindex="0"
                    >
                    
                  <div className="imageContainer">
                  {product?.prescription_image && (
                  <div className="tableImg modalCheckout">
                    <img
                      src={`${baseUrl}/storage/app/public/cart/prescriptions/${product.prescription_image}`}
                      alt="Prescription"
                      height={60}
                      width={60}
                      className="rounded-1"
                    />
                  </div>
                )}
                    <div className="imgInput">
                      <label htmlFor="imgInput">Upload Image</label>
                    
                <div>
                <input
                  className="form-control"
                  type="file"
                  ref={prescriptionImageRef}
                  required
                  id="imgInput"
                />
                </div>
                    </div>
                    <p>*Note: IPD (Interpupillary Distance) refers to the distance between the centers of your two pupils, measured in millimeters (mm).</p>
                  </div>

                    </div>
                    <div
                      className="tab-pane fade"
                      id="pills-value"
                      role="tabpanel"
                      aria-labelledby="pills-value-tab"
                      tabindex="0"
                    >
                    <div className="valueTableDiv"> 
      <h2>Refraction Card</h2>
      <table>
        <thead>
          <tr>
            <th>EYE/VISION</th>
            <th>SPHERICAL</th>
            <th>CYLINDER</th>
            <th>AXIS</th>
            <th>ADD FOR NV</th>
          </tr>
        </thead>
        <tbody>
          {['rightEye', 'leftEye'].map((eye) => (
            <tr key={eye}>
              <td>{eye === 'rightEye' ? 'RIGHT EYE' : 'LEFT EYE'}</td>
              <td>
                <div>
                  <select onChange={(e) => handleChange1(eye, 'spherical', 'sign', e.target.value)}>
                    <option value="+">+</option>
                    <option value="-">-</option>
                  </select>
                  <select onChange={(e) => handleChange1(eye, 'spherical', 'value', e.target.value)}>
                    {renderSelectOptions(30)}
                  </select>
                  <select onChange={(e) => handleChange1(eye, 'spherical', 'value', e.target.value)}>
                    {renderSelectOptions(0.25, 0.75, true)}
                  </select>
                </div>
              </td>
              <td>
                <div>
                  <select onChange={(e) => handleChange1(eye, 'cylinder', 'sign', e.target.value)}>
                    <option value="+">+</option>
                    <option value="-">-</option>
                  </select>
                  <select onChange={(e) => handleChange1(eye, 'cylinder', 'value', e.target.value)}>
                    {renderSelectOptions(10)}
                  </select>
                  <select onChange={(e) => handleChange1(eye, 'cylinder', 'value', e.target.value)}>
                    {renderSelectOptions(0.25, 0.75, true)}
                  </select>
                </div>
              </td>
              <td>
                <div>
                  <select onChange={(e) => handleChange1(eye, 'axis', 'axis', e.target.value)}>
                    {renderSelectOptions(180, 10)}
                  </select>
                </div>
              </td>
              <td>
                <div>
                  <select onChange={(e) => handleChange1(eye, 'addForNV', 'sign', e.target.value)}>
                    <option value="+">+</option>
                  </select>
                  <select onChange={(e) => handleChange1(eye, 'addForNV', 'value', e.target.value)}>
                    {renderSelectOptions(5)}
                  </select>
                  <select onChange={(e) => handleChange1(eye, 'addForNV', 'value', e.target.value)}>
                    {renderSelectOptions(0.25, 0.75, true)}
                  </select>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-IprdInfo"
                  role="tabpanel"
                  aria-labelledby="pills-IprdInfo-tab"
                  tabindex="0"
                >
                  <div className="IpdImageContainer">
                    <img src={ipdImage5} alt="" />
                    <p>IPD (Interpupillary Distance) refers to the distance between the centers of your two pupils, measured in millimeters (mm).
                      <p>Stand in front of a mirror about 20 cm (8 inches) away.</p>
                      <p>Close your right eye and align the 0 mm mark of the ruler with the center of your left pupil.</p>
                      <p>Without moving the ruler, open your right eye and close your left eye.</p>
                      <p>Look straight ahead and note the measurement that aligns with the center of your right pupil.</p>
                      <p>The number you see (in mm) is your IPD.</p>
                    </p>
                  </div>
                  
                  <div className="div-ipd-gender-feilds row">
                    <div className="ips-input-feild ipdInputValueDiv col-md-6 mb-3">
                      <label className="form-label">Enter your IPD value:</label>
                      <input
                        type="number"
                        className="form-control"
                        name="ipd_measure"
                        value={formData.ipd_measure}
                        placeholder="Enter IPD Value"
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="ips-input-feild ipdInputValueDiv col-md-6 mb-3">
                    <label className="form-label">Check your Ipd:</label>
                    <div>
                      <button className="ipdModalBtn" onClick={handleFaceIpdClick}>IPD</button>
                    </div>
                    </div>
                    <div className="ips-input-feild ipdInputValueDiv col-md-6 mb-3">
                      <label className="form-label">Enter your age</label>
                      <input
                        type="number"
                        className="form-control"
                        name="age"
                        value={formData.age}
                        placeholder="Enter your age"
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="gender-feilds gender-form-fields ipdInputValueDiv col-md-6 mb-3">
                      <label className="form-label gender-class">Select your Gender:</label>
                      <div className="gender-inputs-feild">
                        <input
                          type="radio"
                          id="male"
                          name="gender"
                          value="male"
                          onChange={handleGenderChange}
                          defaultChecked
                        />
                        <label htmlFor="male">Male</label>

                        <input
                          type="radio"
                          id="female"
                          name="gender"
                          value="female"
                          onChange={handleGenderChange}
                        />
                        <label htmlFor="female">Female</label>

                        <input
                          type="radio"
                          id="other"
                          name="gender"
                          value="other"
                          onChange={handleGenderChange}
                        />
                        <label htmlFor="other">Other</label>
                      </div>
                    </div>
                  </div>
                  <p className="ipdNote">Note: You can only fill this form once. you cannot change the information that you have entered!</p>               
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn pencil"
                data-bs-dismiss="modal"
              >
                Close
              </button>

              {
               product?.status !== 1 && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="pencilModel btn submitModalBtn"
                >
                  Submit
                </button> 
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
