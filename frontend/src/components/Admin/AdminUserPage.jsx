import React, { useEffect, useState } from "react";
import api from "../../services/api";  // Импортируем api для работы с запросами

const AdminUserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get("/admin/users");
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError("Не удалось загрузить пользователей");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const fetchOrders = async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}/orders`);
      setOrders((prevOrders) => ({
        ...prevOrders,
        [userId]: response.data,  // Сохраняем заказы для конкретного пользователя
      }));
    } catch (err) {
      setError("Не удалось загрузить заказы пользователя");
    }
  };

  const handleToggleOrders = (userId) => {
    // Если заказы уже загружены, просто их покажем
    if (orders[userId]) {
      setOrders((prevOrders) => ({
        ...prevOrders,
        [userId]: null,  // Отключаем отображение заказов
      }));
    } else {
      fetchOrders(userId);  // Если заказы не загружены, делаем запрос
    }
  };

  if (loading) {
    return <div>Загрузка пользователей...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Список пользователей</h2>
      <table>
        <thead>
          <tr>
            <th>Имя</th>
            <th>Никнейм</th>
            <th>Почта</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <React.Fragment key={user.id}>
              <tr>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => console.log("Просмотр пользователя", user.id)}>
                    Просмотр
                  </button>
                  <button onClick={() => console.log("Удалить пользователя", user.id)}>
                    Удалить
                  </button>
                  <button onClick={() => handleToggleOrders(user.id)}>
                    {orders[user.id] ? "Скрыть заказы" : "Показать заказы"}
                  </button>
                </td>
              </tr>

              {/* Отображение заказов для каждого пользователя */}
              {orders[user.id] && (
                <tr>
                  <td colSpan="4">
                    <h4>Заказы пользователя {user.name}</h4>
                    <table>
                      <thead>
                        <tr>
                          <th>Номер заказа</th>
                          <th>Дата заказа</th>
                          <th>Статус</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders[user.id].map((order) => (
                          <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                            <td>{order.status}</td>
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
  );
};

export default AdminUserPage;
