import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";
import api from "../services/api";

ReactModal.setAppElement("#root");

const CheckoutModal = ({ isOpen, onClose, cartItems, products, userID, setCart }) => {
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [error, setError] = useState("");
  
  // Функция для подсчета общей стоимости
  const calculateTotalPrice = () => {
    return cartItems.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productID);
      if (product) {
        return sum + product.price * item.quantity;
      }
      return sum;
    }, 0);
  };

  const handleSubmit = async () => {
    const totalPrice = calculateTotalPrice(); // Рекомендуется вычислять стоимость тут

    const orderData = {
      userID, // ID пользователя
      deliveryAddress, // Адрес доставки
      totalPrice,
      orderItems: cartItems.map((item) => {
        const product = products.find((p) => p.id === item.productID); // Найдем продукт в списке
        return {
          productID: item.productID,
          productName: product?.name || "Unmatched product",
          quantity: item.quantity,
          price: product?.price || 0,
        };
      }),
    };

    console.log("Order Data to submit:", orderData); // Добавим логирование для проверки

    try {
      const response = await api.post("/orders", orderData); // Отправка заказа на сервер
      const createdOrder = response.data; // Получаем созданный заказ
      console.log("Создан заказ: ", createdOrder);


      // Очищаем корзину после успешного оформления заказа
      setCart([]);
      onClose(); // Закрываем модальное окно оформления заказа
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
      <h2 className="modal-title">Оформление заказа</h2>
      <div className="checkout-items">
        {cartItems.map((item) => {
          const product = products.find((p) => p.id === item.productID);
          return (
            <div key={item.id} className="checkout-item">
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
            required
            type="text"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
          />
        </label>
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
    </ReactModal>
  );
};

export default CheckoutModal;
