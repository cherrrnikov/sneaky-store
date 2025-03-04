import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Header from "../HomePage/Header";
import Footer from "../HomePage/Footer";
import AuthContext from "../AuthContext";
import OrderCard from "../OrderPage/OrderCard";
import LoginModal from "../Login/LoginModal";
import "../../styles/OrderPage/OrderPage.css";

const OrderPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (user && isAuthenticated) {
        fetchOrders();
    }
  }, [user, isAuthenticated]);

    const fetchOrders = async () => {
        console.log("USER", user)
    try {
        const response = await api.get(`/orders/user/${user.id}`);
        setOrders(response.data);
    } catch (err) {
        setError("Failed to load orders");
    } finally {
        setLoading(false);
    }
    };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="OrderPage page">
      <Header renderSearchForm={true} />
      <div className="order-page">
        <div className="container">
          <div className="order-header">
            <button className="back-button" onClick={() => navigate(-1)}>
              ← Back
            </button>
            <h2 className="order-page_title">Your Orders</h2>
          </div>
            <div className="order-container">
                <div className="order-list">
                    {orders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            </div>
        </div>
      </div>
      <Footer />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </div>
  );
};

export default OrderPage;
