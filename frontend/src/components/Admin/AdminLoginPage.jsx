import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../AuthContext";
import api from "../../services/api"; 
import "../../styles/Admin/AdminLoginPage.css";
import Cookies from "js-cookie";

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
      const response = await api.post("/auth/login", { email, password });
      if (response.data.user.roles.includes("ADMIN")) {
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

          adminLogin(response.data);

          navigate("/admin");
        } else {
          throw new Error("Ошибка при получении токенов.");
        }
      } else {
        throw new Error("Вы не админ!");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Admin-panel</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-submit-btn">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
