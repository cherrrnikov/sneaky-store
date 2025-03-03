import React, { useState, useEffect } from "react";
import ReactModal from "react-modal";

ReactModal.setAppElement("#root");

const CheckoutModal = ({ isOpen, onClose, cartItems, onSubmit, products, userID }) => {
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);

  // Рассчитываем общую стоимость и привязываем продукты к корзине
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productID);
      if (product) {
        return sum + product.price * item.quantity;
      }
      return sum;
    }, 0);
    setTotalPrice(total);
  }, [cartItems, products]);

  const handleSubmit = () => {
    const orderData = {
      userID, // ID пользователя
      deliveryAddress, // Адрес доставки // Общая стоимость
      orderItems: cartItems.map((item) => {
        const product = products.find((p) => p.id === item.productID); // Найдем продукт в списке
        return {
          productID: item.productID, // ID товара
          quantity: item.quantity, // Количество
          price: product?.price || 0, // Цена за единицу, если есть
        };
      }),
    };
    onSubmit(orderData); // Передаем данные в родительский компонент
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
            type="text"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
          />
        </label>
        <div className="total-price">Общая стоимость: ${totalPrice}</div>
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
