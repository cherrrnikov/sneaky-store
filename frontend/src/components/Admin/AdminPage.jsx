import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../AuthContext";
import { useNavigate } from "react-router-dom";

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
    return <div>Вы не авторизованы. Пожалуйста, войдите в систему.</div>;
  }

  // Если пользователь не является администратором
  if (!user?.roles.includes("ADMIN")) {
    return <div>Доступ запрещен: Вы не являетесь администратором.</div>;
  }

  return (
    <div className="admin-page">
      <div className="admin-menu">
        {/* Меню с данными администратора */}
        <h2>Добро пожаловать, {user.fullName}!</h2>
        <div className="admin-info">
          <p><strong>Имя:</strong> {user.fullName}</p>
          <p><strong>Никнейм:</strong> {user.username}</p>
          <p><strong>Почта:</strong> {user.email}</p>
        </div>

        {/* Кнопка для выхода */}
        <button onClick={handleLogout}>Выйти</button>

        {/* Меню для навигации */}
        <h3>Управление:</h3>
        <ul>
          <li>
            <button onClick={() => navigate("/admin/products")}>Товары</button>
          </li>
          <li>
            <button onClick={() => navigate("/admin/users")}>Пользователи</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminPage;
