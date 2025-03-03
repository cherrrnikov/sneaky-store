import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import { Link, useNavigate } from "react-router-dom";

import "../../styles/BrandPage/BrandPage.css";  // Create styles for BrandPage
import Header from "../HomePage/Header";
import Footer from "../HomePage/Footer";
import SearchForm from "../SearchForm";
import ProductCard from "../ProductPage/ProductCard";  // Import ProductCard component
import LoginModal from "../Login/LoginModal";
import AuthContext from "../AuthContext";

const BrandPage = () => {
  const { brand } = useParams();  // Get brand name from URL
  const navigate = useNavigate();
  const { user, isAuthenticated, toggleLikeProduct, fetchLikedProducts, fetchCartProducts, toggleCartProduct } = useContext(AuthContext);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSearchInHeader, setShowSearchInHeader] = useState(true);

  useEffect(() => {
    const fetchProductsByBrand = async () => {
      try {
        const response = await api.get(`/products/brand/${brand}`);
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load products for this brand");
        setLoading(false);
      }
    };

    fetchProductsByBrand();
    fetchLikedProducts();
    fetchCartProducts();
  }, [brand]);

  useEffect(() => {
    const handleResize = () => {
      setShowSearchInHeader(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLike = (e, productId) => {
    e.stopPropagation(); // Останавливаем всплытие события
    e.preventDefault();

    if (isAuthenticated) {
      console.log("Toggling like for product", productId);
      toggleLikeProduct(productId); // Обновляем лайк
    } else {
      setIsLoginModalOpen(true); // Открываем модальное окно, если не авторизован
    }
  };

  // Check if a product is liked by the user
  const isProductLiked = (productId) => {
    return user?.likedProducts?.some((p) => p.id === productId);
  };

  const handleProductCart = (e, productId) => {
    e.stopPropagation();
    e.preventDefault();

    if (isAuthenticated) {
      toggleCartProduct(productId);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  const isProductInCart = (productId) => {
    return Array.isArray(user?.cart) && user.cart.some((item) => item.productId === productId);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="BrandPage page">
      <Header renderSearchForm={showSearchInHeader} />
      <div id="brand-page" className="brand-page">
        <div className="container">
          <div className="brand-header">
            <button className="back-button brand_back-button" onClick={() => navigate(-1)}>← Back</button>
            <h2 className="brand-title">{brand} Products</h2>
            {!showSearchInHeader && (
              <div className="mobile-search">
                <SearchForm />
              </div>
            )}
          </div>
          <div className="product-list">
            {products.map((product) => (
              product && product.id && (
                <ProductCard
                  key={product.id}
                  product={product}
                  onLike={handleLike}       // Passing the like handler
                  isProductLiked={isProductLiked}  // Passing the like check function
                  onProductCart={handleProductCart}
                  isProductInCart={isProductInCart}
                />
              )
            ))}
          </div>
        </div>
      </div>
      <Footer />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
};

export default BrandPage;
