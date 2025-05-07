import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Banner from "../home-components/Banner";
import { useDispatch } from "react-redux";
import {
  addProduct,
  getCartList,
  // handleAddToCart,
} from "../redux-components/features/cartSlice";

function Product() {
  const baseUrl = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { allProducts, selectedProduct } = location.state || {};
  const product = selectedProduct;
  const handleProductClick = (relatedProduct) => {
    navigate("/product", {
      state: {
        allProducts,
        selectedProduct: relatedProduct,
      },
    });
  };

  const handleAddToCart = () => {
    dispatch(addProduct(product)).then((res) => {
      if (res.payload.status === 200) {
        dispatch(getCartList());
      }
    });
  };
  if (!product) {
    return <div>Product not found!</div>;
  }
  return (
    <>
      <section className="searchProductSection">
        <div className="searchProductCard">
          <div className="productCardImg col-md-5">
            <img
              src={`${baseUrl}/storage/app/public/product/thumbnail/${product.thumbnail}`}
              alt={product.name}
            />
          </div>
          <div className="col-md-6 productCardText">
            <h4>
              {product.name}{" "}
              <div className="cardReview">
                <span class="material-symbols-outlined">star</span>
                4.5
              </div>
            </h4>
            <p>Classic frames for men by Eyecare</p>

            <div className="productCardPrice">
              <span>₹ {product.unit_price}/-</span>
              <span>
                <del className="text-danger">₹{product.purchase_price}</del>
              </span>
              <p>(5% off)</p>
            </div>

            <div className="cardModalBtn">
              <button
                onClick={() => handleAddToCart(product)}
                className="cardAddtoCartbtn"
              >
                <span class="material-symbols-outlined">shopping_bag</span> Add
                to Cart
              </button>
              <Link to="/ProductPage">
                <button className="card3dBtn">View All Product</button>
              </Link>
            </div>
            <Link to="/FaceApi">
            <button className="card3dBtn mt-3">
              <span class="material-symbols-outlined">eyeglasses</span>
              3D Try On
            </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="homeSliderSection">
        <div className="container">
          <h3 className="">Related Products</h3>
          <div className="card1-5">
            <Swiper spaceBetween={0} slidesPerView={4} className="pb-5">
              {allProducts.map((relatedProduct, index) => (
                <SwiperSlide key={index}>
                  <div
                    className="card1-3 p-3"
                    onClick={() => handleProductClick(relatedProduct)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="wishlistDiv">
                      <span class="material-symbols-outlined">favorite</span>
                    </div>
                    <img
                      className="swiper2-img"
                      src={`${baseUrl}/storage/app/public/product/thumbnail/${relatedProduct.thumbnail}`}
                      alt={relatedProduct.name}
                    />
                    <div className="productCardHead">
                      <div className="productCardTitle">
                        {relatedProduct.name}
                        <div className="cardReview">
                          <span class="material-symbols-outlined">star</span>
                          4.5
                        </div>
                      </div>
                      <div className="productPara">
                        <p className="text-start">
                          Classic men frames by Eyecare
                        </p>
                      </div>
                      <div className="cardPrice">
                        ₹ {relatedProduct.purchase_price}/-
                        <span>
                          <del className="text-danger">
                            ₹ {relatedProduct.unit_price}
                          </del>
                        </span>
                      </div>
                      <div className="cardBtnDiv">
                        <button
                          onClick={() => {
                            window.scroll(0, 0);
                          }}
                        >
                          Buy Now
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      <Banner />
    </>
  );
}

export default Product;
