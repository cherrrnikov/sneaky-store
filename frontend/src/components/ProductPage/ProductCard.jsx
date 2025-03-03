// ProductCard.js
import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, onLike, isProductLiked, onProductCart, isProductInCart }) => {
  return (
    <Link to={`/product/${product.id}`} key={product.id} className="product-card-link">
      <div className="product-card">
        <img src={product.photoURL} alt={product.name} className="product-image" />
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">${product.price}</p>
        <p className="product-category">{product.categories.join(", ")}</p>
        <div className="product-actions">
          <button className="like-button" onClick={(e) => onLike(e, product.id)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill={isProductLiked(product.id) ? "black" : "none"}>
              <path d="M12 4.02253C9.88 1.24 6.34 0.38 3.69 2.93C1.04 5.47 0.67 9.73 2.75 12.74C4.48 15.25 9.72 20.53 11.44 22.24C11.63 22.43 11.73 22.53 11.84 22.56C11.94 22.6 12.05 22.6 12.14 22.56C12.25 22.53 12.35 22.43 12.54 22.24C14.26 20.53 19.5 15.25 21.23 12.74C23.32 9.73 22.99 5.45 20.29 2.93C17.59 0.41 14.12 1.24 12 4.02Z" stroke="black" strokeWidth="2"/>
            </svg>
          </button>
          <button className="cart-button" onClick={(e) => onProductCart(e, product.id)}>
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
    </Link>
  );
};

export default ProductCard;
