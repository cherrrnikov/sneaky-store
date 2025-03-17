import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import AuthContext from "../../components/AuthContext"; // Если используете контекст для хранения данных о пользователе
import api from "../../services/api";

const AdminPage = () => {
  const { user } = useContext(AuthContext); // Получаем данные о пользователе из контекста
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <div>
      <h1>Админ-панель</h1>
      <div>
        <h2>Добро пожаловать, {user.fullName}!</h2>
        {/* Добавьте функциональность для страницы администратора */}
      </div>
    </div>
  );
};

export default AdminPage;
