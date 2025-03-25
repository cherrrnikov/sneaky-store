import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import api from "../services/api";

ReactModal.setAppElement("#root");

const CheckoutModal = ({ isOpen, onClose, cartItems, products, userID, setCart, onSuccess }) => {
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [error, setError] = useState("");

  const calculateTotalPrice = () => {
    return cartItems.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productID);
      if (product) {
        return sum + product.price * item.quantity;
      }
      return sum;
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();  

    if (!deliveryAddress.trim()) {
      setError("Адрес доставки не может быть пустым!");
      return; // Не продолжаем отправку формы
    }

    const totalPrice = calculateTotalPrice(); 

    const orderData = {
      userID, 
      deliveryAddress, 
      totalPrice,
      orderItems: cartItems.map((item) => {
        const product = products.find((p) => p.id === item.productID); 
        return {
          productID: item.productID,
          photoURL: product?.photoURL,
          productName: product?.name || "Unmatched product",
          quantity: item.quantity,
          price: product?.price || 0,
        };
      }),
    };

    console.log("Order Data to submit:", orderData);

    try {
      const response = await api.post("/orders", orderData);
      const createdOrder = response.data; 
      console.log("Создан заказ: ", createdOrder);

      setCart([]);
      onClose();
      onSuccess();
    } catch (error) {
      setError("Ошибка при оформлении заказа.");
      console.error("Ошибка оформления заказа:", error);
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Checkout Modal"
      className="ReactModal__Content"
      overlayClassName="ReactModal__Overlay"
    >
      <form action="POST">
      <h2 className="modal-title">Оформление заказа</h2>
      <div className="checkout-items">
        {cartItems.map((item) => {
          const product = products.find((p) => p.id === item.productID);
          return (
            <div key={item.id} className="checkout-item">
                            <img
                src={product?.photoURL || "/default-image.png"}
                alt={product?.name || "Product"}
                className="cart-item-image"
              />
              <div className="item-name">{product?.name || "Товар"}</div>
              <div className="item-quantity">Количество: {item.quantity}</div>
              <div className="item-price">
                Цена: ${product?.price * item.quantity || 0}
              </div>
            </div>
          );
        })}
      </div>
      <div className="checkout-form">
        <label>
          Адрес доставки:
          <input
            type="text"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            required
          />
        </label>
        {error && <p className="error-message" style={{ color: "red" }}>{error}</p>}
        <div className="total-price">Общая стоимость: ${calculateTotalPrice()}</div>
      </div>
      <div className="checkout-actions">
        <button className="submit-button" onClick={handleSubmit}>
          Оформить
        </button>
        <button className="close-button" onClick={onClose}>
          Закрыть
        </button>
      </div>
      </form>
    </ReactModal>
  );
};

export default CheckoutModal;
