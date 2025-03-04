import React, {useEffect, useRef} from "react";
import { Link } from "react-router-dom";
import "../styles/UserMenuModal/UserMenuModal.css";

const UserMenuModal = ({ isOpen, onClose, user, onLogout }) => {
    const modalRef = useRef(null);  // Ссылка на модальное окно

  // Добавляем обработчик клика по документу
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();  // Закрываем модальное окно, если клик был вне его
      }
    };

    // Добавляем событие на весь документ
    document.addEventListener("mousedown", handleClickOutside);

    // Убираем обработчик при размонтировании компонента
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="user-menu-modal">
      <div className="user-menu-modal-content" ref={modalRef}>
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="user-info">
          <h3>{user.username}</h3>
          <p>{user.email}</p>
        </div>
        <div className="menu-links">
          <Link to="/orders" className="menu-link" onClick={onClose}>
            Orders
          </Link>
        </div>
        <div className="logout-button">
          <button onClick={onLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
};

export default UserMenuModal;
