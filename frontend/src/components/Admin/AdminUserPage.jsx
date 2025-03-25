import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/Admin/AdminUserPage.css";
import { useNavigate } from "react-router-dom";

const orderStatuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
const availableRoles = ["ADMIN"]; 

const AdminUserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/admin/users");
      setUsers(response.data);
    } catch (err) {
      setError("Не удалось загрузить пользователей");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}/orders`);
      setOrders((prevOrders) => ({
        ...prevOrders,
        [userId]: response.data,
      }));
    } catch (err) {
      setError("Не удалось загрузить заказы пользователя");
    }
  };

  const handleToggleOrders = (userId) => {
    if (orders[userId]) {
      setOrders((prevOrders) => ({
        ...prevOrders,
        [userId]: null,
      }));
    } else {
      fetchOrders(userId);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/admin/orders/${orderId}/status?status=${newStatus}`);
      setOrders((prevOrders) => {
        const updatedOrders = { ...prevOrders };
        for (const userId in updatedOrders) {
          updatedOrders[userId] = updatedOrders[userId].map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          );
        }
        return updatedOrders;
      });
    } catch (err) {
      setError("Ошибка при обновлении статуса заказа");
    }
  };

  const handleAddRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role?role=${newRole}`);
  
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, roles: [...user.roles, newRole] } : user
        )
      );
    } catch (err) {
      setError("Ошибка при добавлении роли");
    }
  };
  

  const handleRemoveRole = async (userId, roleToRemove) => {
    try {
      await api.put(`/admin/users/${userId}/role?role=${roleToRemove}`);
  
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? { ...user, roles: user.roles.filter((role) => role !== roleToRemove) }
            : user
        )
      );
    } catch (err) {
      setError("Ошибка при удалении роли");
    }
  };
  
    const handleDeleteUser = async (userId) => {
        console.log("USERID", userId)
    try {
        await api.delete(`/admin/users/${userId}`);
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
    } catch (err) {
        setError("Ошибка при удалении пользователя");
    }
    };

  if (loading) {
    return <div>Загрузка пользователей...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="admin-user-page">
      <div className="container admin-user-container">
      <div className="admin-header">
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
        <h2>Список пользователей</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Никнейм</th>
            <th>Почта</th>
            <th>Роли</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <React.Fragment key={user.id}>
              <tr>
                <td>{user.id}</td>
                <td>{user.fullName}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  {user.roles
                    .sort((a, b) => {
                      if (a === "USER") return -1;
                      if (b === "USER") return 1;
                      return 0;
                    })
                    .map((role) => (
                      <span key={role} style={{ marginRight: "10px" }}>
                        {role}{" "}
                        {role !== "USER" && (
                          <button onClick={() => handleRemoveRole(user.id, role)}>❌</button>
                        )}
                      </span>
                    ))}
                  <select
                    onChange={(e) => {
                      handleAddRole(user.id, e.target.value);
                      e.target.value = ""; 
                    }}
                  >
                    <option value="">Добавить роль</option>
                    {availableRoles
                      .filter((role) => !user.roles.includes(role))
                      .map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                  </select>
                </td>

                <td className="user-actions">
                  <button onClick={() => handleToggleOrders(user.id)}>
                    {orders[user.id] ? "Скрыть" : "Заказы"}
                  </button>
                  <button onClick={() => handleDeleteUser(user.id)}>
                    Удалить
                  </button>
                </td>
              </tr>

              {orders[user.id] && (
                <tr>
                  <td colSpan="5">
                    <h4>Заказы пользователя {user.fullName}</h4>
                    <table>
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Дата заказа</th>
                          <th>Статус</th>
                          <th>Адрес доставки</th>
                          <th>Общая стоимость</th>
                          <th>Товары</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders[user.id].map((order) => (
                          <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                            <td>
                              <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              >
                                {orderStatuses.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>{order.deliveryAddress}</td>
                            <td>{order.totalPrice}</td>
                            <td>
                              <ul>
                                {order.orderItems.map((item, index) => (
                                  <li key={index}>
                                    {item.productName} - {item.quantity} шт. ({item.price} each)
                                  </li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
  
};

export default AdminUserPage;
