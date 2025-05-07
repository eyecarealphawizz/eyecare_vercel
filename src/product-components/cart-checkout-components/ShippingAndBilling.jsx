import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import {
  addShippingBilling,
  deleteAddress,
  getAddressList,
  getuserProfile,
  updateShippingBillingAddress,
} from "../../redux-components/features/cartSlice";

const validationSchema = Yup.object().shape({
  shippingContactName: Yup.string().required(
    "Shipping contact name is required"
  ),
  shippingPhone: Yup.string()
    .required("Shipping phone is required")
    .matches(/^[0-9]+$/, "Phone must be numeric")
    .min(10, "Phone must be at least 10 digits"),
  shippingCity: Yup.string().required("Shipping city is required"),
  shippingZipCode: Yup.string().required("Shipping ZIP code is required"),
  shippingCountry: Yup.string().required("Shipping country is required"),
  shippingAddress: Yup.string().required("Shipping address is required"),
  shippingLatitude: Yup.number()
    .typeError("Latitude must be a number")
    .required("Shipping latitude is required"),
  shippingLongitude: Yup.number()
    .typeError("Longitude must be a number")
    .required("Shipping longitude is required"),
  billingContactName: Yup.string().required("Billing contact name is required"),
  billingPhone: Yup.string()
    .required("Billing phone is required")
    .matches(/^[0-9]+$/, "Phone must be numeric")
    .min(10, "Phone must be at least 10 digits"),
  billingCity: Yup.string().required("Billing city is required"),
  billingZipCode: Yup.string().required("Billing ZIP code is required"),
  billingCountry: Yup.string().required("Billing country is required"),
  billingAddress: Yup.string().required("Billing address is required"),
  billingLatitude: Yup.number()
    .typeError("Latitude must be a number")
    .required("Billing latitude is required"),
  billingLongitude: Yup.number()
    .typeError("Longitude must be a number")
    .required("Billing longitude is required"),
});

