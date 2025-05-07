import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  addProduct,
  filterBrands,
  getCartList,
  getProductList,
  addWishList,
  getWishList
} from "../redux-components/features/cartSlice";
import { FetchBrandApi } from "../redux-components/Api/productApi";
import Banner from "../home-components/Banner";
import "../App.css";

const Brandpage = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const { state } = useLocation();
  const { brandId, brandName } = state || {};
  const [brandData, setBrandData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [isBrandSelected, setIsBrandSelected] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch all brands
  useEffect(() => {
    FetchBrandApi()
      .then((res) => setBrandData(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch products for the selected brand
  useEffect(() => {
    if (brandId) {
      dispatch(filterBrands(brandId)).then((res) => {
        setFilterData(res.payload);
        setIsBrandSelected(true);
      });
    } else {
      dispatch(getProductList()).then((res) => setFilterData(res.payload));
      setIsBrandSelected(false);
    }
  }, [brandId, dispatch]);

  // Handle Modal Display
  const handleModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

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

   items.forEach((item) => {
     let allReviews = [];
     let totalRating = 0;
     let totalReviews = 0;

     item.forEach((review) => {
       allReviews.push(review.rating);
       totalRating += review.rating;
       totalReviews++;
     });

     const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

     result.push({
       _id: item[0].product_id,
       reviews: allReviews,
       averageRating: averageRating.toFixed(1),
     });
   });

   return result;
 }
 const getItem = useSelector((state) => state.allCart.items);
 const items = getItem.map((item) => item.reviews);
 const result = getReviewsAndAverageRating(items);

  return (
    <>
      <section className="homeSliderSection marginTop50">
        <div className="container">
          <h3 className="text-center">BRANDS</h3>
          <div className="brandContainer">
          {brandData.length !== 0
            ? brandData.map((item, index) => {
              return (
                <div
                  key={index}
                  className="brand-image-container d-grid align-items-center"
                >
                  <img
                    src={`${baseUrl}/storage/app/public/brand/${item.image}`}
                    alt="Glasses 1"
                    className="brand-image"
                    onClick={() =>
                      navigate("/BrandPage", {
                        state: { brandId: item.id, brandName: item.name },
                      })
                    }
                  />
                </div>
              );
            }): <div className="loaderbrands mt-5"></div>}
          </div>
        </div>
      </section>

      {/* filterbrand */}

      <div className="homeSliderSection marginTop50">
        <div className="container">
          <h3 className="text-center">{brandName || "Our Brands"}</h3>
          <div className="card1-1">
            <div className="loadmoreContainer">
              <div className="card1-5">
                {filterData && filterData.length !== 0 ? (
                  filterData.map((product, id) => (
                    <div key={id} data={product} className="card1-3 p-3">
                     <div className="wishlistDiv">
                          <span
                            className={`material-symbols-outlined ${
                              isProductInWishlist(product.id)
                                ? "favorite"
                                : "unfavorite"
                            }`}
                            onClick={() => {
                              if (!loading) handleFavoriteIcon(product.id);
                            }}
                            style={{
                              cursor: loading ? "not-allowed" : "pointer",
                              pointerEvents: loading ? "none" : "auto",
                            }}
                          >
                            favorite
                          </span>
                        </div>
                      <img
                        onClick={() => handleModal(product)}
                        src={`${baseUrl}/storage/app/public/product/thumbnail/${product.thumbnail}`}
                        alt={product.name}
                        className="swiper2-img"
                      />
                      <div className="productCardHead">
                        <div className="productCardTitle">
                          {product.name}
                          {result?.map((item) => {
                              if (item._id === product.id) {
                                return (
                                  <>
                                    <p className="starPara">
                                      <span class="material-symbols-outlined startSpan">
                                        star
                                      </span>{" "}
                                      {item.averageRating}
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
                        <div className="productPara">
                          Transparent Glasses for Men
                        </div>
                        <div className="cardPrice">
                          ₹ {product.unit_price}/-
                          <span>
                            <del className="text-danger">
                              ₹{product.purchase_price}.00
                            </del>
                          </span>
                        </div>
                        <div className="cardBtnDiv">
                          <button onClick={() => handleModal(product)}>
                            View Product
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>
                    {isBrandSelected
                      ? <div>Currently no items here</div>
                      : <div className="loaderbrands mt-5"></div>}
                  </p>
                )}
              </div>
            </div>
          </div>
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
                        <h4>{selectedProduct.name}
                        <div className="cardReview">
                        {result?.map((item) => {
                              if (item._id === selectedProduct.id) {
                                return (
                                  <>
                                    <p className="starPara">
                                      <span class="material-symbols-outlined startSpan">
                                        star
                                      </span>{" "}
                                      {item.averageRating}
                                    </p>
                                  </>
                                );
                              }
                            })}
                        </div>
                        </h4>
                        <p>classic frames for men by Eyecare</p>
                        <div className="productCardPrice">
                          <span>₹ {selectedProduct.unit_price}/-</span>
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
                            disabled={addToCartLoading} // Disable button when loading
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
                            <button className="card3dBtn">3D Try On</button>
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
      </div>

      {/* <Swiper2 /> */}
      <Banner />
    </>
  );
};
export default Brandpage;