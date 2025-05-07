import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { MdOutlinePayment } from "react-icons/md";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import {
  placeOrderCod,
  placeOrderRazorPay,
  getCartList,
} from "../../redux-components/features/cartSlice";

const PaymentMethod = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.allCart);
  const location = useLocation();
  const peraddress = location.state;

  const discount = 0;
  
  // State to keep track of selected payment method
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  // Razorpay logic
  const [isProcessing, setIsProcessing] = useState(false);
  useEffect(() => {
    const loadRazorpayScript = () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => console.log("Razorpay Script Loaded");
      document.body.appendChild(script);
    };

    loadRazorpayScript();
  }, []);

  const handlePayment = async () => {
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
        icon: "error",
        title: "Cart is empty",
      }).then(() => {
        navigate("/ProductPage");
      });
      return;
    }

    setIsProcessing(true);
    try {
      const data = peraddress;
      const options = {
        key: "rzp_test_BTD7NrW2lajZXK",
        amount: "850",
        currency: "INR",
        name: "EyeCare",
        description: "Test Transaction",
        handler: function (response) {
          console.log("Payment successful", response);
          dispatch(placeOrderRazorPay(data)).then((res) => {
            if (res.payload.status == 200) {
              setTimeout(() => {
                navigate("/profile");
                dispatch(getCartList());
              }, 3000);
            }
          });
         
        },

        prefill: {
          name: peraddress.selectedBillingAddress.contact_person_name,
          contact: peraddress.selectedBillingAddress.phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      if (typeof window !== "undefined" && window.Razorpay) {
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        console.error("Razorpay SDK not loaded properly");
      }
    } catch (error) {
      console.error("Payment failed", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Function to handle the payment method selection
  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
  };

  // Function to handle payment when clicking on Proceed
  const handleProceedToPayment = () => {
    const data = peraddress;

    if (selectedPaymentMethod === "COD") {
      dispatch(placeOrderCod(data)).then((res) => {
        if (res?.payload?.status == 200) {
          navigate('/profile')
          dispatch(getCartList());
        }
      });
    } else if (selectedPaymentMethod === "Razorpay") {
      handlePayment();
    } else {
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
        icon: "error",
        title: "select a payment method",
      });
    }
  };

  return (
    <section className="paymentSection">
      <h3>Payment Method</h3>
      <div className="paymentContainer">
        <div className="col-lg-8 paymentLeftSide">
          <h5>Choose payment Method</h5>
          <div className="paymentModeDiv">
            <div
              className="paymentOption"
              onClick={() => handlePaymentMethodChange("COD")}
            >
              <input type="radio" id="paymentMode" name="paymentMethod" />
              <label htmlFor="paymentMode">
                <span className="material-symbols-outlined">payments</span>Cash
                On Delivery
              </label>
            </div>
            <div
              className="paymentOption"
              disabled={isProcessing || ""}
              onClick={() => handlePaymentMethodChange("Razorpay")}
            >
              <input type="radio" id="paymentMode1" name="paymentMethod" />
              <label htmlFor="paymentMode1">
                <img src="/additional/razorpay.png" alt="Razorpay" />
              </label>
            </div>
          </div>
        </div>

        <div className="col-lg-4 paymentRightSide">
          <h5>Payment Details</h5>
          <ul className="list-unstyled paymentListMenu">
            <li className="d-flex justify-content-between mb-2">
              <span>Sub Total</span>
              <strong>
                ₹ {peraddress.cartsubtotal.totalPrice.toLocaleString()}
              </strong>
            </li>
            <li className="d-flex justify-content-between mb-2">
              <span>GST</span>
              <strong>₹0.00</strong>
            </li>
            <li className="d-flex justify-content-between mb-2">
              <span>Shipping</span>
              <strong>₹0.00</strong>
            </li>
            <li className="d-flex justify-content-between mb-2">
              <span>Discount on Product</span>
              <strong className="text-danger">
                -₹ {discount.toLocaleString()}
              </strong>
            </li>
          </ul>
          <div className="totalAmountDiv customLine">
            <span>Total</span>
            <strong>
              ₹ {peraddress.cartsubtotal.totalAfterDiscount.toLocaleString()}/-
            </strong>
          </div>
          <div className="PaymentMethod-submit">
            <button
              className="PaymentMethod-submitButton"
              onClick={handleProceedToPayment}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentMethod;