const ShippingAndBilling = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const cartsubtotal = state;

  // console.log(cartsubtotal, "location");
  const { cart, userProfile } = useSelector((state) => state.allCart);
  console.log(userProfile);
  
  const cartData = cart;
  const discount = 0;
  const totalPrice = cartData.reduce(
    (total, item) => total + item.purchase_price * item.quantity,
    0
  );
  const totalAfterDiscount = totalPrice - discount;

  const [isFormVisible, setIsFormVisible] = useState(false);

  // address form
  const [existingAddresses, setExistingAddresses] = useState([]);
  // console.log(existingAddresses);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);
  const [editId, setEditId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = userProfile?.id;

  const handleAddAddressClick = () => {
    // setSelectedBillingAddress(null);
    setIsFormVisible(!isFormVisible); // Clear the selected address for adding a new one
    setEditId(null);
    setSelectedBillingAddress(null);
  };

  const [initialValues, setInitialValues] = useState({
    shippingContactName: "",
    shippingPhone: "",
    shippingAddressType: "permanent",
    shippingCity: "",
    shippingZipCode: "",
    shippingCountry: "",
    shippingAddress: "",
    shippingLatitude: "",
    shippingLongitude: "",

    billingContactName: "",
    billingPhone: "",
    billingCity: "",
    billingZipCode: "",
    billingCountry: "",
    billingAddress: "",
    billingLatitude: "",
    billingLongitude: "",

    sameAsShipping: false,
  });
  const dispatch = useDispatch();
  const onSubmit = (values) => {
    // console.log(values, "address-->");
    // console.log(editId, "editid-->");
    const dataToSend = {   
      user_id: userId,
      contact_person_name: values.shippingContactName || "",
      phone: values.shippingPhone || "",
      address_type: values.shippingAddressType || "permanent",
      city: values.shippingCity || "",
      zip: values.shippingZipCode || "",
      country: values.shippingCountry || "",
      address: values.shippingAddress || "",
      latitude: "0.0",
      longitude: "0.0",
      is_billing: false,
    };

    if (editId == null) {
      // alert("addshiiping");
      dispatch(addShippingBilling(dataToSend)).then((res) => {
        console.log(res);
        
        if (res.payload.status === 200) {
          window.location.reload();
        }
      })
    } else {
      // console.log(values, "values");

      const data = {
        id: editId,
        customer_id: selectedBillingAddress.customer_id,
        dataToSend,
      };
      dispatch(updateShippingBillingAddress(data)).then((res) => {
        console.log(res);
        
        if (res.payload.status === 200) {
          window.location.reload();
        }
      })
    }
  };

  const handleProceed = () => {
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
    if (!selectedBillingAddress) {
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
        title: "Select or add address",
      });
      return;
    }
    navigate("/PaymentMethod", {
      state: { selectedBillingAddress, cartsubtotal },
    });
  };
  const handleEdit = (addressId) => {
    setEditId(addressId);
    const addressToEdit = existingAddresses?.find(
      (address) => address?.id === addressId
    );
    // console.log(addressToEdit, "addressToEdit");
    setSelectedBillingAddress(addressToEdit);
    setIsFormVisible(true);
  };

  useEffect(() => {
    if (editId) {
      // console.log(selectedBillingAddress);
      setInitialValues({
        shippingContactName: editId
          ? selectedBillingAddress.contact_person_name
          : "",
        shippingPhone: selectedBillingAddress.phone,
        shippingAddressType: selectedBillingAddress.address_type,
        shippingCity: selectedBillingAddress.city,
        shippingZipCode: selectedBillingAddress.zip,
        shippingCountry: selectedBillingAddress.country,
        shippingAddress: selectedBillingAddress.address,
        shippingLatitude: selectedBillingAddress.latitude,
        shippingLongitude: selectedBillingAddress.longitude,

        billingContactName: "",
        billingPhone: "",
        billingCity: "",
        billingZipCode: "",
        billingCountry: "",
        billingAddress: "",
        billingLatitude: "",
        billingLongitude: "",

        sameAsShipping: false,
      });
    }
  }, [editId, selectedBillingAddress]);
  const handleDelete = (val) => {
    if (!selectedBillingAddress) {
      Swal.fire({
        icon: "info",
        title: "No address selected",
        // text: "Please select an address before attempting to delete.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
      return;
    }
        dispatch(deleteAddress(val)).then((res) => {
          if (res?.payload?.message) {
            setSelectedBillingAddress(null);
            dispatch(getAddressList());
            window.location.reload();
          } else {
            // Swal.fire("Error!", "Failed to delete the address.", "error");
          }
        });
  };
  

 
  // console.log(selectedBillingAddress, "selectedBillingAddress");
  const handleSelectChange = (e) => {
    setSelectedBillingAddress(e.target.value);
  };

  const selectedItem = existingAddresses?.find(
    (item) => String(item.id) === String(selectedBillingAddress)
  );
  // console.log(selectedItem,"select-item",selectedBillingAddress)

  useEffect(() => {
    const fetchData = async () => {
      // Dispatch and wait for getuserProfile to complete
      await dispatch(getuserProfile());
      
      // Once getuserProfile is complete, dispatch getAddressList
      dispatch(getAddressList(userId)).then((res) => {
        setExistingAddresses(res?.payload);
      });
    };
  
    fetchData();
  }, [dispatch, userId]);
  
  return (
    <section className="billingSection">
      <h3>SHIPPING AND BILLING</h3>

      <div className="billingContainer">
        <div className="col-lg-8">
          <div className="existingContainer">
            {/* <h5>Select Existing Address</h5> */}
            <div className="existContentDiv">
              <div className="existSelectDiv">
                <span class="material-symbols-outlined">home</span>
                <select
                  name="existingShippingAddress"
                  value={selectedBillingAddress}
                  onChange={handleSelectChange}
                >
                  {/* {selectedBillingAddress==null?} */}
                  <option>Select an existing address</option>
                  {existingAddresses?.map((item, index) => (
                    <option key={index} value={item.id}>
                      {item.contact_person_name} - {item.city} - {item.zip}
                    </option>
                  ))}
                </select>
              </div>
              <div className="addAddressBtn">
                <button onClick={() => handleEdit(selectedItem?.id)}>
                  Edit
                </button>
                {/* {console.log(existingAddresses, "existingAddresses")} */}
                <button onClick={() => handleDelete(selectedItem)}>
                  delete
                </button>
              </div>
            </div>

            <div className="selectAddressDiv">
              <>
                {/* {console.log(selectedAddress,"136")} */}
                {selectedItem && (
                  <>
                    <div className="selectAddressContent">
                      {selectedItem && (
                        <div>
                          <span>Person Name: </span>
                          {selectedItem.contact_person_name}
                        </div>
                      )}
                    </div>

                    <div className="selectAddressContent">
                      {selectedItem && (
                        <>
                          <span>Address :</span>
                          {selectedItem.city}
                        </>
                      )}
                    </div>
                  </>
                )}
              </>
            </div>
          </div>

          {/* address-button */}

          <div className="addAddressBtn justify-content-between mt-3">
            <Link to="/checkout">
            <button type="submit" >
              Back
            </button>
            </Link>
            <button type="submit" onClick={handleAddAddressClick}>
              Add Address
            </button>
          </div>

          {/* Shipping Address */}
          <Formik
            initialValues={initialValues}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ values, setFieldValue, handleChange, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                {isFormVisible && (
                  <div className="billingFormContainer">
                    <div className="formLable">Shipping Address</div>

                    <div className="inputWrapper">
                      {/* Existing Fields */}
                      <div>
                        <div className="inputFeald">
                          <span class="material-symbols-outlined">person</span>
                          <Field
                            name="shippingContactName"
                            placeholder="Full Name"
                            value={values.shippingContactName}
                            onChange={handleChange}
                            className="ShippingAndBilling-formInput"
                          />
                        </div>
                        <ErrorMessage
                          name="shippingContactName"
                          component="div"
                          className="error"
                        />
                      </div>

                      <div>
                        <div className="inputFeald">
                          <span class="material-symbols-outlined">call</span>
                          <Field
                            name="shippingPhone"
                            placeholder="Phone No."
                            className="ShippingAndBilling-formInput"
                          />
                        </div>
                        <ErrorMessage
                          name="shippingPhone"
                          component="div"
                          className="error"
                        />
                      </div>
                    </div>
                    <div className="inputWrapper">
                      <div className="inputFeald">
                        <span class="material-symbols-outlined">home_pin</span>
                        <Field
                          as="select"
                          name="shippingAddressType"
                          className=""
                        >
                          <option value="permanent">Permanent</option>
                          <option value="temporary">Temporary</option>
                        </Field>
                      </div>
                      <div>
                        <div className="inputFeald">
                          <span class="material-symbols-outlined">
                            location_city
                          </span>
                          <Field
                            name="shippingCity"
                            placeholder="City"
                            className=""
                          />
                        </div>
                        <ErrorMessage
                          name="shippingCity"
                          component="div"
                          className="error"
                        />
                      </div>
                    </div>
                    <div className="inputWrapper">
                      <div>
                        <div className="inputFeald">
                          <span class="material-symbols-outlined">pin</span>
                          <Field
                            name="shippingZipCode"
                            placeholder="Zip Code"
                            className="ShippingAndBilling-formInput"
                          />
                        </div>
                        <ErrorMessage
                          name="shippingZipCode"
                          component="div"
                          className="error"
                        />
                      </div>
                      <div>
                        <div className="inputFeald">
                          <span class="material-symbols-outlined">
                            language
                          </span>
                          <Field
                            as="select"
                            name="shippingCountry"
                            className=""
                          >
                            <option value="">Select Country</option>
                            <option value="India">India</option>
                            <option value="USA">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="Canada">Canada</option>
                          </Field>
                        </div>
                        <ErrorMessage
                          name="shippingCountry"
                          component="div"
                          className="error"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="inputFeald mt-2">
                        <span class="material-symbols-outlined">
                          person_pin_circle
                        </span>
                        <Field
                          as="textarea"
                          name="shippingAddress"
                          placeholder="Address"
                          className="textareaFeald"
                        />
                      </div>
                      <ErrorMessage
                        name="shippingAddress"
                        component="div"
                        className="error"
                      />
                    </div>

                    {/* New Fields */}
                    <div className="inputWrapper">
                      <div>
                        <div className="inputFeald">
                          <span class="material-symbols-outlined">
                            conversion_path
                          </span>
                          <Field
                            name="shippingLatitude"
                            placeholder="Latitude"
                            className="ShippingAndBilling-formInput"
                          />
                        </div>
                        <ErrorMessage
                          name="shippingLatitude"
                          component="div"
                          className="error"
                        />
                      </div>
                      <div>
                        <div className="inputFeald">
                          <span class="material-symbols-outlined">
                            conversion_path
                          </span>
                          <Field
                            name="shippingLongitude"
                            placeholder="Longitude"
                            className="ShippingAndBilling-formInput"
                          />
                        </div>
                        <ErrorMessage
                          name="shippingLongitude"
                          component="div"
                          className="error"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Same as Shipping */}

                {/* click checkbox set data */}
                {isFormVisible && (
                  <div className="sameAddressDiv">
                    <Field
                      type="checkbox"
                      name="sameAsShipping"
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFieldValue("sameAsShipping", checked);
                        if (checked) {
                          // Copy values from Shipping to Billing
                          setFieldValue(
                            "billingContactName",
                            values.shippingContactName
                          );
                          setFieldValue("billingPhone", values.shippingPhone);
                          setFieldValue(
                            "billingAddressType",
                            values.shippingAddressType
                          );
                          setFieldValue("billingCity", values.shippingCity);
                          setFieldValue(
                            "billingZipCode",
                            values.shippingZipCode
                          );
                          setFieldValue(
                            "billingCountry",
                            values.shippingCountry
                          );
                          setFieldValue(
                            "billingAddress",
                            values.shippingAddress
                          );
                          setFieldValue(
                            "billingLatitude",
                            values.shippingLatitude
                          );
                          setFieldValue(
                            "billingLongitude",
                            values.shippingLongitude
                          );
                        }
                      }}
                    />
                    <label>Same as shipping address</label>
                  </div>
                )}

                {/* Billing Address */}
                {isFormVisible && (
                  <div className="billingFormContainer">
                    <div className="formLable">Billing Address</div>

                    {/* Existing Fields */}
                    <div className="inputWrapper">
                      <div>
                        <div className="inputFeald">
                          <span class="material-symbols-outlined">person</span>
                          <Field
                            name="billingContactName"
                            placeholder="Ful Name"
                            className="ShippingAndBilling-formInput"
                          />
                        </div>
                        <ErrorMessage
                          name="billingContactName"
                          component="div"
                          className="error"
                        />
                      </div>
                      <div>
                        <div className="inputFeald">
                          <span class="material-symbols-outlined">call</span>
                          <Field
                            name="billingPhone"
                            placeholder="Phone"
                            className="ShippingAndBilling-formInput"
                          />
                        </div>
                        <ErrorMessage
                          name="billingPhone"
                          component="div"
                          className="error"
                        />
                      </div>
                    </div>
                    <div className="inputWrapper">
                      <div className="inputFeald">
                        <span class="material-symbols-outlined">home_pin</span>
                        <Field as="select" name="billingAddressType">
                          <option value="permanent">Permanent</option>
                          <option value="temporary">Temporary</option>
                        </Field>
                      </div>
                      <div>
                        <div className="inputFeald">
                          <span class="material-symbols-outlined">
                            location_city
                          </span>
                          <Field name="billingCity" placeholder="City" />
                        </div>
                        <ErrorMessage
                          name="billingCity"
                          component="div"
                          className="error"
                        />
                      </div>
                    </div>
                    <div className="inputWrapper">
                      <div>
                        <div className="inputFeald">
                          <span class="material-symbols-outlined">pin</span>
                          <Field name="billingZipCode" placeholder="Zip Code" />
                        </div>
                        <ErrorMessage
                          name="billingZipCode"
                          component="div"
                          className="error"
                        />
                      </div>
                      <div>
                        <div className="inputFeald">
                          <span class="material-symbols-outlined">
                            language
                          </span>
                          <Field as="select" name="billingCountry">
                            <option value="">Select Country</option>
                            <option value="India">India</option>
                            <option value="USA">United States</option>
                            <option value="UK">United Kingdom</option>
                            <option value="Canada">Canada</option>
                          </Field>
                        </div>
                        <ErrorMessage
                          name="billingCountry"
                          component="div"
                          className="error"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="inputFeald mt-2">
                        <span class="material-symbols-outlined">
                          person_pin_circle
                        </span>
                        <Field
                          as="textarea"
                          name="billingAddress"
                          placeholder="Address"
                          className="textareaFeald"
                        />
                      </div>
                      <ErrorMessage
                        name="billingAddress"
                        component="div"
                        className="error"
                      />
                    </div>
                    {/* New Fields */}
                    <div className="inputWrapper">
                      <div>
                        <div className="inputFeald">
                          <span class="material-symbols-outlined">
                            conversion_path
                          </span>
                          <Field
                            name="billingLatitude"
                            placeholder="Latitude"
                            className="ShippingAndBilling-formInput"
                          />
                        </div>
                        <ErrorMessage
                          name="billingLatitude"
                          component="div"
                          className="error"
                        />
                      </div>
                      <div>
                        <div className="inputFeald">
                          <span class="material-symbols-outlined">
                            conversion_path
                          </span>
                          <Field
                            name="billingLongitude"
                            placeholder="Longitude"
                            className="ShippingAndBilling-formInput"
                          />
                        </div>
                        <ErrorMessage
                          name="billingLongitude"
                          component="div"
                          className="error"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {isFormVisible && (
                  <div className="checkoutBtnDiv justify-content-center">
                    {/* {console.log("savebutton")} */}
                    <button type="submit">Save Address</button>
                  </div>
                )}
              </form>
            )}
          </Formik>
        </div>

        {/* Right section for Summary */}
        <div className="col-lg-4 billingRightSide">
          <h5>Payment Details</h5>
          <ul className="list-unstyled paymentListMenu">
            {/* <li className="d-flex justify-content-between mb-2">
<span>SF Points</span>
<strong>750</strong>
</li> */}
            <li className="d-flex justify-content-between mb-2">
              <span>Sub Total</span>
              <strong>₹{state?.totalPrice?.toLocaleString()}</strong>
            </li>
            <li className="d-flex justify-content-between mb-2">
              <span>Tax</span>
              <strong>₹0.00</strong>
            </li>
            <li className="d-flex justify-content-between mb-2">
              <span>Shipping</span>
              <strong>₹0.00</strong>
            </li>
            <li className="d-flex justify-content-between mb-2">
              <span>Discount on Product</span>
              <strong className="text-danger">
                -₹{discount?.toLocaleString()}
              </strong>
            </li>
          </ul>
          <div className="totalAmountDiv customLine">
            <span>Total</span>
            <strong>₹ {state?.totalAfterDiscount?.toLocaleString()}/-</strong>
          </div>
          <div className="checkoutBtnDiv justify-content-center">
            <button type="submit" onClick={handleProceed}>
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShippingAndBilling;
