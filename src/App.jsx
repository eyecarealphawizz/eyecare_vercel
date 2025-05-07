import "./App.css";
import Home from "./home-components/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./navbar-components/Navbar";
import Contect from "./navbar-components/Login-Register/Contact";
import FlashSale from "./navbar-components/offer-sale/FlashSale";
import Offer from "./navbar-components/offer-sale/Offer";
import Footer from "./home-components/Footer";
import Profile from "./navbar-components/Profile";
import UserLogin from "./navbar-components/Login-Register/UserLogin";
import UserRegister from "./navbar-components/Login-Register/UserRegister";
import Category from "./navbar-components/Category";
import Brandpage from "./navbar-components/Brandpage";
import Checkout from "./product-components/cart-checkout-components/Checkout";
import ProductPage from "./product-components/ProductPage";
import Product from "./product-components/Product";
import ShippingAndBilling from "./product-components/cart-checkout-components/ShippingAndBilling";
import PaymentMethod from "./product-components/cart-checkout-components/PayementMethod";
import FaceApi from "./product-components/FaceApi";
import DoctorRegister from "./forms-components/DoctorRegister";
import HomeVisit from "./forms-components/HomeVisitAppointment";
import DoctorOnlineAppointment from "./forms-components/DoctorOnlineAppointment";
import ManufacturerRegister from "./forms-components/ManufacturerRegister";
import AggregatorRegister from "./forms-components/AggregatorRegister";
import Eyemeasurement from "./product-components/Eyemeasurement";
import FAQHelp from "./footer-components/FAQHelp";
import VendorRefundPolicy from "./footer-components/VendorRefundPolicy";
import CustomerRefundPolicy from "./footer-components/CustomerRefundPolicy";
import TermsAndConditions from "./footer-components/TermsAndConditions";
import PrivacyPolicy from "./footer-components/PrivacyPolicy";
import OrderDetail from "./additional-components/orderDetails";
function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ProductPage" element={<ProductPage />}></Route>
          <Route path="/Category" element={<Category />}></Route>
          <Route path="/Category/:id" element={<Category />}></Route>
          <Route path="/Product" element={<Product />}></Route>
          <Route path="/Checkout" element={<Checkout />}></Route>
          <Route
            path="/ShippingAndBilling"
            element={<ShippingAndBilling />}
          ></Route>
          <Route path="/PaymentMethod" element={<PaymentMethod />}></Route>
          <Route path="/Brandpage" element={<Brandpage />}></Route>
          <Route path="/Flashsale" element={<FlashSale />} />
          <Route path="/Contact" element={<Contect />} />
          <Route path="/Offer" element={<Offer />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/UserRegister" element={<UserRegister />} />
          <Route path="/UserLogin" element={<UserLogin />} />
          <Route path="/FaceApi" element={<FaceApi />} />
          <Route path="/DoctorRegister" element={<DoctorRegister />} />
          <Route path="/HomeVisit" element={<HomeVisit />} />
          <Route
            path="/DoctorOnlineAppointment"
            element={<DoctorOnlineAppointment />}
          />
          <Route
            path="/ManufacturerRegister"
            element={<ManufacturerRegister />}
          />
          <Route path="/AggregatorRegister" element={<AggregatorRegister />} />
          <Route path="/Faceipd" element={<Eyemeasurement />} />
          <Route path="/FAQHelp" element={<FAQHelp />} />
          <Route path="/VendorRefundPolicy" element={<VendorRefundPolicy />} />
          <Route
            path="/CustomerRefundPolicy"
            element={<CustomerRefundPolicy />}
          />
          <Route path="/TermsAndConditions" element={<TermsAndConditions />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/order-details/:id" element={<OrderDetail />} />
        </Routes>
        <div className="footer-gap">
          <Footer />
        </div>
      </Router>
    </>
  );
}

export default App;
