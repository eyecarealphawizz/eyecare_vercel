import React, { useEffect } from "react";
import "../../App.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryList } from "../../redux-components/features/cartSlice";
import { useNavigate } from "react-router-dom";

const Swiper1 = () => {
  const baseUrl = process.env.REACT_APP_API_URL;
  const { categoryList } = useSelector((state) => state.allCart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Flatten the categoryList and childes into a single array
  const flattenedCategories = [];
  categoryList?.forEach((category) => {
    flattenedCategories.push(category);
    category.childes?.forEach((child) => {
      flattenedCategories.push(child);
    });
  });
  
  useEffect(() => {
    dispatch(getCategoryList());
  }, [dispatch]);

  return (
    <section className="homeSliderSection marginTop50">
      <div className="container">
        <h3>WEAR THE TREND</h3>
          <Swiper
            pagination={{
              clickable: true,
            }}
            loop={true}
            // autoplay={{
            //   delay: 2000,
            //   disableOnInteraction: false,
            //   pauseOnMouseEnter: true,
            // }}
            breakpoints={{
              200: {
                slidesPerView: 3,
                spaceBetween: 10,
              },              
              410: {
                slidesPerView: 3,
                spaceBetween: 10,
              },              
              640: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 4,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 6,
                spaceBetween: 20,
              }
             
            }}
            // navigation={true}
            modules={[Autoplay]}
          >
            {flattenedCategories.length !== 0
            ? flattenedCategories.map((item, index) => (
              <SwiperSlide key={index} className="homeCardSlider"> 
                <div className="homeCardImg">
                  <img
                  className="swiper2-img"
                    src={`${baseUrl}/storage/app/public/category/${item.icon}`}
                    alt={item.name}
                    onClick={() =>
                      navigate(`/Category/${item.id}`, {
                        state: { name: item.name },
                      })
                    }
                  />
                </div>
                    <p>{item.name}</p>
              </SwiperSlide>
            ))
            : <div className="loaderbrands mt-5"></div>}
          </Swiper>
      </div>
    </section>
  );
};

export default Swiper1;
