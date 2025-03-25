import React, { useState, useContext } from "react";
import ReactModal from "react-modal";
import "../../styles/LoginModal/LoginModal.css";
import AuthContext from "../AuthContext";
import Cookies from "js-cookie";
import api from "../../services/api";

ReactModal.setAppElement("#root");

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState(""); 
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const { setUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = isRegistering
      ? "/auth/register"
      : "/auth/login"; 

    const userData = isRegistering
      ? { fullName, username, email, password }
      : { email, password };

    try {
      const response = await api.post(endpoint, userData);

      if (response.data.accessToken && response.data.refreshToken) {
        Cookies.set("accessToken", response.data.accessToken, {
          expires: 1,
          secure: process.env.NODE_ENV === "production", 
          httpOnly: false,
          sameSite: "Lax",
        });

        Cookies.set("refreshToken", response.data.refreshToken, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          httpOnly: false, 
          sameSite: "Lax",
        });

        console.log("Cookies after login:", Cookies.get("accessToken"), Cookies.get("refreshToken"));

        setUser(response.data.user); 
        onClose();
      } else {
        throw new Error("Ошибка при получении токенов.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Ошибка при обработке запроса.");
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
