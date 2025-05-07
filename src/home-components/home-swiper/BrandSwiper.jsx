import React, { useState, useEffect } from "react";
import "../../App.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { FetchBrandApi } from "../../redux-components/Api/productApi";
import { useNavigate } from "react-router-dom";

const Swiper2 = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const [brandData, setBrandData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    FetchBrandApi()
      .then((res) => {
        setBrandData(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <section className="homeSliderSection marginTop50">
      <div className="container">
        <h3>OUR BRANDED</h3>
        <div className="brandContainerDiv">
        <Swiper
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            200: { slidesPerView: 3, spaceBetween: 20 },
            640: { slidesPerView: 3, spaceBetween: 20 },
            768: { slidesPerView: 4, spaceBetween: 20 },
            1024: { slidesPerView: 6, spaceBetween: 15 },
          }}
          modules={[Autoplay]}
        >
          {brandData.length !== 0
            ? brandData.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="card1-3 brandCardDiv">
                    <img
                      className="swiper2-img"
                      src={`${baseUrl}/storage/app/public/brand/${item.image}`}
                      alt={item.name}
                      onClick={() =>
                        navigate("/BrandPage", {
                          state: { brandId: item.id, brandName: item.name },
                        })
                      }
                    />
                    <div className="productCardHead d-none">
                      <p className="productCardTitle">{item.name}</p>
                      <div className="cardBtnDiv">
                        <button
                          onClick={() =>
                            navigate("/BrandPage", {
                              state: { brandId: item.id, brandName: item.name },
                            })
                          }
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))
              : <div className="loaderbrands"></div>}
        </Swiper>
              </div>
      </div>
    </section>
  );
};

export default Swiper2;

