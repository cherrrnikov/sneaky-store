import React, { useState, useEffect } from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";
import ProductList from "./ProductList";
import Footer from "./Footer";
import Categories from "./Categories";
import Brands from "./Brands";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const [showSearchInHero, setShowSearchInHero] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setShowSearchInHero(window.innerWidth < 1024); // Условие для переключения
    };

    handleResize(); // Вызываем при монтировании
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.section) {
      setTimeout(() => {
        const section = document.getElementById(location.state.section);
        if (section) {
          const headerHeight = document.getElementById('header').offsetHeight;
          
          window.scrollTo({
            top: section.offsetTop - headerHeight, // Смещаем на высоту хедера
            behavior: 'smooth' // Плавная прокрутка
          });

        }
    }, 100);
    } 
}, [location]);

  return (
    <div className="HomePage page">
      <Header renderSearchForm={!showSearchInHero}/>
        <div className="home-page">
          <HeroSection renderSearchForm={showSearchInHero} />
          <Categories/>
          <Brands/>
          <ProductList />
        </div>
      <Footer />
    </div>
  );
};

export default HomePage;
