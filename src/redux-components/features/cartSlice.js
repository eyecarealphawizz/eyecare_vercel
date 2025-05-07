import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
const baseUrl = process.env.REACT_APP_API_URL;
const token = localStorage.getItem("token");
const authToken = token;

export const addProduct = createAsyncThunk(
  "cart/addProduct",
  async (payload, { rejectWithValue }) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData) {
        Swal.fire({
          icon: "error",
          title: "Please log in",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
        return rejectWithValue("User not logged in");
      }

      const newItem = {
        ...payload,
        quantity: payload.min_qty,
      };

      const res = await axios.post(
        `${baseUrl}/api/v1/cart/add`,
        newItem,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(res, "add-cart-response");
      if (res.data.status == 1) {
        Swal.fire({
          icon: "success",
          title: res.data.message,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: res.data.message,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      }
      return res;
    } catch (error) {
      console.log(error, "error");
      return rejectWithValue(error.message);
    }
  }
);

export const getCartList = createAsyncThunk(
  "/addtoCart",
  async (rejectWithValue) => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/v1/cart`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

///delete cart

export const deleteCart = createAsyncThunk(
  "/addtoCart",
  async (val, rejectWithValue) => {
    console.log(authToken, "authToken");
    const data = {
      key: val,
      _method: "delete",
    };

    try {
      const res = await axios.post(
        `${baseUrl}/api/v1/cart/remove`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (res?.status == 200) {
        Swal.fire({
          icon: "success",
          title: res.data,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: res.data,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      }
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//placeorder

export const placeOrderCod = createAsyncThunk(
  "/placeOrder",
  async (val, rejectWithValue) => {
    const data = {
      payment_status: "unpaid",
      quantity: val.cartsubtotal.totalQuantity,
      address_id: val.selectedBillingAddress.id,
      price: val.cartsubtotal.totalPrice,
      coupon_code: 0,
      coupon_discount: 0,
      billing_address_id: val.selectedBillingAddress.id,
      order_note: "hello",
    };
    try {
      const res = await axios.get(
        `${baseUrl}/api/v1/customer/order/place`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          params: data,
        }
      );
      console.log(res, "resposen->");
      if (res.status == 200) {
        Swal.fire({
          icon: "success",
          title: res.data,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: res.data,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      }
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getOrderList = createAsyncThunk(
  "/getOrderList",
  async (rejectWithValue) => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/v1/customer/order/list`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// to get order details 
export const getOrderDetails = createAsyncThunk(
  "/getOrderDetails",
  async (order_id, { rejectWithValue }) => { 
    try {
      const res = await axios.get(
        `${baseUrl}/api/v1/customer/order/details?order_id=${order_id}`, 
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

export const placeOrderRazorPay = createAsyncThunk(
  "/placeOrder",
  async (val, rejectWithValue) => {
    const data = {
      payment_status: "paid",
      payment_type: "online",
      address_id: val.selectedBillingAddress.id,
      coupon_code: 0,
      coupon_discount: 0,
      billing_address_id: val.selectedBillingAddress.id,
      order_note: "hello",
    };
    try {
      const res = await axios.get(
        `${baseUrl}/api/v1/customer/order/place`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          params: data,
        }
      );
      if (res.status == 200) {
        Swal.fire({
          icon: "success",
          title: res.data,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: res.data,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      }
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

///appoitment
export const getAppoitmentList = createAsyncThunk(
  "/getAppoitmentList",
  async (rejectWithValue) => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/v1/customer/my-appointment`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(res.data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//add address

export const getAddressList = createAsyncThunk(
  "/getAddressList",
  async (id, rejectWithValue) => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/v1/customer/address/list/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addShippingBilling = createAsyncThunk(
  "/addShippingBilling",
  async (val) => {
    try {
      const res = await axios.post(
        `${baseUrl}/api/v1/customer/address/add`,
        val
      );
      console.log(res, "resposne");
      if (res.status == 200) {
        Swal.fire({
          icon: "success",
          title: res.data.message,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: res.data.message,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      }
      return res;
    } catch (error) {}
  }
);

export const updateShippingBillingAddress = createAsyncThunk(
  "/updateShippingBillingAddress",
  async (data) => {
    const shipaddressData = data.dataToSend;
    try {
      const res = await axios.post(
        `${baseUrl}/api/v1/customer/address/update`,
        {
          id: data.id,
          user_id: data.customer_id,
          contact_person_name: shipaddressData.contact_person_name || "",
          phone: shipaddressData.phone || "",
          address_type: shipaddressData.address_type || "permanent",
          city: shipaddressData.city || "",
          zip: shipaddressData.zip || "",
          country: shipaddressData.country || "",
          address: shipaddressData.address || "",
          latitude: shipaddressData.latitude,
          longitude: shipaddressData.longitude,
          is_billing: shipaddressData.is_billing,
        },
        {
          headers: {
            accept: "application/json",
          },
        }
      );
      console.log(res, "updateresposne");
      if (res.status == 200) {
        Swal.fire({
          icon: "success",
          title: res.data.message,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: res.data.message,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      }
      return res;
    } catch (error) {}
  }
);

//get product list
export const getProductList = createAsyncThunk(
  "/getProductList",
  async (rejectWithValue) => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/v1/brands/products/7`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getCategoryList = createAsyncThunk(
  "/getCategoryList",
  async (rejectWithValue) => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/v1/categories`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//delete address
export const deleteAddress = createAsyncThunk(
  "/deleteAddress",
  async (val, rejectWithValue) => {
    try {
      const res = await axios.post(
        `${baseUrl}/api/v1/customer/address/delete`,
        {
          address_id: val.id,
          customer_id: val.customer_id,
        },
        {
          headers: {
            accept: "application/json",
          },
        }
      );
      console.log(res, "response-->");
      if (res.status == 200) {
        Swal.fire({
          icon: "success",
          title: res.data.message,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      }
      return res.data;
    } catch (error) {
      console.log(error, "error-->");
      Swal.fire({
        icon: "error",
        title: error.response.data.message,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
      return rejectWithValue(error.message);
    }
  }
);

//getprivacy policy list
export const getPricacyPolicyList = createAsyncThunk(
  "/getPricacyPolicyList",
  async (rejectWithValue) => {
    try {
      const res = await axios.get(`${baseUrl}/api/v1/config`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(res, "res@11");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//filter brands
export const filterBrands = createAsyncThunk(
  "/filterBrands",
  async (id, rejectWithValue) => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/v1/brands/products/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(res, "filterresponse");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//register-doctor
export const registerDoctor = createAsyncThunk(
  "cart/registerDoctor",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${baseUrl}/api/v1/auth/doctor_register`,payload);
      console.log(res, "rahl@11");
      if (res.data.errors) {
        const errorRes = res.data.errors.map((error) => {
          if (error.code === "email") {
            return `${error.message}`;
          } else if (error.code === "pan_card") {
            return `${error.message}`;
          } else {
            return `${error.code}: ${error.message}`;
          }
        });
        Swal.fire({
          icon: "error",
          title: errorRes,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          icon: "success",
          title: res.data.message,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      }
      return res;
    } catch (error) {
      console.log(error, "error");
      return rejectWithValue(error.message);
    }
  }
);

// aggregator
export const registerAggregator = createAsyncThunk(
  "cart/registerAggregator",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${baseUrl}/api/v1/auth/aggregator_register`,payload);
      console.log(res, "aggregator");
      if (res.data.errors) {
        const errorRes = res.data.errors.map((error) => {
          if (error.code === "email") {
            return `${error.message}`;
          } else if (error.code === "pan_card") {
            return `${error.message}`;
          } else {
            return `${error.code}: ${error.message}`;
          }
        });
        Swal.fire({
          icon: "error",
          title: errorRes,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          icon: "success",
          title: res.data.message,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      }
      return res;
    } catch (error) {
      console.log(error, "error");
      return rejectWithValue(error.message);
    }
  }
);

export const manuFactureRegister = createAsyncThunk(
  "cart/manuFactureRegister",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${baseUrl}/api/v1/auth/manufacture_register`,payload);
      console.log(res, "manufacturre");
      if (res.data.errors) {
        const errorRes = res.data.errors.map((error) => {
          if (error.code === "email") {
            return `${error.message}`;
          } else if (error.code === "pan_card") {
            return `${error.message}`;
          } else {
            return `${error.code}: ${error.message}`;
          }
        });
        Swal.fire({
          icon: "error",
          title: errorRes,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          icon: "success",
          title: res.data.message,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      }
      return res;
    } catch (error) {
      console.log(error, "error");
      return rejectWithValue(error.message);
    }
  }
);

//updateprofile getuser profile
export const getuserProfile = createAsyncThunk(
  "/getuserProfile",
  async (rejectWithValue) => {
    try {
      const res = await axios.get(
        `${baseUrl}/api/v1/customer/info`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(res, "getprofile");
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// update user profile
export const updateUserProfile = createAsyncThunk(
  "/updateUserProfile",
  async (val) => {
    try {
      const res = await axios.put(
        `${baseUrl}/api/v1/customer/update-profile`, val,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log(res, "resposne");
      if (res.status == 200) {
        Swal.fire({
          icon: "success",
          title: res.data.message,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: res.data.message,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      }
      return res;
    } catch (error) {}
  }
);

export const addWishList = createAsyncThunk(
  "cart/addWishList",
  async (id, { rejectWithValue }) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));

      if (!userData) {
        Swal.fire({
          icon: "error",
          title: "Please log in",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
        return rejectWithValue("User not logged in");
      }

      const data = {
        product_id: id,
      };

      const res = await axios.post(
        `${baseUrl}/api/v1/customer/wish-list/add`, data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          params: data,
        }
      );

      if (res.status == 200) {
        Swal.fire({
          icon: "success",
          title: res.data.message,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      }
      return res;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.response.data.message,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });

      return rejectWithValue(error.message);
    }
  }
);

export const getWishList = createAsyncThunk(
  "/getWishList",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${baseUrl}/api/v1/customer/wish-list`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log(res, "get-wishlist");
      return res.data;
    } catch (error) {
      console.error("Error in API call:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const removeWishList = createAsyncThunk(
  "/removeWishList",
  async (val, rejectWithValue) => {
    try {
      const res = await axios.delete(
        `${baseUrl}/api/v1/customer/wish-list/remove`,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          params: { product_id: val.id },
        }
      );
      console.log(res, "response-->");

      if (res.status == 200) {
        Swal.fire({
          icon: "success",
          title: res.data.message,
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
        });
      }
      return res.data;
    } catch (error) {
      console.log(error, "error-->");
      Swal.fire({
        icon: "error",
        title: error.response.data.message,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
      return rejectWithValue(error.message);
    }
  }
);

//update card
export const updateCart = createAsyncThunk("/updateCart", async (val) => {
  try {
    const res = await axios.put(
      `${baseUrl}/api/v1/cart/update`, val,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        params: val,
      }
    );
    console.log(res, "resposne");
    if (res.data.status == 1) {
      // Swal.fire({
      //   icon: "success",
      //   title: res.data.message,
      //   toast: true,
      //   position: "top-end",
      //   showConfirmButton: false,
      //   timer: 1000,
      //   timerProgressBar: true,
      // });
    } else {
      Swal.fire({
        icon: "error",
        title: res.data.message,
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    }
    return res;
  } catch (error) {}
});

const initialState = {
  cart: [],
  items: [],
  confirmedOrders: [],
  transactions: [],
  totalQuantity: 0,
  total: 0,
  totalPrice: 0,
  orderList: [],
  orderDetailsList: [],
  productList: [],
  appoitmentList: [],
  categoryList: [],
  privacyPolicyList: [],
  brandFilterData: [],
};
export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    updateQuantityCart: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.cart.find((item) => item.id === id);
      if (item) {
        if (quantity <= 0) {
          state.cart = state.cart.filter((item) => item.id !== id);
        } else {
          item.quantity = quantity;
        }
      }
      const totalQuantity = state.cart.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      state.totalQuantity = totalQuantity;
    },

    addTransaction(state, action) {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData) return;

      // Create a new transaction object
      const transaction = {
        id: new Date().getTime(),
        items: action.payload.items,
        user_id: userData.id,
        totalAmount: action.payload.totalAmount,
        payment_type: action.payload.payment_type,
        transactionDate: new Date().toLocaleDateString("en-GB"),
        status: "Completed", // You can modify this later as needed
      };

      // Add transaction to Redux store and local storage
      state.transactions.push(transaction);

      let userTransactions =
        JSON.parse(localStorage.getItem(`transactions_${userData.id}`)) || [];
      userTransactions.push(transaction);
      localStorage.setItem(
        `transactions_${userData.id}`,
        JSON.stringify(userTransactions)
      );
    },

    removeCard: (state, action) => {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData) return;

      // Load the current user's cart from localStorage
      let cart = JSON.parse(localStorage.getItem(`cart_${userData.id}`)) || [];

      cart = cart.filter((item) => item.id !== action.payload.id);

      // Save the updated cart data to localStorage
      localStorage.setItem(`cart_${userData.id}`, JSON.stringify(cart));

      // Update Redux store state with the updated cart
      state.cart = cart;

      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.onmouseenter = Swal.stopTimer;
          toast.onmouseleave = Swal.resumeTimer;
        },
      });
      Toast.fire({
        icon: "success",
        title: "Item removed",
      });
    },
    updateQuantity: (state, action) => {
      console.log(state.cart, action.payload, "cartupdate");
      const { id, quantity } = action.payload;
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData) return;

      // Load the current user's cart from localStorage
      let cart = JSON.parse(localStorage.getItem(`cart_${userData.id}`)) || [];
      console.log(cart, "cart--->");

      const item = cart.find((item) => item.id === id);
      if (item) {
        if (quantity <= 0) {
          cart = cart.filter((item) => item.id !== id);
        } else {
          item.quantity = quantity;
        }

        // Save the updated cart data to localStorage
        localStorage.setItem(`cart_${userData.id}`, JSON.stringify(cart));

        // Update Redux store state with the updated cart
        state.cart = cart;
      }
    },
    product: (state, action) => {
      const data = action.payload;
      state.items = data;
    },
    confirmOrder: (state, action) => {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData) {
        Swal.fire({
          // icon: "error",
          title: "Please Login First",
          // text: "You need to be logged in to place an order.",
        });
        return;
      }

      const confirmedOrder = {
        userId: userData.id,
        id: new Date().getTime(), // Generate a unique ID
        items: state.cart,
        totalAmount: action.payload.totalAmount,
        payment_type: action.payload.payment_type,
        orderDate: new Date().toLocaleDateString("en-GB"),
        status: "Delivered",
      };

      // Save confirmed order to localStorage for the specific user
      let confirmedOrders =
        JSON.parse(localStorage.getItem(`orders_${userData.id}`)) || [];
      confirmedOrders.push(confirmedOrder);
      localStorage.setItem(
        `orders_${userData.id}`,
        JSON.stringify(confirmedOrders)
      );

      // Clear the cart
      state.cart = []; // Clear Redux state cart
      localStorage.removeItem(`cart_${userData.id}`); // Clear cart from localStorage
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addProduct.fulfilled, (state, action) => {
      // state.productList = action.payload;
    });
    builder.addCase(getCartList.fulfilled, (state, action) => {
      state.cart = action.payload;
    });
    builder.addCase(getOrderList.fulfilled, (state, action) => {
      state.orderList = action.payload;
    });
    builder.addCase(getOrderDetails.fulfilled, (state, action) => {
      state.orderDetailsList = action.payload;
    });
    builder.addCase(getAppoitmentList.fulfilled, (state, action) => {
      state.appoitmentList = action.payload;
    });
    builder.addCase(getProductList.fulfilled, (state, action) => {
      state.productList = action.payload;
    });
    builder.addCase(getCategoryList.fulfilled, (state, action) => {
      state.categoryList = action.payload;
    });
    builder.addCase(getPricacyPolicyList.fulfilled, (state, action) => {
      state.privacyPolicyList = action.payload;
    });
    builder.addCase(filterBrands.fulfilled, (state, action) => {
      state.brandFilterData = action.payload;
    });
    builder.addCase(getuserProfile.fulfilled, (state, action) => {
      state.userProfile = action.payload;
    });
    builder.addCase(updateCart.fulfilled, (state, action) => {
      console.log(action.payload, "state", state);
      state.totalQuantity = action.payload.data.qty;
    });
  },
});

export default cartSlice.reducer;
export const {
  handleAddToCart,
  addTransaction,
  removeCard,
  updateQuantity,
  product,
  confirmOrder,
  clearCart,
  updateQuantityCart,
  clearOrders,
} = cartSlice.actions;
