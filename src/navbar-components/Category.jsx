import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Banner from "../home-components/Banner";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import {
  addProduct,
  getCategoryList,
  getProductList,
  addWishList,
  getWishList,
  getCartList,
} from "../redux-components/features/cartSlice";

function Category() {
  const baseUrl = process.env.REACT_APP_API_URL;
  const { id } = useParams();
  const { state } = useLocation();
  const cateName = state?.name || "All";
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const {categoryList } = useSelector((state) => state.allCart);
  const dispatch = useDispatch();

  const [productList, setProducts] = useState([]);

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

  const handleFilter = (cateId) => {
    if (cateId === "All") {
      setSelectedCategory(cateId);
      setFilteredData(productList);
    } else {
      const filterProduct = cateId.id
        ? productList.filter((item) => item.category_id == cateId.id)
        // ? productList.filter((item) => item.category_id || item.sub_category_id == cateId.id)
        : productList;
      setFilteredData(filterProduct);
      setSelectedCategory(cateId.name);
    }
  };

  const handleModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };
  useEffect(() => {
    dispatch(getProductList());
    dispatch(getCategoryList());
  }, []);

  useEffect(() => {
    if (selectedCategory == "All") {
      setFilteredData(productList);
    }
  }, []);

  useEffect(() => {
    const filterProduct = id
      ? productList.filter((item) => item.category_id == id)
      : productList;
    setFilteredData(filterProduct);
    setSelectedCategory(cateName);
  }, [id]);

  const flattenedCategories = [];
  categoryList?.forEach((category) => {
    flattenedCategories.push(category);
    category.childes?.forEach((child) => {
      flattenedCategories.push(child);
    });
  });

  const [addToCartLoading, setAddToCartLoading] = useState(false);

  const handleAddProduct = () => {
    setAddToCartLoading(true);
    dispatch(addProduct(selectedProduct))
      .then((res) => {
        if (res.payload.status === 200) {
          handleCloseModal();
          dispatch(getCartList());
        }
      })
      .finally(() => {
        setAddToCartLoading(false);
      });
  };

  // wishlist logic is here
  const [wishlist, setWishList] = useState([]);
  useEffect(() => {
    dispatch(getWishList()).then((res) => {
      setWishList(res?.payload);
    });
  }, [dispatch]);

  const [loading, setLoading] = useState(false);

  const handleFavoriteIcon = (id) => {
    setLoading(true);
    dispatch(addWishList(id))
      .then((res) => {
        if (res.payload.status === 200) {
          dispatch(getWishList()).then((res) => {
            setWishList(res?.payload);
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  // Function to check if product is in the wishlist
  const isProductInWishlist = (id) => {
    const wishList = Array.isArray(wishlist) && wishlist.length > 0 ? wishlist : [];
    return wishList?.some((item) => item.product_id === id);
  };

 
  function getReviewsAndAverageRating(items) {
    let result = [];

    if (!Array.isArray(items) || items.length === 0) {
      return result; // Return empty array if items is null, undefined, or not an array
    }

    items.forEach((item) => {
      if (!Array.isArray(item) || item.length === 0) {
        return; // Skip processing if item is not an array or is empty
      }

      let allReviews = [];
      let totalRating = 0;
      let totalReviews = 0;

      item.forEach((review) => {
        if (review && typeof review.rating === "number") {
          allReviews.push(review.rating);
          totalRating += review.rating;
          totalReviews++;
        }
      });

      const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : "0.0";

      result.push({
        _id: item[0]?.product_id || null,
        reviews: allReviews,
        averageRating: averageRating,
      });
    });

    return result;
  }

  const items = filteredData.map((item) => item.reviews);
  const result = getReviewsAndAverageRating(items);

  return (
    <>
      <section>
        <div className="container">
          <div className="homeSliderSection marginTop50">
            <h3>Our Categories</h3>
            <Swiper
              pagination={{
                clickable: true,
              }}
              loop={true}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              breakpoints={{
                410: {
                  slidesPerView: 2,
                  spaceBetween: 10,
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 4,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 6,
                  spaceBetween: 20,
                },
              }}
              // navigation={true}
              modules={[Autoplay]}
            >
              {flattenedCategories?.map((item) => {
                return (
                  <SwiperSlide className="homeCardSlider py-5">
                    <div className="homeCardImg">
                      <img
                        className="swiper2-img"
                        src={`${baseUrl}/storage/app/public/category/${item.icon}`}
                        alt={item.name}
                        onClick={() => handleFilter(item)}
                      />
                    </div>
                    <p>{item.name}</p>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            <div className="filter-category-section">
              {filteredData.length !== 0
                ? filteredData.map((item) => (
                    <div key={item.id} className="filter-category-section-card">
                      <div className="wishlistDiv">
                        <span
                          className={`material-symbols-outlined ${
                            isProductInWishlist(item.id)
                              ? "favorite"
                              : "unfavorite"
                          }`}
                          onClick={() => {
                            if (!loading) handleFavoriteIcon(item.id);
                          }}
                          style={{
                            cursor: loading ? "not-allowed" : "pointer",
                            pointerEvents: loading ? "none" : "auto",
                          }}
                        >
                          favorite
                        </span>
                      </div>
                      <div className="d-grid justify-content-center">
                        <img
                          src={`${baseUrl}/storage/app/public/product/thumbnail/${item.thumbnail}`}
                          alt="err"
                          onClick={() => handleModal(item)}
                        />
                      </div>

                      <div className="productCardHead">
                        <div className="productCardTitle">
                          {item.name}
                          {result?.map((rating) => {
                            if (rating._id === item.id) {
                              return (
                                <>
                                  <p className="starPara">
                                    <span class="material-symbols-outlined startSpan">
                                      star
                                    </span>{" "}
                                    {rating.averageRating}
                                  </p>
                                </>
                              );
                            }
                          })}
                          {/* <div className="cardReview">
                            <span class="material-symbols-outlined">star</span>
                            4.5
                          </div> */}
                        </div>

                        {/* d-flex layout for the category name */}
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="category-name">
                            {item.category_name}
                          </span>
                        </div>
                        <div className="productPara">
                          Transparent Glasses for Men
                        </div>

                        <div className="cardPrice">
                          ₹ {item.unit_price}/-
                          <span>
                            <del className="text-danger">
                              ₹ {item.purchase_price}.00
                            </del>
                          </span>
                        </div>
                        <div className="cardBtnDiv">
                          <button onClick={() => handleModal(item)}>
                            View Product
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                : <div className="loaderbrands mt-5"></div>}
            </div>
          </div>

          {/* Modal for Product Details */}
          {showModal && selectedProduct && (
            <div
              className="modal fade show d-block pt-5"
              tabIndex="-1"
              role="dialog"
              aria-labelledby="exampleModalLabel"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
              <div
                className="modal-dialog modal-dialog-centered modal-lg pt-4"
                role="document"
              >
                <div className="modal-content cardModalContent">
                  <div className="modal-header productModalHead">
                    <button
                      type="button"
                      className="close"
                      onClick={handleCloseModal}
                      aria-label="Close"
                    >
                      <span class="material-symbols-outlined">close</span>
                    </button>
                  </div>
                  <div className="modal-body productCardModalBody">
                    <div className="productCardRow">
                      <div className="col-md-5 productCardImg">
                        <img
                          src={`${baseUrl}/storage/app/public/product/thumbnail/${selectedProduct.thumbnail}`}
                          alt={selectedProduct.name}
                          className="img-fluid"
                        />
                      </div>
                      <div className="col-md-6 productCardText">
                        <h4>
                          {selectedProduct.name}{" "}
                          <div className="cardReview">
                            {result?.map((rating) => {
                              if (rating._id === selectedProduct.id) {
                                return (
                                  <>
                                    <p className="starPara">
                                      <span class="material-symbols-outlined startSpan">
                                        star
                                      </span>{" "}
                                      {rating.averageRating}
                                    </p>
                                  </>
                                );
                              }
                            })}
                          </div>
                        </h4>
                        <p>Classic frames for men by Eyecare</p>

                        <div className="productCardPrice">
                          <span>₹ {selectedProduct.unit_price}</span>
                          <div>
                            <del className="text-danger">
                              ₹ {selectedProduct.purchase_price}
                            </del>
                          </div>
                          <p>(5% off)</p>
                        </div>

                        <div className="cardModalBtn">
                          <button
                            onClick={handleAddProduct}
                            className="cardAddtoCartbtn"
                            disabled={addToCartLoading} 
                          >
                            <span className="material-symbols-outlined">
                              shopping_bag
                            </span>
                            {addToCartLoading
                              ? "Please wait..."
                              : "Add to Cart"}{" "}
                            {/* Optional feedback */}
                          </button>
                          <Link to="/FaceApi">
                            <button className="card3dBtn">
                              <span class="material-symbols-outlined">
                                eyeglasses
                              </span>{" "}
                              3D Try On
                            </button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Banner />
    </>
  );
}

export default Category;
