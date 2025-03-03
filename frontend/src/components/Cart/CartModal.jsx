import React, { useState, useContext, useEffect } from "react";
import ReactModal from "react-modal";
import CheckoutModal from "../CheckoutModal";
import AuthContext from "../AuthContext";
import api from "../../services/api";
import "../../styles/Cart/CartModal.css";

ReactModal.setAppElement("#root");

const CartModal = ({ isOpen, onClose }) => {
  const { user, setUser } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Загружаем информацию о товарах
  useEffect(() => {
    if (user?.cart && user.cart.length > 0) {
      setCart(user.cart);
      const productIDs = user.cart.map((item) => item.productID);
      api
        .get("/products", { ids: productIDs })
        .then((response) => setProducts(response.data))
        .catch(() => setError("Ошибка при загрузке информации о товарах"));
    } else {
      setCart([]);
    }
  }, [user]);

  const handleCheckoutClick = () => {
    setIsCheckoutOpen(true); // Открываем модальное окно оформления заказа
  };

  const getProductDetails = (productID) => {
    // Ищем продукт в локальном состоянии
    return products.find((product) => product.id === productID);
  };

  const handleAddItem = async (productID) => {
    try {
      // Отправляем запрос на сервер для добавления товара в корзину
      await api.post(`/cart/${user.id}`, { productID });

      // Локально обновляем количество товара в корзине
      setCart((prevCart) => {
        return prevCart.map((item) => {
          if (item.productID === productID) {
            return { ...item, quantity: item.quantity + 1 }; // Увеличиваем количество
          }
          return item;
        });
      });
    } catch (error) {
      setError("Ошибка при добавлении товара в корзину.");
    }
  };

  // Уменьшение количества товара
  const handleDecrementItem = async (cartItemId, quantity) => {
    try {
      if (quantity > 1) {
        await api.delete(`/cart/${user.id}/remove/${cartItemId}`);

        // Локально уменьшаем количество товара в корзине
        setCart((prevCart) => {
          return prevCart.map((item) => {
            if (item.id === cartItemId) {
              return { ...item, quantity: item.quantity - 1 }; // Уменьшаем количество
            }
            return item;
          });
        });
      } else {
        await api.delete(`/cart/${user.id}/remove/${cartItemId}/full`);

        // Локально удаляем товар из корзины
        setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId));
      }
    } catch (error) {
      setError("Ошибка при удалении товара из корзины.");
    }
  };

  // Полное удаление товара из корзины
  const handleDeleteItem = async (cartItemId) => {
    try {
      await api.delete(`/cart/${user.id}/remove/${cartItemId}/full`);

      // Локально удаляем товар из корзины
      setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId));
    } catch (error) {
      setError("Ошибка при полном удалении товара.");
    }
  };

  // Сохранение данных при выходе из корзины
  const handleSaveAndClose = async () => {
    try {
      // Отправляем обновленные данные о корзине на сервер (при закрытии)
        const { data: updatedCart } = await api.get(`/cart/${user.id}`, { withCredentials: true });
  
        // Обновляем состояние пользователя с актуальной корзиной
        setUser((prevUser) => ({
          ...prevUser,
          cart: updatedCart.cartItems, // Обновляем корзину
        }));

      onClose(); // Закрываем модальное окно
    } catch (error) {
      setError("Ошибка при сохранении корзины.");
    }
  };


  const handleCheckoutSubmit = async (orderData) => {
    try {
      console.log(orderData)
      // Отправляем данные на сервер для создания заказа
      const response = await api.post("/orders", orderData);
      console.log("Заказ создан:", response.data);

      // Очищаем корзину пользователя (если нужно)
      setCart([]);

      // Закрываем модальное окно оформления заказа
      setIsCheckoutOpen(false);
      onClose(); // Закрываем модальное окно корзины
    } catch (error) {
      setError("Ошибка при оформлении заказа.");
    }
  };

  return (
    <>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={handleSaveAndClose}
        contentLabel="Cart Modal"
        className="ReactModal__Content"
        overlayClassName="ReactModal__Overlay"
      >
        <h2 className="modal-title">Ваша корзина</h2>
        <div className="cart-items">
          {cart.length === 0 ? (
            <p className="empty-cart-message">Ваша корзина пуста.</p>
          ) : (
            cart.map((item) => {
              const product = getProductDetails(item.productID);
              return (
                <div key={item.id} className="cart-item">
                  <img
                    src={product?.photoURL || "/default-image.png"}
                    alt={product?.name || "Product"}
                    className="cart-item-image"
                  />
                  <div className="item-details">
                    <div className="item-name">{product?.name || item.productName}</div>
                    <div className="item-price">Цена: ${product?.price || "Не указана"}</div>
                    <div className="item-quantity">
                      <button
                        className="quantity-button decrement"
                        onClick={() => handleDecrementItem(item.id, item.quantity)}
                      >
                        -
                      </button>
                      {item.quantity}
                      <button
                        className="quantity-button increment"
                        onClick={() => handleAddItem(item.productID)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    Удалить
                  </button>
                </div>
              );
            })
          )}
        </div>
        {error && <p className="error-message">{error}</p>}
        <div className="checkout-actions">
          <button className="checkout-button" onClick={handleCheckoutClick}>
            Перейти к оформлению
          </button>
          <button className="close-button" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </ReactModal>

      {/* Новое модальное окно для оформления заказа */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onSubmit={handleCheckoutSubmit}
        products={products}  // Pass products here
        userID={user?.id} 
      />

    </>
  );
};

export default CartModal;