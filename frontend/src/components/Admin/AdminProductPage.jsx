import React, { useEffect, useState } from "react";
import api from "../../services/api";  // Подключаем сервис для работы с API
import { useNavigate } from "react-router-dom";

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Получаем все товары при монтировании компонента
    const fetchProducts = async () => {
      try {
        const response = await api.get("/admin/products");
        if (response.status === 200) {
          setProducts(response.data);
        }
      } catch (err) {
        setError("Не удалось загрузить товары.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Загрузка товаров...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="admin-product-page">
      <h2>Список товаров</h2>
      <div>
        {products.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Название</th>
                <th>Описание</th>
                <th>Цена</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                    <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.manufacturer}</td>
                  <td>{product.price} ₽</td>
                  <td>
                    <button onClick={() => navigate(`/admin/products/${product.id}`)}>Редактировать</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Товары не найдены.</p>
        )}
      </div>
    </div>
  );
};

export default AdminProductPage;
