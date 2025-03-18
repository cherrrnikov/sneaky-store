import React, { useEffect, useState } from "react";
import api from "../../services/api";  // Импортируем api для работы с запросами

const AdminUserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                <button onClick={() => console.log("Просмотр пользователя", user.id)}>Просмотр</button>
                <button onClick={() => console.log("Удалить пользователя", user.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserPage;
