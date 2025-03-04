import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import Header from "../HomePage/Header";
import Footer from "../HomePage/Footer";
import "../../styles/SearchPage.css";
import { Link } from "react-router-dom";
import SearchForm from "../SearchForm";
import AuthContext from "../AuthContext";  // Импортируем контекст
import ProductCard from "../ProductPage/ProductCard"; // Импортируем новый компонент карточки товара
import LoginModal from "../Login/LoginModal"; // Импортируем компонент модального окна

const SearchPage = () => {
  const { query } = useParams();
  const navigate = useNavigate();
  const { user, toggleLikeProduct, isAuthenticated } = useContext(AuthContext); // Получаем из контекста
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSearchInHeader, setShowSearchInHeader] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // Стейт для модального окна

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await api.get(`/products/search?query=${query}`);
        console.log(response.data);
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch products");
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  useEffect(() => {
    const handleResize = () => {
      setShowSearchInHeader(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Функция для проверки, лайкнут ли товар
  const isProductLiked = (productId) => {
    return user?.likedProducts?.some((product) => product.id === productId);
  };

  // Обработчик для лайков
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
    return Array.isArray(user?.cart) && user.cart.some((item) => item.productID === productId);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="SearchPage page">
      <Header renderSearchForm={showSearchInHeader} />
      <div className="search-page">
        <div className="container">
          <div className="search-header">
            <button className="search_back-button back-button" onClick={() => navigate(-1)}>
              ← Back
            </button>
            <h2 className="search-title">Results of "{query}"</h2>
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
                onLike={handleLike}
                isProductLiked={isProductLiked}
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

export default SearchPage;
