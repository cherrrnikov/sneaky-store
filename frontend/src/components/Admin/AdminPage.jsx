import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../components/AuthContext"; // Если используете контекст для хранения данных о пользователе
import UserMenuModal from "../UserMenuModal";

const AdminPage = () => {
  const { user, setUser } = useContext(AuthContext); // Получаем данные о пользователе из контекста
  const [loading, setLoading] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); // Состояние для модального окна
  const navigate = useNavigate();

  useEffect(() => {
    // Проверяем, есть ли данные о пользователе
    if (!user) {
      navigate("/admin-login"); // Перенаправляем на страницу входа, если пользователь не авторизован
      return;
    }

    // Проверяем, что пользователь имеет роль ADMIN
    if (!user.roles.includes("ADMIN")) {
      navigate("/"); // Если роль не ADMIN, перенаправляем на главную
      return;
    }

    setLoading(false); // Данные загружены, продолжаем работу
  }, [user, navigate]);

  // Функции для перехода по разделам
  const goToProducts = () => navigate("/admin/products");
  const goToBrands = () => navigate("/admin/brands");
  const goToCategories = () => navigate("/admin/categories");
  const goToUsers = () => navigate("/admin/users");

  // Функция для выхода
  const handleLogout = () => {
    // Очистка данных о пользователе
    setUser(null);
    navigate("/admin-login"); // Перенаправляем на страницу входа
  };

  // Открытие модального окна
  const openUserMenu = () => setIsUserMenuOpen(true);

  // Закрытие модального окна
  const closeUserMenu = () => setIsUserMenuOpen(false);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h1>Админ-панель</h1>
      <div>
        <h2>Добро пожаловать, {user.fullName}!</h2>
        <div>
          <button onClick={goToProducts}>Товары</button>
        </div>
        <div>
          <button onClick={goToBrands}>Бренды</button>
        </div>
        <div>
          <button onClick={goToCategories}>Категории</button>
        </div>
        <div>
          <button onClick={goToUsers}>Юзеры</button>
        </div>

        {/* Кнопка для открытия модального окна пользователя */}
        <div>
          <button onClick={openUserMenu}>Меню пользователя</button>
        </div>
      </div>

      {/* Модальное окно для отображения информации о пользователе и кнопка выхода */}
      <UserMenuModal 
        isOpen={isUserMenuOpen} 
        onClose={closeUserMenu} 
        user={user} 
        onLogout={handleLogout} 
      />
    </div>
  );
};

export default AdminPage;
