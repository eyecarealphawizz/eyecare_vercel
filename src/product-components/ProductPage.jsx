import { useEffect, useState } from "react";
import "../App.css";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  addProduct,
  addWishList,
  getCartList,
  getWishList,
} from "../redux-components/features/cartSlice";
import Banner from "../home-components/Banner";

const ProductPage = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();

  // State for products and pagination
  const [products, setProducts] = useState([]);

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

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  // Wishlist functionality
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

  const isProductInWishlist = (id) => {
    return Array.isArray(wishlist) && wishlist.length > 0
      ? wishlist.some((item) => item.product_id === id)
      : false;
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

  const items = products.map((item) => item.reviews);
  const result = getReviewsAndAverageRating(items);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // Set the number of products to show per page

  // Calculate the index of the last product and the first product on the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  // Get the current products
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Calculate the total number of pages
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <>
      <div className="homeSliderSection marginTop50">
        <div className="container">
          <h3 className="text-center">Our Products</h3>
          <div className="card1-1">
            <div className="loadmoreContainer">
              <div className="card1-5">
                {products.length > 0 ? (
                  currentProducts.map((lensData) => (
                    <div key={lensData.id} data={lensData} className="card1-3 p-3">
                      <div className="wishlistDiv">
                        <span
                          className={`material-symbols-outlined ${isProductInWishlist(lensData.id) ? "favorite" : "unfavorite"}`}
                          onClick={() => !loading && handleFavoriteIcon(lensData.id)}
                          style={{
                            cursor: loading ? "not-allowed" : "pointer",
                            pointerEvents: loading ? "none" : "auto",
                          }}
                        >
                          favorite
                        </span>
                      </div>
                      <img
                        onClick={() => handleModal(lensData)}
                        src={`${baseUrl}/storage/app/public/product/thumbnail/${lensData.thumbnail}`}
                        alt={lensData.name}
                        className="swiper2-img"
                      />
                      <div className="productCardHead">
                        <div className="productCardTitle">
                          {lensData.name}
                          {result?.map((item) => (
                            item._id === lensData.id && (
                              <p className="starPara" key={item._id}>
                                <span className="material-symbols-outlined startSpan">star</span>
                                {item.averageRating}
                              </p>
                            )
                          ))}
                        </div>
                        <div className="productPara">
                          <p>Classic men frames by Eyecare</p>
                        </div>
                        <div className="cardPrice">
                          ₹ {lensData.unit_price}/-
                          <span>
                            <del className="text-danger">₹{lensData.purchase_price}</del>
                          </span>
                        </div>
                        <div className="cardBtnDiv">
                          <button onClick={() => handleModal(lensData)}>View Product</button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="loaderbrands mt-5"></div>
                )}
              </div>
            </div>
          </div>
          {/* Pagination Controls */}
          <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center">
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(index + 1)}
                    disabled={totalPages <= 1}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {showModal && selectedProduct && (
            <div className="modal fade show d-block pt-5" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
              <div className="modal-dialog modal-dialog-centered modal-lg pt-4" role="document">
                <div className="modal-content cardModalContent">
                  <div className="modal-header productModalHead">
                    <button type="button" className="close" onClick={handleCloseModal} aria-label="Close">
                      <span className="material-symbols-outlined">close</span>
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
                          {selectedProduct.name}
                          <div className="cardReview">
                            {result?.map((item) => {
                              if (item._id === selectedProduct.id) {
                                return (
                                  <p className="starPara">
                                    <span className="material-symbols-outlined startSpan">star</span> {item.averageRating}
                                  </p>
                                );
                              }
                            })}
                          </div>
                        </h4>
                        <p>Classic men frames by Eyecare</p>
                        <div className="productCardPrice">
                          <span>₹ {selectedProduct.unit_price}/-</span>
                          <div>
                            <del className="text-danger">₹ {selectedProduct.purchase_price}</del>
                          </div>
                          <p>(5% off)</p>
                        </div>
                        <div className="cardModalBtn">
                          <button onClick={handleAddProduct} className="cardAddtoCartbtn" disabled={addToCartLoading}>
                            <span className="material-symbols-outlined">shopping_bag</span>
                            {addToCartLoading ? "Please wait..." : "Add to Cart"}
                          </button>
                          <button className="wishist" onClick={() => handleFavoriteIcon(selectedProduct.id)} disabled={loading}>
                            {loading ? <span>Please wait...</span> : <>
                              <span className="material-symbols-outlined">favorite</span> Add Wishlist
                            </>}
                          </button>
                        </div>
                        <Link to="/FaceApi">
                          <button className="card3dBtn mt-3">
                            <span className="material-symbols-outlined">eyeglasses</span> 3D Try On
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Banner />
    </>

  );
};

export default ProductPage;
