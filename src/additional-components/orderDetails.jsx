import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getOrderDetails } from "../redux-components/features/cartSlice";
import axios from "axios";

const OrderDetails = () => {
  const baseUrl = process.env.REACT_APP_API_URL || "";
  const token = localStorage.getItem("token");
  const authToken = token;
  const location = useLocation();
  const dispatch = useDispatch();

  const { orderId } = location.state || {};

  const [ordersDetails, setOrderDetails] = useState(null);
  const [order, setOrder] = useState(null);
  // console.log(ordersDetails);
  console.log(order);

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderDetails(orderId))
        .then((response) => {
          if (response?.payload?.length > 0) {
            setOrderDetails(response.payload);
          } else {
            console.log("No order details found.");
            setOrderDetails([]);
          }
        })
        .catch((error) => {
          console.log("Error fetching order details:", error);
          setOrderDetails([]);
        });
    }
  }, [dispatch, orderId]);

  const [prescriptionDetails, setPrescriptionDetails] = useState(null);
  // console.log(prescriptionDetails);

  const handleViewPrescription = (id) => {
    if (!id) return;

    const orderData = ordersDetails.find((item) => item.id === id);

    if (orderData) {
      setPrescriptionDetails(orderData);
    } else {
      console.log("No prescription details found.");
      setPrescriptionDetails(null);
    }
  };

  const closeModal = () => {
    setPrescriptionDetails(null);
  };

  useEffect(() => {
    const fetchOrder = async () => {
      if (orderId) {
        try {
          const res = await axios.get(
            `${baseUrl}/api/v1/customer/order/get-order-by-id?order_id=${orderId}`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          setOrder(res.data);
        } catch (error) {
          console.error("Error fetching order:", error);
        }
      }
    };

    fetchOrder();
  }, [orderId, authToken]);

  return (
    <>
      <section className="orderSection">
        <div className="container">
          <h1>Order Details</h1>
          <div className="row orderDetailRow">
          <div className="col-md-6 orderDetailList">
            <p>
              <b>#Order ID:</b> {order?.id}
            </p>
          </div>
            <div className="col-md-6 orderDetailList text-end">
              <p>
                <b>Payment Method:</b> {order?.payment_method}
              </p>
            </div>
          <div className="col-md-6 orderDetailList">
            <p>
              <b>Date % Time: </b>
              {order?.created_at
                ? new Date(order?.created_at)
                    .toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    })
                    .replace(",", "")
                : "N/A"}
            </p>
            </div>
            <div className="col-md-6 orderDetailList text-end">
              <p>
                <b>Payment Status:</b>
              {order?.payment_status}</p>
          </div>
          <div className="col-md-6 orderDetailList">
            <p>
              <b>#Order Note:</b> {order?.order_note}
            </p>
            </div>
            <div className="col-md-6 orderDetailList text-end">
              <p>
                <b>Order Status:</b> {order?.order_status}
              </p>
          </div>

          <div className="orderTableData">
            {ordersDetails && ordersDetails.length > 0 ? (
              <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                  <tr>
                    <th>Sr No</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Tax</th>
                    <th>Total Price</th>
                    <th>Discount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersDetails.map((order, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        {order?.product_details?.thumbnail && (
                          <img
                            src={`${baseUrl}/storage/app/public/product/thumbnail/${order.product_details.thumbnail}`}
                            alt={order?.product_details?.name || "Product"}
                            height={60}
                            width={60}
                            className="rounded-1"
                          />
                        )}
                        <span className="ms-2">
                          {order?.product_details?.name || "N/A"}
                        </span>
                      </td>
                      <td>{order?.price || "N/A"}</td>
                      <td>{order?.qty || "N/A"}</td>
                      <td>{order?.product_details?.tax || "N/A"}</td>
                      <td>
                        {order?.price && order?.qty
                          ? (order.price * order.qty).toFixed(2)
                          : "N/A"}
                      </td>
                      <td>{order?.product_details?.discount || "N/A"}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleViewPrescription(order?.id)}
                          disabled={!order?.id}
                        >
                          View Prescription
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No order details available.</p>
            )}
          </div>
        </div>
        </div>
      </section>

      <div className="container">
        <div className="orderBottom orderDetailRow ">
          <p>
            <b>Shipping Cost:</b> {order?.shipping_cost}
          </p>
          <p>
            <b>Totle:</b> {order?.order_amount}
          </p>
        </div>
      </div>

      {/* View Prescription Details */}
      {prescriptionDetails && (
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
                <h4>Prescription Details</h4>
                <button
                  type="button"
                  className="close"
                  onClick={closeModal}
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="modal-body">
                {prescriptionDetails.prescription_image ? (
                  <>
                    <div className="row mb-4">
                      <strong className="prescriptionHead">Prescription Image:</strong>
                      <div className="prescription_imgdiv">
                        <a
                          href={`${baseUrl}/storage/app/public/cart/prescriptions/${prescriptionDetails.prescription_image}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className=""
                        >
                          <img
                            src={`${baseUrl}/storage/app/public/cart/prescriptions/${prescriptionDetails.prescription_image}`}
                            alt=""
                          />
                        </a>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <div className="p-3 border rounded shadow-sm bg-light">
                         
                            <div>
                              <strong className="prescriptionCardB">IPD Measure:</strong>{" "}
                              {prescriptionDetails.ipd_measure || "N/A"}
                            </div>
                          
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div className="p-3 border rounded shadow-sm bg-light">
                          
                            <div>
                              <strong className="prescriptionCardB">Gender:</strong>{" "}
                              {prescriptionDetails.gender || "N/A"}
                            </div>
                       
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <div className="p-3 border rounded shadow-sm bg-light">
                       
                            <div>
                              <strong className="prescriptionCardB">Age:</strong>{" "}
                              {prescriptionDetails.age || "N/A"}
                            </div>
                         
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <h5>Left Eye Measurements</h5>
                        <div className="p-3 border rounded shadow-sm bg-light">
                          <div className="mt-2">
                            <div>
                              <strong>Spherical:</strong>{" "}
                              {prescriptionDetails.left_spherical || "N/A"}
                            </div>
                            <div>
                              <strong>Cylinder:</strong>{" "}
                              {prescriptionDetails.left_cylinder || "N/A"}
                            </div>
                            <div>
                              <strong>Axis:</strong>{" "}
                              {prescriptionDetails.left_axis !== undefined
                                ? `${prescriptionDetails.left_axis}°`
                                : "N/A"}
                            </div>
                            <div>
                              <strong>Add for NV:</strong>{" "}
                              {prescriptionDetails.left_addfornv || "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6 mb-3">
                        <h5>Right Eye Measurements</h5>
                        <div className="p-3 border rounded shadow-sm bg-light">
                          <div className="mt-2">
                            <div>
                              <strong>Spherical:</strong>{" "}
                              {prescriptionDetails.right_spherical || "N/A"}
                            </div>
                            <div>
                              <strong>Cylinder:</strong>{" "}
                              {prescriptionDetails.right_cylinder || "N/A"}
                            </div>
                            <div>
                              <strong>Axis:</strong>{" "}
                              {prescriptionDetails.right_axis !== undefined
                                ? `${prescriptionDetails.right_axis}°`
                                : "N/A"}
                            </div>
                            <div>
                              <strong>Add for NV:</strong>{" "}
                              {prescriptionDetails.right_addfornv || "N/A"}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-4 mb-3">
                          <div className="p-3 border rounded shadow-sm bg-light">
                            <div className="mt-2">
                              <div>
                                <strong>IPD Measure:</strong>{" "}
                                {prescriptionDetails.ipd_measure || "N/A"}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 mb-3">
                          <div className="p-3 border rounded shadow-sm bg-light">
                            <div className="mt-2">
                              <div>
                                <strong>Gender:</strong>{" "}
                                {prescriptionDetails.gender || "N/A"}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 mb-3">
                          <div className="p-3 border rounded shadow-sm bg-light">
                            <div className="mt-2">
                              <div>
                                <strong>Age:</strong>{" "}
                                {prescriptionDetails.age || "N/A"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderDetails;
