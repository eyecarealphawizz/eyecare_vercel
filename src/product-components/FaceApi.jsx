import React, { useState, useRef, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FetchProduct } from "../redux-components/Api/productApi";
import {
  addProduct,
  getCartList,
  product,
  getWishList,
  addWishList
} from "../redux-components/features/cartSlice";
import "../FaceApi.css";
function FaceApi() {
  const baseUrl = process.env.REACT_APP_API_URL;
  const [image, setImage] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [glassesPosition, setGlassesPosition] = useState({ x: 200, y: 200 });
  const [glassesSize, setGlassesSize] = useState(200);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const webgazerRef = useRef(null);
  const [showCapturedProducts, setShowCapturedProducts] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCaptureButton, setShowCaptureButton] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const openCamera = () => {
    setImage();
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraOn(true);

        const webgazer = window.webgazer;
        webgazerRef.current = webgazer;
        webgazer
          .setGazeListener((data, clock) => {
            console.log(data);

            if (data && data.eyeFeatures) {
              const leftEye = data.eyeFeatures.left;
              const rightEye = data.eyeFeatures.right;

              // Distance between eyes
              const eyeDistance = Math.sqrt(
                Math.pow(rightEye.imagex - leftEye.imagex, 2) +
                  Math.pow(rightEye.imagey - leftEye.imagey, 2)
              );

              const newSize = eyeDistance * 2;

              setGlassesPosition({
                x: (leftEye.imagex + rightEye.imagex) / 2 - newSize / 2.6,
                y: (leftEye.imagey + rightEye.imagey) / 2 - newSize / 7.8,
              });

              setGlassesSize(newSize);

              console.log("Left Eye:", leftEye, "Right Eye:", rightEye);
            }
          })
          .begin();
        setTimeout(() => {
          setIsLoading(false);
          setShowCaptureButton(true);
        }, 5000);
      })
      .catch((err) => console.error("Error accessing camera: ", err));
    document.body.classList.add("Face");
  };

  const closeCamera = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOn(false);

      if (webgazerRef.current) {
        webgazerRef.current.end();
        webgazerRef.current = null;
      }
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) {
      console.error("Video element is not available");
      return;
    }

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const originalWidth = 640;
    const originalHeight = 480;

    const currentWidth = canvas.width;
    const currentHeight = canvas.height;

    const scaleX = currentWidth / originalWidth;
    const scaleY = currentHeight / originalHeight;

    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL("image/png");
    setImage(imageData);
    setShowCapturedProducts(true);

    setGlassesPosition({
      x: glassesPosition.x * scaleX,
      y: glassesPosition.y * scaleY,
    });
    setGlassesSize(glassesSize * scaleX);

    closeCamera();
    setIsModalOpen(false);
  };

  const Allproduct = useSelector((state) => state.allCart.items);
  const dispatch = useDispatch();
  console.log(Allproduct);

  useEffect(() => {
    // Replacing async/await with .then() and .catch()
    FetchProduct()
      .then((res) => {
        dispatch(product(res.data));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch]);

  // Pagination
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [pageSize] = useState(8);

  useEffect(() => {
    setLoading(true);
    // Using .then() and .catch() instead of async/await
    FetchProduct(page, selectedCategory)
      .then((data) => {
        setLoading(false);
        if (data && data.products.length > 0) {
          setHasMoreProducts(data.products.length === pageSize);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  }, [dispatch, page, selectedCategory]);

  const filteredProducts = selectedCategory
    ? Allproduct.filter((product) =>
        product.category_ids.some(
          (category) => category.id.toString() === selectedCategory
        )
      )
    : Allproduct;

  const displayedProducts =
    filteredProducts?.slice((page - 1) * pageSize, page * pageSize) || [];

  const totalPages = Math.ceil(filteredProducts?.length / pageSize);

  const handleNext = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrev = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbers = 5;
    let startPage = Math.max(page - Math.floor(maxPageNumbers / 2), 1);
    let endPage = Math.min(startPage + maxPageNumbers - 1, totalPages);
    if (endPage - startPage + 1 < maxPageNumbers) {
      startPage = Math.max(endPage - maxPageNumbers + 1, 1);
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };
  // const handleAddProduct = (data) => {
  //   dispatch(addProduct(data)).then((res) => {
  //     if (res.payload.status == 200) {
  //       dispatch(getCartList());
  //     }
  //   });
  // };
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const handleAddProduct = (data) => {
    setAddToCartLoading(true);
    dispatch(addProduct(data))
      .then((res) => {
        if (res.payload.status === 200) {
          // handleCloseModal();
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
 
   const [loadingfav, setLoadingFav] = useState(false);
 
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
         setLoadingFav(false); 
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
 
   const items = displayedProducts.map((item) => item.reviews);
   const result = getReviewsAndAverageRating(items);
 
   
 

  return (
    <div style={{ textAlign: "center" }}>
      {/* Modal for Camera */}
      <div
        style={{
          zIndex: 1,
        }}
      >
        {isModalOpen && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "10px",
                position: "relative",
                width: "800px",
                height: "520px",
                marginTop: "70px",
              }}
            >
              {isLoading ? (
                <div
                  className="spinner"
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div
                    style={{
                      border: "4px solid #f3f3f3",
                      borderTop: "4px solid #3498db",
                      borderRadius: "50%",
                      width: "24px",
                      height: "24px",
                      animation: "spin 2s linear infinite",
                    }}
                  ></div>
                </div>
              ) : (
                <button
                  // onClick={() => {setIsModalOpen(false);closeCamera();}}
                  onClick={() => {
                    setIsModalOpen(false);
                    window.location.reload();
                  }}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "30px",
                    height: "30px",
                    cursor: "pointer",
                  }}
                >
                  X
                </button>
              )}

              <video
                is="webgazerVideoFeed"
                className="element.style"
                ref={videoRef}
                style={{
                  width: "300px",
                  height: "300px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  display: "none",
                }}
              />

              <canvas
                id="webgazerFaceOverlay"
                ref={canvasRef}
                width={300}
                height={300}
                style={{ display: "none" }}
              />

              <div style={{ marginTop: "450px" }}>
                {showCaptureButton && (
                  <button
                    onClick={capturePhoto}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#008CBA",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    disabled={!isCameraOn}
                  >
                    Capture Photo
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      <section>
        <div className="">
          <div className="tryOnContainer">
            <div className="tryOnHead col-md-6">
              <h4>NOT SURE ABOUT THE</h4>
              <div>SHAPE ?</div>
              <p>
                Find the perfect fit for<br></br>your face shape
              </p>
              <button
                onClick={() => {
                  openCamera();
                  setIsModalOpen(true);
                }}
              >
                OPEN CAMERA +
              </button>
            </div>
            <div className="tryonImg col-md-6">
              <img src="../../additional/tryonImg.png" alt="" />
            </div>
          </div>
        </div>
      </section>

      {showCapturedProducts ? (
        <div className="categoryCardContainer">
          <div className="container ">
            <div
              className="row"
              style={{
                width: "calc(100% - 50px;)",
                gap: "20px",
                justifyContent: "center",
              }}
            >
              {displayedProducts.length > 0 ? (
                displayedProducts.map((data) => (
                  <div
                    key={data.id}
                    data={data}
                    className="categoryCard"
                    style={{ height: "440px", width: "320px" }}
                  >
                    <div className="categoryImg">
                      {image && (
                        <div
                          style={{
                            position: "relative",
                            display: "inline-block",
                          }}
                        >
                          <img
                            src={image}
                            alt="Captured"
                            style={{
                              width: "300px",
                              height: "300px",
                              objectFit: "cover",
                              borderRadius: "10px",
                            }}
                          />
                          <img
                            // src={chasma}
                            src={`${baseUrl}/storage/app/public/product/thumbnail/${data.thumbnail}`}
                            alt="Glasses Overlay"
                            style={{
                              position: "absolute",
                              top: `${glassesPosition.y}px`,
                              left: `${glassesPosition.x}px`,
                              width: `${glassesSize}px`,
                              height: "auto",
                              zIndex: 11,
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="productCardHead">
                      <div className="productCardTitle">{data.name}
                        {result?.map((rating) => {
                              if (rating._id === data.id) {
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
                            })}</div>
                      <div className="cardPrice">
                        ₹ {data.unit_price}/-{" "}
                        <span>
                          <del className="text-danger">
                            ₹ {data.purchase_price}
                          </del>
                        </span>
                      </div>
                      <div className="cardBtnDiv">
                        <button onClick={() => handleAddProduct(data)}>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No products available</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="categoryCardContainer">
          <div className="container ">
            <div
              className="row"
              style={{
                width: "calc(100% - 50px;)",
                gap: "20px",
                justifyContent: "center",
              }}
            >
              {displayedProducts.length > 0 ? (
                displayedProducts.map((data) => (
                  <div key={data.id} data={data} className="categoryCard">
                   <div className="wishlistDiv">
                          <span
                            className={`material-symbols-outlined ${
                              isProductInWishlist(data.id)
                                ? "favorite"
                                : "unfavorite"
                            }`}
                            onClick={() => {
                              if (!loading) handleFavoriteIcon(data.id);
                            }}
                            style={{
                              cursor: loading ? "not-allowed" : "pointer",
                              pointerEvents: loading ? "none" : "auto",
                            }}
                          >
                            favorite
                          </span>
                        </div>
                    <div className="categoryImg">
                      <img
                        src={`${baseUrl}/storage/app/public/product/thumbnail/${data.thumbnail}`}
                        alt={data.name}
                      />
                    </div>
                    <div className="productCardHead">
                      <div className="productCardTitle">
                        {data.name}
                        {result?.map((rating) => {
                              if (rating._id === data.id) {
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
                      <div className="productPara">
                        <p className="text-start">
                          Classic men frames by Eyecare
                        </p>
                      </div>
                      <div className="cardPrice">
                        ₹ {data.unit_price}/-
                        <span>
                          <del className="text-danger">
                            ₹ {data.purchase_price}
                          </del>
                        </span>
                      </div>
                      <div className="cardBtnDiv">
                        <button
                          onClick={() => handleAddProduct(data)}
                          className="cardAddtoCartbtn"
                          disabled={addToCartLoading} 
                        >
                          {/* <span className="material-symbols-outlined">
                            shopping_bag
                          </span> */}
                          {addToCartLoading ? "Please wait..." : "Add to Cart"}{" "}
                          {/* Optional feedback */}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No products available</p>
              )}{" "}
            </div>
          </div>
        </div>
      )}

      <div className="pagination">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handlePrev();
          }}
          style={{ visibility: page > 1 ? "visible" : "hidden" }}
        >
          &laquo;
        </a>
        {getPageNumbers().map((pageNumber) => (
          <a
            href="#"
            key={pageNumber}
            onClick={(e) => {
              e.preventDefault();
              setPage(pageNumber);
            }}
            style={{
              fontWeight: page === pageNumber ? "bold" : "normal",
              marginRight: "10px",
            }}
          >
            {pageNumber}
          </a>
        ))}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handleNext();
          }}
          style={{ visibility: page < totalPages ? "visible" : "hidden" }}
        >
          &raquo;
        </a>
      </div>
    </div>
  );
}

export default FaceApi;
