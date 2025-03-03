import React, { useState, useContext } from "react";
import ReactModal from "react-modal";
import "../../styles/LoginModal/LoginModal.css";
import AuthContext from "../AuthContext";
import Cookies from "js-cookie";

ReactModal.setAppElement("#root");

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState(""); // Добавляем fullName
  const [username, setUsername] = useState(""); // Добавляем username
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const { setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = isRegistering
      ? "http://localhost:8080/api/auth/register"
      : "http://localhost:8080/api/auth/login";

    const userData = isRegistering
      ? { fullName, username, email, password } // Добавляем данные для регистрации
      : { email, password };

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

// Измененный блок установки куки после логина
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

    setUser(data.user); // Сохраняем данные о пользователе
    onClose(); // Закрываем модалку
  }
  else {
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
      contentLabel="Login/Register Modal"
      className="ReactModal__Content"
      overlayClassName="ReactModal__Overlay"
    >
      <h2>{isRegistering ? "Регистрация" : "Вход"}</h2>
      <form onSubmit={handleSubmit}>
        {isRegistering && (
          <>
            <div>
              <label>Полное имя:</label>
              <input
                type="text"
                placeholder="Введите полное имя"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required={isRegistering}
              />
            </div>
            <div>
              <label>Имя пользователя:</label>
              <input
                type="text"
                placeholder="Введите имя пользователя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={isRegistering}
              />
            </div>
          </>
        )}
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
        <button type="submit">{isRegistering ? "Зарегистрироваться" : "Войти"}</button>
      </form>
      <button onClick={() => setIsRegistering(!isRegistering)} style={{ marginTop: "10px" }}>
        {isRegistering ? "Уже есть аккаунт? Войти" : "Нет аккаунта? Зарегистрироваться"}
      </button>
      <button onClick={onClose} style={{ marginTop: "10px" }}>
        Закрыть
      </button>
    </ReactModal>
  );
};

export default LoginModal;
