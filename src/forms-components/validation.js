import * as Yup from "yup";

const startSpace = /^(?!\s).*$/;
const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const panCart_Regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
export const DoctorRegistervalidationSchema = Yup.object({
  name: Yup.string()
    .required("Please enter your  name")
    .matches(startSpace, "Starting space not allow")
    .matches(/^(?!\s)[A-Za-z\s]+$/, "Please enter only alphabets"),
  qualification: Yup.array().of(
    Yup.string().required("Qualification is required")
  ),
  passing_year: Yup.array().of(
    Yup.string().required("Passing year is required")
  ),
  email: Yup.string()
    .matches(startSpace, "Starting space not allow")
    .matches(emailRegex, "Please enter valid Email")
    .required("Please enter your Email"),
  phone: Yup.string()
    .required("Please enter your phone Number")
    .matches(/^\d{10}$/, "Please enter 10 digit "),
  clinic_name: Yup.string()
    .required("Please enter your  clinic name")
    .matches(startSpace, "Starting space not allow")
    .matches(/^(?!\s)[A-Za-z\s]+$/, "Please enter only alphabets"),
  clinic_address: Yup.string().required("Clinic address is required"),
  license_number: Yup.string().required("License number is required"),
  medical_council: Yup.string().required("Medical council is required"),
  pan_card: Yup.string()
    .matches(panCart_Regex, "Invalid PAN card number")
    .required("PAN card is required"),
  gender: Yup.string().required("Gender is required"),
  address: Yup.string().required("Address is required"),
  password: Yup.string()
     // .matches(/^[A-Z]/, "Password must start with an uppercase letter")
    // .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    // .matches(
    //   /[!@#$%^&*(),.?":{}|<>]/,
    //   "Password must contain at least one special character"
    // )
    // .matches(/[0-9]/, "Password must contain at least one digit")
    .min(4, "Password must be at least 4 characters")
    .max(16, "Password must be at most 16 characters")
    .required("Please enter your  Password"),
  certificate_image: Yup.mixed().required("Certificate image is required"),
  image: Yup.mixed().required("Result image is required"),
});

export const AggratorRegistervalidationSchema = Yup.object({
  name: Yup.string()
    .required("Please enter your  name")
    .matches(startSpace, "Starting space not allow")
    .matches(/^(?!\s)[A-Za-z\s]+$/, "Please enter only alphabets"),
  phone: Yup.string().required("Phone is required"),
  email: Yup.string()
    .matches(startSpace, "Starting space not allow")
    .matches(emailRegex, "Please enter valid Email")
    .required("Please enter your Email"),
  pan_card: Yup.string()
    .matches(panCart_Regex, "Invalid PAN card number")
    .required("PAN card is required"),
  gst: Yup.string().required("GST is required"),
  address: Yup.string().required("Address is required"),
  zipcode: Yup.string().required("ZIP Code is required"),
  aadhar_number: Yup.string().required("Aadhar Number is required"),
  password: Yup.string()
    // .matches(/^[A-Z]/, "Password must start with an uppercase letter")
    // .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    // .matches(
    //   /[!@#$%^&*(),.?":{}|<>]/,
    //   "Password must contain at least one special character"
    // )
    // .matches(/[0-9]/, "Password must contain at least one digit")
    .min(4, "Password must be at least 4 characters")
    .max(16, "Password must be at most 16 characters")
    .required("Please enter your  Password"),
  image: Yup.mixed().required("User Image is required"),
  bank_statement: Yup.mixed().required("Bank Statement is required"),
});

export const manuFacturevalidationSchema = Yup.object({
  name: Yup.string()
    .required("Please enter your  name")
    .matches(startSpace, "Starting space not allow")
    .matches(/^(?!\s)[A-Za-z\s]+$/, "Please enter only alphabets"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^\d{10}$/, "Phone number must be 10 digits"),
  email: Yup.string()
    .matches(startSpace, "Starting space not allow")
    .matches(emailRegex, "Please enter valid Email")
    .required("Please enter your Email"),
  pan_card: Yup.string()
    .matches(panCart_Regex, "Invalid PAN card number")
    .required("PAN card is required"),
  address: Yup.string().required("Address is required"),
  gst: Yup.string().required("GST number is required"),
  specialization: Yup.string().required("Specialization is required"),
  password: Yup.string()
    // .matches(/^[A-Z]/, "Password must start with an uppercase letter")
    // .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    // .matches(
    //   /[!@#$%^&*(),.?":{}|<>]/,
    //   "Password must contain at least one special character"
    // )
    // .matches(/[0-9]/, "Password must contain at least one digit")
    .min(4, "Password must be at least 4 characters")
    .max(16, "Password must be at most 16 characters")
    .required("Please enter your  Password"),
  image: Yup.mixed().required("Image is required"),
});


export const DoctorOnlinevalidationSchema = Yup.object({
  patient_name: Yup.string()
    .required("Please enter your  name")
    .matches(startSpace, "Starting space not allow")
    .matches(/^(?!\s)[A-Za-z\s]+$/, "Please enter only alphabets"),
  patient_mobile: Yup.string()
    .required("Phone number is required")
    .matches(/^\d{10}$/, "Phone number must be 10 digits"),
    patient_email: Yup.string()
    .matches(startSpace, "Starting space not allow")
    .matches(emailRegex, "Please enter valid Email")
    .required("Please enter your Email"),
  // pan_card: Yup.string()
  //   .matches(panCart_Regex, "Invalid PAN card number")
  //   .required("PAN card is required"),
  // address: Yup.string().required("Address is required"),
  gst: Yup.string().required("GST number is required"),
  specialization: Yup.string().required("Specialization is required"),
  password: Yup.string()
    // .matches(/^[A-Z]/, "Password must start with an uppercase letter")
    // .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    // .matches(
    //   /[!@#$%^&*(),.?":{}|<>]/,
    //   "Password must contain at least one special character"
    // )
    // .matches(/[0-9]/, "Password must contain at least one digit")
    .min(4, "Password must be at least 4 characters")
    .max(16, "Password must be at most 16 characters")
    .required("Please enter your  Password"),
  image: Yup.mixed().required("Image is required"),
});



