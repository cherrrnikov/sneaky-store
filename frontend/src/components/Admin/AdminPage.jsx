import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../AuthContext";
import { useNavigate } from "react-router-dom";
import "../../styles/Admin/AdminPage.css";

const AdminPage = () => {
  const { user, isAuthenticated, logout, loading } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !user?.roles.includes("ADMIN")) {
      // Если пользователь не администратор, редиректим на страницу входа
      navigate("/admin-login");
    }
  }, [user, isAuthenticated, navigate]);

  const handleLogout = () => {
    logout(); // Используем logout из контекста для выхода
    navigate("/admin-login"); // Редирект на страницу входа после выхода
  };

  // Если данные еще загружаются
  if (loading) {
    return <div>Загрузка...</div>;
  }

  // Если ошибка при запросах или другом процессе
  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  // Если пользователь не авторизован
  if (!isAuthenticated) {
    navigate("/admin-login");
  }

  // Если пользователь не является администратором
  if (!user?.roles.includes("ADMIN")) {
    return <div>Доступ запрещен: Вы не являетесь администратором.</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header">
          <h2 className="admin-title">Добро пожаловать, {user.fullName}!</h2>
          <p className="admin-subtitle">Вы вошли в панель администратора</p>
        </div>

        <div className="admin-info">
          <p><strong>Имя:</strong> {user.fullName}</p>
          <p><strong>Никнейм:</strong> {user.username}</p>
          <p><strong>Почта:</strong> {user.email}</p>
        </div>

        <button className="logout-button" onClick={handleLogout}>Выйти</button>

        <h3 className="admin-section-title">Управление:</h3>
        <ul className="admin-menu">
          <li>
            <button className="admin-menu-btn" onClick={() => navigate("/admin/products")}>Товары</button>
          </li>
          <li>
            <button className="admin-menu-btn" onClick={() => navigate("/admin/users")}>Пользователи</button>
          </li>
          <li>
            <button className="admin-menu-btn" onClick={() => navigate("/admin/categories")}>Категории</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;
