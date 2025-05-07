import { useSelector, useDispatch } from "react-redux";
import {
  deleteCart,
  getCartList,
  removeCard,
} from "../../redux-components/features/cartSlice";
import { useNavigate } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import "../../App.css";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

const CartModal = ({ handleCartModalClose }) => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.allCart);
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const [loadingItemId, setLoadingItemId] = useState(null);
  const handleCheckoutFromModal = () => {
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
    navigate("/Checkout");
    handleCartModalClose();
  };

  const handleRemoveFromCart = (itemId) => {
    setLoadingItemId(itemId); // Set loading for the item being removed
    dispatch(deleteCart(itemId)).then(() => {
      // Refresh the cart list after removal
      dispatch(getCartList());
    }).finally(() => {
      setLoadingItemId(null); // Reset loading state after action
    });
   
  };
  // useEffect(() => {
  //   dispatch(getCartList());
  // }, [loggedInUser]);
  // if (!loggedInUser) {
  //   return (
  //     <div className="modal2-2 cardBarDiv">
  //       <p>Please login to view your cart.</p>
  //     </div>
  //   );
  // }

  return (
    <>
      <div onClick={handleCartModalClose} className="modal2-1"></div>
      <div className="modal2-2 cardBarDiv">
        <div className="CartBarHead">
          <div className="cartBarText">
            <span className="material-symbols-outlined">shopping_cart</span>
            <div className="cartBarTitle">Your Cart</div>
          </div>
          <div className="cartCroxBtn" onClick={handleCartModalClose}>
            <span className="material-symbols-outlined">close</span>
          </div>
        </div>

        {/* Show cart items if available */}
        {cart.length > 0 ? (
          cart.map((data2) => (
            <div key={data2.id} className="modal2-cart-data cardbarCard">
              <div className="cardbarImg">
                <img
                  src={`${baseUrl}/storage/app/public/product/thumbnail/${data2.thumbnail}`}
                  alt=""
                  width={80}
                  height={80}
                />
              </div>
              <div className="cardbarCardHead">
                <div className="cardbarCardTitle">{data2.name}</div>
                <div className="searchCard">
                  <span>₹ {data2.price}/-</span>
                  {/* <div>
                    <del>₹ {data2.price}</del>
                  </div> */}
                </div>
              </div>
              <div className="modal2-12">
                <p onClick={() => handleRemoveFromCart(data2.id)}>
                {loadingItemId === data2.id ? (
                    <span className="spinner-border spinner-border-sm" />
                  ) : (
                    <RxCross2 />
                  )}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center pt-2">No items in your cart.</p>
        )}

        <div onClick={handleCheckoutFromModal} className="mod-c-1">
          <p className="cardBtnDiv text-center">
            <button className="btn btn-primary p-2 w-75">Checkout</button>
          </p>
        </div>
      </div>
    </>
  );
};

export default CartModal;
