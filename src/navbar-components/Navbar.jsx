import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import CartModal from "../product-components/cart-checkout-components/CartModal";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  getCartList
} from "../redux-components/features/cartSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const baseUrl = process.env.REACT_APP_API_URL;
  const searchRef = useRef(null);
  const incresCard = useSelector((state) => state.allCart.cart);
  const [showModal, setShowModal] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));
  const [logoUrl, setLogoUrl] = useState(""); // State to store logo URL


  // State for products and pagination
  const [allProducts, setProducts] = useState([]);

  // Fetch products from API
  const fetchProducts = async (page = 1) => {
    try {
      const response = await fetch(
        `${baseUrl}/api/v1/products/all-products`
      );
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    fetch(`${baseUrl}/api/v1/config`)
      .then((response) => response.json())
      .then((data) => {
        setLogoUrl(data.company_logo); // Set the logo URL from API
      })
      .catch((error) => {
        console.error("Error fetching company logo:", error);
      });
  }, []);

  const handleCartModalClose = () => setShowModal(false);
  const handleCartModal = () => setShowModal(true);
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

  const toggleSearch = () => {
    setIsSearchOpen((prev) => !prev);
  };

  // Filter products based on search input
  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchValue(searchTerm);
    if (searchTerm !== "") {
      const filtered = allProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
        setSearchValue(""); // Reset search value
        setFilteredProducts([]); // Clear filtered results
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Navigate to product page
  const handleProductClick = (productId) => {
    const selectedProduct = allProducts.find((item) => item.id === productId);
    if (selectedProduct) {
      navigate("/Product", {
        state: {
          allProducts,
          selectedProduct,
        },
      });
      setIsSearchOpen(false); // Close the dropdown after navigation
    }
  };

  function myProfile() {
    navigate("/Profile");
  }
  function myOrder() {
    navigate("/Orders");
  }
  function doctorRegister() {
    navigate("/DoctorOnlineAppointment");
  }

  function visitHomeAppointment() {
    navigate("/HomeVisit");
  }

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) { // Adjust the value as per your requirement
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    dispatch(getCartList());
  }, []);
  return (
    <>
      <section className="navbarSection" style={{
        position: isSticky ? "fixed" : "relative",
        top: isSticky ? 0 : "auto",
        width: "100%",
        zIndex: 1000,
        transition: "all ease, opacity 0.3s ease",
      }}>
        <div className="container">
          <div className="nav">
            <Link to="/" className="text-black">
              {/* Use the dynamically fetched logo URL */}
              {logoUrl ? (
                <img className="nav-img" src={logoUrl} alt="Logo" />
              ) : (
                <img className="nav-img" src="/additional/logooffline.png" alt="Logo" />
              )}
            </Link>

            {/* nav items here */}
            <div className="navMenuContainerList">
              <div className="NavMenuList">
                <div className="hoverList">
                  <li>
                    <NavLink
                      to="/ProductPage"
                      className={({ isActive }) => (isActive ? " active" : "")}
                    >
                      Product
                    </NavLink>
                  </li>
                </div>
              </div>
              <li>
                <NavLink
                  to="/Category"
                  className={({ isActive }) => (isActive ? " active" : "")}
                >
                  Category
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/Brandpage"
                  className={({ isActive }) => (isActive ? " active" : "")}
                >
                  Brand
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/Contact"
                  className={({ isActive }) => (isActive ? " active" : "")}
                >
                  Contact
                </NavLink>
              </li>
              <li>
                {" "}
                <NavLink
                  to="/Faceipd"
                  className={({ isActive }) => (isActive ? " active" : "")}
                >
                  IPD Measure
                </NavLink>
              </li>
              {/* <li>
              <NavLink to="/Flashsale" className={({ isActive }) => isActive ? " active" : ""}>
                Flash Sale
              </NavLink>
            </li> */}
            </div>

            {/* search bar here */}
            <div
              className="d-flex align-items-center navbar-searchbar-container position-relative"
              ref={searchRef}
            >
              <div className="navSearchBtn" onClick={toggleSearch}>
                <span className="material-symbols-outlined navbar-search-icon">
                  search
                </span>
              </div>

              {isSearchOpen && (
                <div className="navbar-search-dropdown">
                  <div className="searchInputFeald">
                    <span className="material-symbols-outlined">
                      {" "}
                      eyeglasses{" "}
                    </span>
                    <input
                      type="text"
                      className="navbar-search-input"
                      value={searchValue}
                      onChange={handleSearchChange}
                      placeholder="Find Your Type"
                    />
                  </div>
                  {filteredProducts.length > 0 && (
                    <div className="navbar-search-results">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="searchCardList"
                          onClick={() => handleProductClick(product.id)}
                        >
                          <div className="cardbarImg">
                            <img
                              src={`${baseUrl}/storage/app/public/product/thumbnail/${product.thumbnail}`}
                              alt={product.name}
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "contain",
                              }}
                            />
                          </div>
                          <div className="navbar-search-item-details">
                            <p className="cardListName">{product.name}</p>
                            <div className="searchCard">
                              <span>₹ {product.unit_price}/-</span>
                              <div>
                                <del> ₹ {product.purchase_price}</del>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* user details and cart here */}

            {userData ? (
              <>
                <div className="responsiveDone">
                  <div className="dropdown memberDropdownMenu">
                    <button
                      className="dropdown-toggle userprofile-dropdown-btn"
                      type="button"
                      id="partnerDropdownButton"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Appointment
                    </button>
                    <ul
                      className="dropdown-menu adminDropdownMenu"
                      aria-labelledby="partnerDropdownButton"
                      style={{ backgroundColor: "#f0f0f0" }}
                    >
                      {/* {/ <li onClick={doctorRegister}>Doctor Appointment</li> /} */}
                      <li onClick={doctorRegister}>Doctor Appointment</li>

                      <li onClick={visitHomeAppointment}>
                        Home Visit Appointment
                      </li>
                    </ul>
                  </div>

                  <div className="adminSide">
                    <div>
                      <div onClick={handleCartModal} className="notiContainer">
                        <div className="nav-cart navIcon">
                          <span className="material-symbols-outlined">
                            shopping_bag
                          </span>{" "}
                        </div>

                        <div className="notifaction">{incresCard.length}</div>
                      </div>
                    </div>
                    <div
                      className="dropdown userprofile-dropdown dropdown-toggle userprofile-dropdown-btn"
                      id="dropdownMenuButton"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <span className="userNameFeald">
                        {userData?.f_name?.toUpperCase()}
                      </span>
                      <ul
                        className="dropdown-menu adminDropdownMenu"
                        aria-labelledby="dropdownMenuButton"
                        style={{ backgroundColor: "#f0f0f0" }}
                      >
                        <li onClick={myProfile}>My Profile</li>
                        <li onClick={handleLogout}>Log Out</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="loginBtnDiv">
                <Link to="/UserLogin">Login</Link>
              </div>
            )}

            <button
              className="btn burgerMenuBtn"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasRight"
              aria-controls="offcanvasRight"
            >
              <span class="material-symbols-outlined">menu</span>
            </button>
          </div>
          {showModal && (
            <CartModal handleCartModalClose={handleCartModalClose} />
          )}
        </div>
      </section>

      <div
        className="offcanvas offcanvas-end burgerSidebarOffcanves"
        tabindex="-1"
        id="offcanvasRight"
        aria-labelledby="offcanvasRightLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasRightLabel">
            Menu
          </h5>
          <button
            type="button"
            className=""
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ><span class="material-symbols-outlined">
              close
            </span></button>
        </div>
        <div className="offcanvas-body mobileOffcanvesBody">
          <div className="navMenuContainerList responsiveMenuListDiv">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) => (isActive ? " active" : "")}
              >
                Home
              </NavLink>
            </li>
            <div className="NavMenuList">
              <div className="hoverList">
                <li>
                  <NavLink
                    to="/ProductPage"
                    className={({ isActive }) => (isActive ? " active" : "")}
                  >
                    Product
                  </NavLink>
                </li>
              </div>
            </div>
            <li>
              <NavLink
                to="/Category"
                className={({ isActive }) => (isActive ? " active" : "")}
              >
                Category
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Brandpage"
                className={({ isActive }) => (isActive ? " active" : "")}
              >
                Brand
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Contact"
                className={({ isActive }) => (isActive ? " active" : "")}
              >
                Contact
              </NavLink>
            </li>
            <li>

              <NavLink
                to="/Faceipd"
                className={({ isActive }) => (isActive ? " active" : "")}
              >
                IPD Measure
              </NavLink>
            </li>
            <li>
            <div>
                      <div onClick={handleCartModal} className="notiContainer">
                        <div className="nav-cart navIcon">
                          Add to Cart
                        </div>

                        <div className="notifaction">{incresCard.length}</div>
                      </div>
                    </div>
            </li>
            <li>

              <NavLink
                to="/Profile"
                className={({ isActive }) => (isActive ? " active" : "")}
              >
                My Profile
              </NavLink>
            </li>
            <li onClick={doctorRegister}>Doctor Appointment</li>

<li onClick={visitHomeAppointment}>
  Home Visit Appointment
</li>
<li onClick={handleLogout}>Log Out</li>

            {/* <li>
              <NavLink to="/Flashsale" className={({ isActive }) => isActive ? " active" : ""}>
                Flash Sale
              </NavLink>
            </li> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
