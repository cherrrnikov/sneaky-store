import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";
import api from "../../services/api"; // Подключаем наш axios сервис

const AdminLoginPage = () => {
  const { adminLogin } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password }); // Используем axios для POST запроса

      if (response.data.user.roles.includes("ADMIN")) {
        adminLogin(response.data);  
        navigate("/admin")
      } else {
        throw new Error("Вы не админ!");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Админ-панель: Вход</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Пароль:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Войти</button>
      </form>
    </div>
  );
};

export default AdminLoginPage;
