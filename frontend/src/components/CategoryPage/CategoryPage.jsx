// CategoryPage.js
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/CategoryPage/CategoryPage.css";
import Header from "../HomePage/Header";
import Footer from "../HomePage/Footer";
import SearchForm from "../SearchForm";
import AuthContext from "../AuthContext";  // Импортируем контекст
import ProductCard from "../ProductPage/ProductCard"; 
import LoginModal from "../Login/LoginModal";

const CategoryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSearchInHeader, setShowSearchInHeader] = useState(true);
  const { user, toggleLikeProduct, isAuthenticated, fetchLikedProducts, fetchCartProducts, toggleCartProduct } = useContext(AuthContext); // Получаем из контекста
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const response = await api.get(`/categories/${id}`);
        setCategoryName(response.data.name);

        const productIds = response.data.productIDs;
        const productResponses = await Promise.all(
          productIds.map((productId) => api.get(`/products/${productId}`))
        );

        setProducts(productResponses.map((res) => res.data));
        setLoading(false);
      } catch (err) {
        setError("Failed to load category products");
        setLoading(false);
      }
    };

    fetchCategoryProducts();
    fetchLikedProducts();
    fetchCartProducts();
  }, [id]);

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
    return Array.isArray(user?.cart) && user.cart.some((item) => item.productId === productId);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="CategoryPage page">
      <Header renderSearchForm={showSearchInHeader} />
      <div className="category-page">
        <div className="container">
          <div className="category-header">
            <button className="back-button" onClick={() => navigate(-1)}>
              ← Back
            </button>
            <h2 className="category-page_title">{categoryName}</h2>
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

export default CategoryPage;
