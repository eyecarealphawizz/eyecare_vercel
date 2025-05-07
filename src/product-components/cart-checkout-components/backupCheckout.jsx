import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { TbPlayerTrackNext, TbPlayerTrackPrev } from "react-icons/tb";
import Swal from "sweetalert2";
import "remixicon/fonts/remixicon.css";
import {
  deleteCart,
  getCartList,
  updateCart,
} from "../../redux-components/features/cartSlice";

const Checkout = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, totalQuantity } = useSelector((state) => state.allCart);
  const [loading, setLoading] = useState({});
  const [product, setProduct] = useState(null);
  const cart_status = Array.isArray(cart) && cart.every(item => item.status === 1);


  // console.log(cart);
  // console.log(cart_status);
  const token = localStorage.getItem("token");
  const authToken = token;
  const discount = 0;
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
        timer: 1000,
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

  useEffect(() => {
    dispatch(getCartList());
  }, [totalQuantity]);

  const handleOpenModal = (itemId) => {
    const product = cart.find((item) => item.id === itemId);
    setProduct(product);
  };

  const [formData, setFormData] = useState({
    ipd_measure: "",
    right_ucva: "",
    right_spherical: "",
    right_cylinder: "",
    right_axis: "",
    right_bcva: "",
    right_addfornv: "",
    left_ucva: "",
    left_spherical: "",
    left_cylinder: "",
    left_axis: "",
    left_bcva: "",
    left_addfornv: "",
  });


  useEffect(() => {
    if (product) {
      setFormData({
        ipd_measure: product.ipd_measure || "",
        left_ucva: product.left_ucva || '',
        left_spherical: product.left_spherical || '',
        left_cylinder: product.left_cylinder || '',
        left_axis: product.left_axis || '',
        left_bcva: product.left_bcva || '',
        left_addfornv: product.left_addfornv || '',
        right_ucva: product.right_ucva || '',
        right_spherical: product.right_spherical || '',
        right_cylinder: product.right_cylinder || '',
        right_axis: product.right_axis || '',
        right_bcva: product.right_bcva || '',
        right_addfornv: product.right_addfornv || '',

      });
    }
  }, [product]);

  const [gender, setGender] = useState("male");
  const prescriptionImageRef = useRef(null);
  const measurementImageRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleSubmit = async () => {
    let data = new FormData();

    if (!gender) {
      Swal.fire({
        icon: "warning",
        title: "Missing Gender",
        text: "Please select your gender.",
      });
      return;
    }



    const isMeasurementValuesSelected = document.querySelector(
      'button[data-bs-target="#pills-profile"].active'
    );

    if (isMeasurementValuesSelected) {
      const allMeasurementFieldsFilled = [...Object.keys(formData)].every(
        (key) => formData[key] !== ""
      );
      // console.log(formData);

      if (!allMeasurementFieldsFilled) {
        Swal.fire({
          icon: "warning",
          title: "Incomplete Measurement Values",
          text: "Please fill in all the fields for both eyes.",
        });
        return;
      }
    }

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    const prescriptionImage = prescriptionImageRef.current.files[0];
    if (prescriptionImage) {
      data.append('prescription_image', prescriptionImage);
    }

    const measurementImage = measurementImageRef.current.files[0];
    if (measurementImage) {
      data.append('eyemeasure_image', measurementImage);
    }

    data.append("gender", gender);
    data.append("cart_id", product?.id);
    data.append("product_id", product.product.id);
    data.append("status", 1);


    try {
      const response = await fetch(
        `${baseUrl}/api/v1/cart/add-prescription`,
        {
          method: "POST",
          body: data,
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const result = await response.json();
      // console.log("Response:", result);

      if (response.ok) {
        Swal.fire({
          icon: "success",
          text: "Prescription added successfully!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1000,
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
          timer: 1000,
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
                              className="pencilModel btn"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModalPencil"
                              onClick={() => handleOpenModal(item.id)}
                            >
                              <i className="ri-pencil-fill "></i>
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

              {
                cart_status !== false ? (
                  <button
                    onClick={handleCheckout}
                    className="btn btn-primary px-lg-5 p-2 mt-2"
                  >
                    Continue Checkout <TbPlayerTrackNext />
                  </button>
                ) : <button
                  className="btn btn-primary px-lg-5 p-2 mt-2" disabled
                >
                  Continue Checkout <TbPlayerTrackNext />
                </button>
              }



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
        <div className="modal-dialog modal-dialog-centered">
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
              <div className="mb-3">
                <label className="form-label">Prescription Image</label>
                {product?.prescription_image && (
                  <div className="tableImg">
                    <img
                      src={`${baseUrl}/storage/app/public/cart/prescriptions/${product.prescription_image}`}
                      alt="Prescription"
                      height={60}
                      width={60}
                      className="rounded-1"
                    />
                  </div>
                )}
                <input
                  className="form-control"
                  type="file"
                  ref={prescriptionImageRef}
                  required
                />
              </div>

              <div className="div-ipd-gender-feilds d-flex">
                <div className="mb-3 ips-input-feild">
                  <label className="form-label">IPD :</label>
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
                <div className="gender-feilds gender-form-fields">
                  <label className="form-label gender-class">Gender:</label>
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

              <ul className="nav nav-pills mb-3 new-nav" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active masure-button"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-home"
                    type="button"
                    role="tab"
                    aria-selected="true"
                  >
                    Measurement Image
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link masure-button"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-profile"
                    type="button"
                    role="tab"
                    aria-selected="false"
                  >
                    Measurement Value
                  </button>
                </li>
              </ul>

              <div className="tab-content">
                {/* Measurement Image */}
                <div
                  className="tab-pane fade show active"
                  id="pills-home"
                  role="tabpanel"
                >
                  <div className="mb-3">
                    <label className="form-label">Eye Measurement Image</label>
                    {product?.eyemeasure_image && (
                      <div className="tableImg">
                        <img
                          src={`${baseUrl}/storage/app/public/cart/eyemeasures/${product.eyemeasure_image}`}
                          alt="Eye Measurement"
                          height={60}
                          width={60}
                          className="rounded-1"
                        />
                      </div>
                    )}
                    <input
                      className="form-control"
                      type="file"
                      ref={measurementImageRef}
                    />
                  </div>

                </div>

                {/* Measurement Values */}
                <div
                  className="tab-pane fade"
                  id="pills-profile"
                  role="tabpanel"
                >
                  <div className="mb-3 d-flex">
                    {/* Right Eye */}
                    <div className="col-6 text-center">
                      <p className="right-eye-para">Right Eye</p>
                      <div className="col-lg-11 col-sm-12 m-auto">
                        {[
                          "ucva",
                          "spherical",
                          "cylinder",
                          "axis",
                          "bcva",
                          "addfornv",
                        ].map((field) => (
                          // console.log('my field', field),
                          <input
                            key={field}
                            type="number"
                            className="form-control mt-2"
                            placeholder={`Right-${field.toUpperCase()}`}
                            name={`right_${field}`}
                            value={formData[`right_${field}`]}
                            onChange={handleChange}
                            required
                          />
                        ))}
                      </div>
                    </div>

                    {/* Left Eye */}
                    <div className="col-6 text-center">
                      <p className="right-eye-para">Left Eye</p>
                      <div className="col-lg-11 col-sm-12 m-auto">
                        {[
                          "ucva",
                          "spherical",
                          "cylinder",
                          "axis",
                          "bcva",
                          "addfornv",
                        ].map((field) => (
                          <input
                            key={field}
                            type="number"
                            className="form-control mt-2"
                            placeholder={`Left-${field.toUpperCase()}`}
                            name={`left_${field}`}
                            value={formData[`left_${field}`]}
                            onChange={handleChange}
                            required
                          />
                        ))}
                      </div>
                    </div>
                  </div>
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
              <button
                type="button"
                onClick={handleSubmit}
                className="pencilModel btn"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default Checkout;
