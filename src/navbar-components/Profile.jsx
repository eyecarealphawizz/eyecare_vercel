import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import Swal from "sweetalert2";
import "../App.css";
import {
  getAppoitmentList,
  getOrderList,
  getOrderDetails,
  getWishList,
  getuserProfile,
  updateUserProfile,
  addProduct,
  removeWishList,
} from "../redux-components/features/cartSlice";

const ProfilePage = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const {
    confirmedOrders,
    orderList,
    orderDetailsList,
    appoitmentList,
    userProfile,
  } = useSelector((state) => state.allCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // code for profile is start from here
  const [errors, setErrors] = useState({
    f_name: "",
    l_name: "",
    phone: "",
  });

  const [formData, setFormData] = useState({
    f_name: "",
    l_name: "",
    phone: "",
    email: "",
    bio: "",
    address: "",
    city: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error messages on input change
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // Validation function for the form
  const validateForm = () => {
    let isValid = true;
    let newErrors = { ...errors };

    // Validate first name
    if (formData.f_name.trim().length < 3) {
      newErrors.f_name = "First name must be at least 3 characters long.";
      isValid = false;
    }

    // Validate last name
    if (formData.l_name.trim().length < 3) {
      newErrors.l_name = "Last name must be at least 3 characters long.";
      isValid = false;
    }

    // Validate phone number (must be exactly 10 digits)
    if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Load user data on component mount
  useEffect(() => {
    if (userProfile) {
      setFormData({
        f_name: "",
        l_name: "",
        email: "",
        phone: "",
        bio: "",
        address: "",
        city: "",
      });
    }
  }, [userProfile]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate the form before submission
    if (!validateForm()) {
      return;
    }
    dispatch(updateUserProfile(formData));
  };

  // Load user data on component mount
  useEffect(() => {
    if (userProfile) {
      setFormData({
        f_name: userProfile.f_name || "",
        l_name: userProfile.l_name || "",
        email: userProfile.email,
        bio: userProfile.bio || "",
        address: userProfile.address || "",
        phone: userProfile.phone || "",
        city: userProfile.city || "",
      });
    }
  }, [userProfile]);

  // code to get wishlist
  const [wishlist, setWishList] = useState([]);
  useEffect(() => {
    dispatch(getWishList()).then((res) => {
      setWishList(res?.payload);
    });
  }, [dispatch]);

  // code for add product to cart
  const handleAddToCart = (product) => {
    dispatch(addProduct(product)).then((res) => {
      if (res.payload.data.status === 1) {
        dispatch(removeWishList(product)).then(() => {
          window.location.reload();
          dispatch(getWishList());
        });
      }
    });
  };

  const handleDelete = (val) => {
    const urlencoded = new URLSearchParams();
    urlencoded.append("address_id", val.id);
    dispatch(removeWishList(val)).then((res) => {
      window.location.reload();
      dispatch(getWishList());
    });
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const userOrders =
        JSON.parse(localStorage.getItem(`orders_${user.id}`)) || [];
    }
  }, [confirmedOrders]);

  // code to logout user
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      showCancelButton: true,
      confirmButtonText: "Yes, Log Out",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
        window.location.reload();
      }
    });
  };

  // code for modals
  const [activePage, setActivePage] = useState("Profile");
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [appointment, setAppoitment] = useState(null);

  const handleViewOrderDetails = (order) => {
    navigate(`/order-details/${order.id}`, { state: { orderId: order.id } });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleViewAppoitmentDetails = (value) => {
    setAppoitment(value);
    setShowModal(true);
  };


  useEffect(() => {
    dispatch(getOrderDetails());
    dispatch(getOrderList());
    dispatch(getAppoitmentList());
    dispatch(getuserProfile());
  }, []);

  return (
    <section className="profileSection">
      <div className="container">
        <div className="profileContainer">
          <div className="prof-2 profileSidebar col-md-3">
            <h3>Menu</h3>
            <ul className="prof-3 profileMenuList">
              <li
                onClick={() => setActivePage("Profile")}
                className={activePage === "Profile" ? "active" : ""}
              >
                Profile
              </li>
              <li
                onClick={() => setActivePage("My Orders")}
                className={activePage === "My Orders" ? "active" : ""}
              >
                My Orders
              </li>
              <li
                onClick={() => setActivePage("My Wishlist")}
                className={activePage === "My Wishlist" ? "active" : ""}
              >
                My Wishlist
              </li>
              <li
                onClick={() => setActivePage("Appointment")}
                className={activePage === "Appointment" ? "active" : ""}
              >
                Appointment
              </li>
              <li onClick={handleLogout}>Logout</li>
            </ul>
          </div>

          <div className="prof-4 profileContent col-md-9">
            {activePage === "Profile" && (
              <div>
                <h3>Profile</h3>
                <form onSubmit={handleSubmit}>
                  <div className="profileInputWrapper">
                    <div className="prof-6">
                      <label>First Name:</label>
                      <input
                        type="text"
                        name="f_name"
                        placeholder="First Name"
                        value={formData?.f_name || ""}
                        onChange={handleInputChange}
                      />
                      {errors?.f_name && (
                        <span className="error">{errors.f_name}</span>
                      )}
                    </div>
                    <div className="prof-6">
                      <label>Last Name:</label>
                      <input
                        type="text"
                        name="l_name"
                        placeholder="Last Name"
                        value={formData?.l_name || ""}
                        onChange={handleInputChange}
                      />
                      {errors?.l_name && (
                        <span className="error">{errors.l_name}</span>
                      )}
                    </div>
                  </div>
                  <div className="profileInputWrapper">
                    <div className="prof-6">
                      <label>Mobile No.</label>
                      <input
                        type="text"
                        name="phone"
                        placeholder="Mobile No."
                        value={formData?.phone || ""}
                        onChange={handleInputChange}
                      />
                      {errors?.phone && (
                        <span className="error">{errors.phone}</span>
                      )}
                    </div>
                    <div className="prof-6">
                      <label>Email:</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData?.email || ""}
                        onChange={handleInputChange}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="profileInputWrapper">
                    <div className="prof-6">
                      <label>City:</label>
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData?.city || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="prof-6">
                    <label>About:</label>
                    <textarea
                      name="bio"
                      placeholder="About"
                      value={formData?.bio || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="prof-6">
                    <label>Address:</label>
                    <input
                      type="text"
                      name="address"
                      placeholder="Address"
                      value={formData?.address || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="profileBtn">
                    <button type="submit" className="prof-7">
                      Update
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activePage === "My Orders" && (
              <div className="">
                <h3>My Order</h3>
                {orderList?.length > 0 ? (
                  <table className="orderTable">
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>Order ID</th>
                        <th>Order Date</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderList?.map((order, index) => (
                        <tr key={order?.id}>
                          <td>{index + 1}</td>
                          <td data-label="Order ID">{order?.id}</td>
                          <td data-label="Order Date">
                            {order?.created_at
                              ? new Date(order?.created_at).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td data-label="Status">
                            {order?.order_status || "N/A"}
                          </td>
                          <td data-label="Total">
                            ₹{order?.order_amount || "0.00"}
                          </td>
                          <td data-label="Action" className="actionIcons">
                            <button>
                              <FaEye
                                onClick={() => handleViewOrderDetails?.(order)}
                              />
                            </button>
                            {/* <button onClick={() => handleViewPrescription(order?.id)}>
                              View Prescription
                            </button> */}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No Orders Placed</p>
                )}
              </div>
            )}

            {activePage === "My Wishlist" && (
              <div className="">
                <h3 className="">My Wishlist</h3>
                <div className="wishlistContainer">
                  {wishlist && wishlist.length > 0 ? (
                    <>
                      {wishlist.map((product) => {
                        const productInfo = product?.product_full_info;

                        return (
                          <div className="searchProductCard" key={product.id}>
                            <div className="productCardImg col-md-5 wishlistImgDiv">
                              <img
                                src={`${baseUrl}/storage/app/public/product/thumbnail/${productInfo?.thumbnail}`}
                                alt={productInfo?.name}
                              />
                            </div>
                            <div className="col-md-6 productCardText">
                              <h4>
                                {productInfo?.name}
                                {/* <div className="cardReview">
                      <span className="material-symbols-outlined">star</span>
                      4.5
                    </div> */}
                              </h4>
                              <p>classic frames for men by Eyecare</p>

                              <div className="productCardPrice">
                                <span>₹ {productInfo?.unit_price}/-</span>
                                <span>
                                  <del className="text-danger">
                                    ₹{productInfo?.purchase_price}
                                  </del>
                                </span>
                                <p>(5% off)</p>
                              </div>

                              <div className="cardModalBtn profileCardModalBtn">
                                <button
                                  onClick={() => handleAddToCart(productInfo)}
                                  className="cardAddtoCartbtn"
                                >
                                  <span className="material-symbols-outlined">shopping_bag</span>{" "}
                                  Add to Cart
                                </button>
                                <button
                                  className="WishlistDelete"
                                  onClick={() => handleDelete(productInfo)}
                                >
                                  <span className="material-symbols-outlined">delete</span>
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <p>Nothing in your Wishlist</p>
                  )}
                </div>
              </div>
            )}

            {activePage === "Appointment" && (
              <div>
                <h3>My Appointment</h3>
                {appoitmentList?.data?.length > 0 ? (
                 <div className="appointmentTable">
                   <table className="orderTable">
                    <thead>
                      <tr>
                        <th>Sr.No</th>
                        <th>Booking ID</th>
                        <th>Booking Date</th>
                        <th>Patient Name</th>
                        <th>Assign To</th>
                        <th>Booking Amount</th>
                        <th>Booking Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appoitmentList.data.map((appoitment, index) => (
                        <tr key={appoitment.id}>
                          <td>{index + 1}</td>
                          <td>{appoitment.booking_id || "N/A"}</td>
                          <td>
                            {appoitment.booking_datetime
                              ? new Date(
                                appoitment.booking_datetime
                              ).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td>{appoitment.patient_name || "N/A"}</td>
                          <td>{appoitment.employee?.name || "N/A"}</td>
                          <td>{appoitment.paid_amount || "N/A"}</td>
                          <td>
                            {{
                              0: "Pending",
                              1: "Assigned",
                              2: "Completed",
                              3: "Scheduled",
                              4: "Canceled",
                            }[appoitment.status] || "Unknown Status"}
                          </td>
                          <td data-label="Action" className="actionIcons">
                            <button>
                              <FaEye
                                onClick={() =>
                                  handleViewAppoitmentDetails(appoitment)
                                }
                              />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                 </div>
                ) : (
                  <p>No Appointment</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal for order details */}
      {showModal && selectedOrder && (
        <div
          className="modal fade show d-block pt-5"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div
            className="modal-dialog modal-dialog-centered orderModelBox"
            role="document"
          >
            <div className="modal-content orderModelContent">
              <div className="modal-header orderModelHead">
                <h4>Order List</h4>
                <button
                  type="button"
                  className="close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="modal-body orderModelBody">
                <div className="productCardRow">
                  <div className="col-md-12 orderCardText">
                    <li>
                      <div>
                        <b>Order ID</b>
                      </div>
                      <div>{selectedOrder?.id || "N/A"}</div>
                    </li>
                    <li>
                      <div>
                        <b>Order Date</b>
                      </div>
                      <div>
                        {selectedOrder?.created_at
                          ? new Date(
                            selectedOrder?.created_at
                          ).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </li>
                    <li>
                      <div>
                        <b>Status</b>
                      </div>
                      <div>{selectedOrder?.order_status || "N/A"}</div>
                    </li>
                    <li>
                      <div>
                        <b>Total</b>
                      </div>
                      <div>₹ {selectedOrder?.order_amount || "0.00"}/-</div>
                    </li>
                    <li>
                      <div>
                        <b>Payment Status</b>
                      </div>
                      <div>{selectedOrder?.payment_status || "N/A"}</div>
                    </li>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* appoitment */}
      {showModal && appointment && (
        <div
          className="modal fade show d-block pt-5"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLabel"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div
            className="modal-dialog modal-dialog-centered orderModelBox"
            role="document"
          >
            <div className="modal-content orderModelContent">
              <div className="modal-header orderModelHead">
                <h4>Appointment Details</h4>
                <button
                  type="button"
                  className="close"
                  onClick={handleCloseModal}
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="modal-body orderModelBody">
                <div className="productCardRow">
                  <div className="col-md-12 orderCardText">
                    <li>
                      <div>
                        <b>Appointment ID</b>
                      </div>
                      <div>{appointment?.id || "N/A"}</div>
                    </li>
                    <li>
                      <div>
                        <b>Booking ID</b>
                      </div>
                      <div>{appointment?.booking_id || "N/A"}</div>
                    </li>
                    <li>
                      <div>
                        <b>Patient Name</b>
                      </div>
                      <div>{appointment?.patient_name || "N/A"}</div>
                    </li>
                    <li>
                      <div>
                        <b>Patient Age</b>
                      </div>
                      <div>{appointment?.patient_age || "N/A"}</div>
                    </li>
                    <li>
                      <div>
                        <b>Patient Gender</b>
                      </div>
                      <div>{appointment?.patient_gender || "N/A"}</div>
                    </li>
                    <li>
                      <div>
                        <b>Patient Email</b>
                      </div>
                      <div>{appointment?.patient_email || "N/A"}</div>
                    </li>
                    <li>
                      <div>
                        <b>Patient Mobile</b>
                      </div>
                      <div>{appointment?.patient_mobile || "N/A"}</div>
                    </li>
                    <li>
                      <div>
                        <b>Address</b>
                      </div>
                      <div>{`${appointment?.house_number || ""} ${appointment?.street_name || ""}, ${appointment?.locality || ""}, ${appointment?.area || ""} - ${appointment?.pincode || "N/A"} (Landmark: ${appointment?.landmark || "N/A"})`}</div>
                    </li>
                    <li>
                      <div>
                        <b>Complaint</b>
                      </div>
                      <div>{appointment?.complaint || "N/A"}</div>
                    </li>
                    <li>
                      <div>
                        <b>Appointment Date</b>
                      </div>
                      <div>
                        {appointment?.booking_datetime
                          ? new Date(
                            appointment?.booking_datetime
                          ).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </li>
                    <li>
                      <div>
                        <b>Appointment Time</b>
                      </div>
                      <div>
                        {appointment?.booking_datetime
                          ? new Date(appointment?.booking_datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                          : "N/A"}
                      </div>
                    </li>
                    <li>
                      <div>
                        <b>Alternate Date</b>
                      </div>
                      <div>
                        {appointment?.alternate_datetime
                          ? new Date(
                            appointment?.alternate_datetime
                          ).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </li>
                    <li>
                      <div>
                        <b>Status</b>
                      </div>
                      <div>
                        {{
                          0: "Pending",
                          1: "Assigned",
                          2: "Completed",
                          3: "Scheduled",
                          4: "Canceled",
                        }[appointment?.status] || "Unknown Status"}
                      </div>
                    </li>
                    <li>
                      <div>
                        <b>Total</b>
                      </div>
                      <div>₹ {appointment?.paid_amount || "0.00"}</div>
                    </li>
                    <li>
                      <div>
                        <b>Payment Type</b>
                      </div>
                      <div>{appointment?.payment_type || "Online"}</div>
                    </li>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default ProfilePage;