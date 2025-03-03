import React, { useContext, useState, useEffect } from "react";
import AuthContext from "../AuthContext";
import Header from "../HomePage/Header";
import Footer from "../HomePage/Footer";
import ProductCard from "../ProductPage/ProductCard";
import LoginModal from "../Login/LoginModal";
import SearchForm from "../SearchForm";
import "../../styles/LikedPage/LikedPage.css"
import { useNavigate } from "react-router-dom";

const LikedPage = () => {
  const { user, fetchLikedProducts, toggleLikeProduct, isAuthenticated, fetchCartProducts, toggleCartProduct } = useContext(AuthContext);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // Стейт для модального окна
  const [showSearchInHeader, setShowSearchInHeader] = useState(true); // Для отображения поиска на мобильных устройствах
  const navigate = useNavigate();


  // Загружаем все понравившиеся товары при монтировании компонента
  useEffect(() => {
    if (!user?.likedProducts) {
      fetchLikedProducts(); 
      fetchCartProducts();// Если товары не загружены, загружаем их
    }
  }, [fetchLikedProducts, user?.likedProducts, user?.cart]);

  const likedProducts = user?.likedProducts || [];

  // Обработчик лайков
  const handleLike = (e, productId) => {
    e.stopPropagation(); // Останавливаем всплытие события
    e.preventDefault();

    if (isAuthenticated) {
      toggleLikeProduct(productId); // Обновляем лайк
    } else {
      setIsLoginModalOpen(true); // Если не авторизован - открываем модальное окно
    }
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

  // Обработка изменений для мобильного поиска
  useEffect(() => {
    const handleResize = () => {
      setShowSearchInHeader(window.innerWidth >= 1024); // Показываем/скрываем форму поиска в header
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="LikedPage page">
      <Header renderSearchForm={showSearchInHeader} />
      <div className="liked-page">
        <div className="container">
          {/* Заголовок страницы с возможностью поиска */}
          <div className="liked-page-header">
            <button className="back-button brand_back-button" onClick={() => navigate(-1)}>← Back</button>
            <h2 className="liked-page-title">Liked Products</h2>
            {!showSearchInHeader && (
              <div className="mobile-search">
                <SearchForm />
              </div>
            )}
          </div>
          
          {/* Список товаров */}
          {likedProducts.length > 0 ? (
            <div className="product-list">
              {likedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onLike={handleLike}
                  isProductLiked={() => true} 
                  onProductCart={handleProductCart}
                  isProductInCart={isProductInCart}
                />
              ))}
            </div>
          ) : (
            <p>No liked products yet.</p>
          )}
        </div>
      </div>
      <Footer />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
};

export default LikedPage;
