import React, { useEffect } from "react";
import ImgSlider from "./home-swiper/ImgSlider";
import BrandSwiper from "./home-swiper/BrandSwiper";
import InputBox from "./InputBox";
import Banner from "./Banner";
import ProductPage from "../product-components/ProductPage";
import CategorySwiper from "./home-swiper/CategorySwiper";

function Home() {

  return (
    <>
      <ImgSlider />
      <BrandSwiper />
      <InputBox />
      <CategorySwiper />
      <ProductPage/>
      <Banner />
    </>
  );
}

export default Home;
