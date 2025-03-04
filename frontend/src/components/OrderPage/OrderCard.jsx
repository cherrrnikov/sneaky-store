import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/OrderPage/OrderCard.css"; // Подключаем стили для карточки заказа

const OrderCard = ({ order }) => {
  const [showDetails, setShowDetails] = useState(false);
  return (
    <div className="order-card">
      <div className="order-card-header">
        <h3>Order #{order.id}</h3>
        <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
      </div>
      <div className="order-total">
        <p>Total: ${order.totalPrice}</p>
      </div>
      <button className="toggle-details" onClick={() => setShowDetails(!showDetails)}>
        {showDetails ? "Hide Details" : "Show Details"}
      </button>
      {showDetails && (
        <div className="order-items">
          {order.orderItems.map((item) => (
            <div key={item.productID} className="order-item">
              <Link to={`/product/${item.productID}`} className="product-card-link">
                {item.productName}
              </Link>
              <p>Quantity: {item.quantity}</p>
              <p>Price:${item.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderCard;
