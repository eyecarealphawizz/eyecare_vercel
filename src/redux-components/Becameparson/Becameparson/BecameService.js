import axios from "axios";
import Swal from "sweetalert2";
const API_URL = process.env.REACT_APP_API_URL;

const doctorshomevisit = async (data) => {
  const userdata = JSON.parse(localStorage.getItem("user"));
  if (!userdata) {
    console.error("User not found");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      API_URL + "/api/v1/customer/booking/doctor_appointment",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data) {
      localStorage.setItem("Allcart", JSON.stringify(response.data));
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
        icon: "success",
        title: response.data.message || "Added",
      });
      return response.data;
    }
  } catch (error) {
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

    if (error.response && error.response.data && error.response.data.errors) {
      Toast.fire({
        icon: "error",
        title:
          error.response.data.message ||
          "An error occurred. Please try again later.",
      });
    } else {
      Toast.fire({
        icon: "error",
        title: "An error occurred. Please try again later.",
      });
    }
  }
};

const HomeVisit = async (data) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(
      API_URL + "/api/v1/customer/booking/homevisit_appointment",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data) {
      localStorage.setItem("Allcart", JSON.stringify(response.data));
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
        icon: "success",
        title: response.data.message || "Added",
      });
      return response.data;
    }
  } catch (error) {
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

    if (error.response && error.response.data && error.response.data.errors) {
      Toast.fire({
        icon: "error",
        title:
          error.response.data.message ||
          "An error occurred. Please try again later.",
      });
    } else {
      Toast.fire({
        icon: "error",
        title: "An error occurred. Please try again later.",
      });
    }
  }
};
const BecameService = {
  doctorshomevisit,
  HomeVisit,
};

export default BecameService;
