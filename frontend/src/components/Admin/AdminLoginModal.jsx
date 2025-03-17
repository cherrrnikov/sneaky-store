import React, { useState, useContext } from "react";
import ReactModal from "react-modal";
import "../../styles/LoginModal/LoginModal.css";
import AuthContext from "../AuthContext";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom"; // Используем useNavigate вместо useHistory

ReactModal.setAppElement("#root");

const AdminLoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate(); // Используем useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Конечная точка для логина
    const endpoint = "http://localhost:8080/api/auth/login";

    const userData = { email, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Ошибка при обработке запроса.");
      }

      const data = await response.json();

      // Изменённый блок для установки куки
      if (data.accessToken && data.refreshToken) {
        // Устанавливаем токены в cookies
        Cookies.set("accessToken", data.accessToken, {
          expires: 1, // Истекает через 1 день
          secure: false, // Не используем secure в режиме разработки
          httpOnly: false, // Можно читать с JS
          sameSite: "Lax", // Поддержка cross-origin запросов
        });

        Cookies.set("refreshToken", data.refreshToken, {
          expires: 7, // Истекает через 7 дней
          secure: false, // Не используем secure в режиме разработки
          httpOnly: false, // Можно читать с JS
          sameSite: "Lax", // Поддержка cross-origin запросов
        });

        console.log("Cookies after login:", Cookies.get("accessToken"), Cookies.get("refreshToken"));

        // Проверяем роль пользователя (если она есть в данных)
        if (data.user && data.user.roles.includes("ADMIN")) {
          setUser(data.user); // Сохраняем данные о пользователе
          navigate("/admin"); // Перенаправляем на AdminPage с помощью useNavigate
          onClose(); // Закрываем модалку
        } else {
          setError("У вас нет прав администратора.");
        }
      } else {
        throw new Error("Ошибка при получении токенов.");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Admin Login Modal"
      className="ReactModal__Content"
      overlayClassName="ReactModal__Overlay"
    >
      <h2>Вход как администратор</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            placeholder="Введите email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Пароль:</label>
          <input
            type="password"
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">Войти</button>
      </form>
      <button onClick={onClose} style={{ marginTop: "10px" }}>
        Закрыть
      </button>
    </ReactModal>
  );
};

export default AdminLoginModal;
