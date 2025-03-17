import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Загружаем товары при монтировании компонента
  useEffect(() => {
    api.get('/products')
      .then(response => {
        setProducts(response.data); // Загружаем товары из бэкенда
      })
      .catch(error => console.error('Error fetching products', error));
  }, []);

  // Функция для удаления товара
  const deleteProduct = (id) => {
    api.delete(`/products/${id}`)
      .then(() => {
        setProducts(products.filter(product => product.id !== id)); // Обновляем список товаров после удаления
      })
      .catch(error => console.error('Error deleting product', error));
  };

  // Функция для редактирования товара
  const editProduct = (product) => {
    setEditingProduct(product); // Устанавливаем товар для редактирования
    setIsEditing(true); // Открываем форму редактирования
  };

  // Функция для обновления товара
  const updateProduct = () => {
    api.put(`/products/${editingProduct.id}`, editingProduct)
      .then(response => {
        const updatedProducts = products.map(product =>
          product.id === editingProduct.id ? response.data : product
        );
        setProducts(updatedProducts); // Обновляем список товаров с новым товаром
        setIsEditing(false); // Закрываем форму редактирования
      })
      .catch(error => console.error('Error updating product', error));
  };

  // Функция для обработки изменения поля в форме редактирования
  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditingProduct(prevProduct => ({
      ...prevProduct,
      [name]: value
    }));
  };

  return (
    <div>
      <h1>Список товаров</h1>
      
      {isEditing ? (
        <div>
          <h2>Редактировать товар</h2>
          <input
            type="text"
            name="name"
            value={editingProduct.name}
            onChange={handleEditChange}
            placeholder="Название товара"
          />
          <input
            type="text"
            name="manufacturer"
            value={editingProduct.manufacturer}
            onChange={handleEditChange}
            placeholder="Производитель"
          />
          <input
            type="text"
            name="color"
            value={editingProduct.color}
            onChange={handleEditChange}
            placeholder="Цвет"
          />
          <input
            type="text"
            name="size"
            value={editingProduct.size}
            onChange={handleEditChange}
            placeholder="Размер"
          />
          <input
            type="number"
            name="price"
            value={editingProduct.price}
            onChange={handleEditChange}
            placeholder="Цена"
          />
          <button onClick={updateProduct}>Сохранить изменения</button>
          <button onClick={() => setIsEditing(false)}>Отмена</button>
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Название</th>
              <th>Производитель</th>
              <th>Цвет</th>
              <th>Размер</th>
              <th>Цена</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.manufacturer}</td>
                <td>{product.color}</td>
                <td>{product.size}</td>
                <td>{product.price}</td>
                <td>
                  <button onClick={() => editProduct(product)}>Редактировать</button>
                  <button onClick={() => deleteProduct(product.id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminProductPage;
