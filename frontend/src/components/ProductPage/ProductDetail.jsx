import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api"; // Настроенный API
import "../../styles/ProductPage/ProductDetail.css";
import ProductCard from "../ProductPage/ProductCard";  // Импортируем компонент карточки товара
import AuthContext from "../AuthContext"; // Импортируем контекст для проверки авторизации
import { Link } from "react-router-dom";
import LoginModal from "../Login/LoginModal";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, toggleLikeProduct, fetchLikedProducts, fetchCartProducts, toggleCartProduct } = useContext(AuthContext); // Используем контекст
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);  // Для хранения товаров из той же категории
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Функция для отслеживания лайков товара
  const isProductLiked = (productId) => {
    return user?.likedProducts?.some((p) => p.id === productId) || false;
  };
  

  // Логика для лайка товара
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

  // Загружаем данные о товаре и категориях
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const fetchProduct = async () => {
      try {
        console.log("Fetching product with ID:", id);
        const response = await api.get(`/products/${id}`);
        const fetchedProduct = response.data;
        setProduct(fetchedProduct);

        const categoriesResponse = await api.get("/categories");
        setCategories(categoriesResponse.data);

        setLoading(false);

        const lastCategory = fetchedProduct.categories?.slice(-1)[0];
        if (lastCategory) {
          const categoryResponse = await api.get(`/products/category/${lastCategory}`);
          const filteredProducts = categoryResponse.data.filter(
            (item) => item.id !== fetchedProduct.id
          );
          setCategoryProducts(filteredProducts);
        }
      } catch (error) {
        setError("Failed to fetch product details");
        setLoading(false);
      }
    };

    fetchProduct();
    fetchLikedProducts();
    fetchCartProducts();
  }, [id]);

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

  console.log("Product data:", product);

  return (
    <div className="product-detail-container">
      <div className="container">
        <button className="product-detail_back-button" onClick={() => navigate(-1)}>← Back</button>
        <div className="product-detail">
          <div className="product-image">
            <img src={product.photoURL} alt={product.name} />
          </div>

          <div className="product-info">
            <div className="product-breadcrumb">
              <Link to="/">Shop</Link>
              {product.categories.map((catName, index) => {
                const category = categories.find((c) => c.name === catName);
                return (
                  <span key={index}>
                    {" > "}
                    {category ? (
                      <Link to={`/category/${category.id}`}>{catName}</Link>
                    ) : (
                      <span>{catName}</span>
                    )}
                  </span>
                );
              })}
              {" > "}
              <Link to={`/brand/${product.manufacturer}`}>{product.manufacturer}</Link>
            </div>

            <h2>{product.name}</h2>

            <div className="product-size">
              <label htmlFor="size">Size:</label>
              <select id="size" name="size" className="focus:outline-none">
                <option value="S">Small</option>
                <option value="M">Medium</option>
                <option value="L">Large</option>
              </select>
            </div>

            <div className="product-color">
              <label htmlFor="color">Color:</label>
              <select id="color" name="color" className="focus:outline-none">
                <option value="Black">Black</option>
                <option value="Red">Red</option>
                <option value="White">White</option>
              </select>
            </div>
          </div>

          <div className="product-actions">
            <p className="price">${product.price}</p>

            <div className="actions">
              <button
                className={`like-button-detail like-button`}
                onClick={(e) => handleLike(e, product.id)}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill={isProductLiked(product.id) ? "black" : "none"}
                  xmlns="http://www.w3.org/2000/svg"
                  className="hover:fill-black"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 4.02253C9.88304 1.24159 6.34559 0.38216 3.69319 2.92866C1.04078 5.47516 0.667353 9.73278 2.75031 12.7446C4.48215 15.2485 9.7233 20.5299 11.4411 22.2393C11.6331 22.4305 11.7293 22.5261 11.8414 22.5637C11.9391 22.5964 12.0462 22.5964 12.1441 22.5637C12.2562 22.5261 12.3522 22.4305 12.5444 22.2393C14.2622 20.5299 19.5033 15.2485 21.2352 12.7446C23.3181 9.73278 22.9902 5.44837 20.2923 2.92866C17.5942 0.408948 14.1169 1.24159 12 4.02253Z"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button className="add-to-cart-button" onClick={(e) => handleProductCart(e, product.id)}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill={isProductInCart(product.id) ? "black" : "none"}
                  xmlns="http://www.w3.org/2000/svg"
                  className="hover:fill-black"
                >
                  <path
                    d="M3 3H5L6 7M6 7H21L20 13H7M6 7L7 13H20M16 18C16.5523 18 17 18.4477 17 19C17 19.5523 16.5523 20 16 20C15.4477 20 15 19.5523 15 19C15 18.4477 15.4477 18 16 18ZM10 18C10.5523 18 11 18.4477 11 19C11 19.5523 10.5523 20 10 20C9.44772 20 9 19.5523 9 19C9 18.4477 9.44772 18 10 18Z"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="category-products">
          <h3>Similar Products</h3>
          <div className="product-list">
            {categoryProducts.map((item) => (
              <ProductCard
                key={item.id}
                product={item}
                onLike={handleLike}
                isProductLiked={isProductLiked}
                onProductCart={handleProductCart}
                isProductInCart={isProductInCart}
              />
            ))}
          </div>
        </div>
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
};

export default ProductDetail;
