// ProductList.js
import React, { useState, useEffect, useContext } from "react";
import "../../styles/HomePage/ProductList.css";
import api from "../../services/api";
import LoginModal from "../Login/LoginModal";
import AuthContext from "../AuthContext";
import ProductCard from "../ProductPage/ProductCard";

const ProductList = () => {
  const { user, isAuthenticated, toggleLikeProduct, fetchLikedProducts, fetchCartProducts, toggleCartProduct } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get("/products");
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchLikedProducts(user.id);
      fetchCartProducts(user.id);
      
      console.log("User cart:", user?.cart)
    }
  }, [user?.id])

  const handleLike = (e, productId) => {
    e.stopPropagation();
    e.preventDefault();

    if (isAuthenticated) {
      toggleLikeProduct(productId);
    } else {
      setIsLoginModalOpen(true);
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

  const isProductLiked = (productId) => {
    return user?.likedProducts?.some((p) => p.id === productId);
  };

  const isProductInCart = (productId) => {
    return Array.isArray(user?.cart) && user.cart.some((item) => item.productID === productId);
  };
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div id="product-list" className="container">
      <h2 className="product-list_title">All Products</h2>
      <div className="product-list">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onLike={handleLike}
            isProductLiked={isProductLiked}
            onProductCart={handleProductCart}
            isProductInCart={isProductInCart}
          />
        ))}
      </div>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
};

export default ProductList;
