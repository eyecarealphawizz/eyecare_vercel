import React, { useState, useEffect } from "react";
import "../../App.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay } from "swiper/modules";

const ImgSlider = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    // Fetching banners from the API
    const fetchBanners = async () => {
      try {
        const response = await fetch(
          `${baseUrl}/api/v1/banners?banner_type=main_banner`
        );
        const data = await response.json();
        setBanners(data);
      } catch (error) {
        console.error("Error fetching banners:", error);
      }
    };

    fetchBanners();
  }, []);

  return (
    <>
      <section className="homeSliderSection pb-1">
        <Swiper
          pagination={true}
          modules={[Autoplay]}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 2000,
          }}
        >
          {banners.map((banner) => (
            <SwiperSlide key={banner.id} className="homeSliderImg">
              <a href="#" rel="noopener noreferrer">
                <img
                  src={`${baseUrl}/storage/app/public/banner/${banner.photo}`}
                  alt={banner.title || "Banner"}
                />
              </a>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
    </>
  );
};

export default ImgSlider;
