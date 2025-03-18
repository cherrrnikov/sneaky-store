import React, { useEffect, useState } from "react";
import api from "../../services/api"; // Подключаем сервис для работы с API

const AdminCategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedCategoryId, setEditedCategoryId] = useState(null); // Храним ID редактируемой категории
  const [formData, setFormData] = useState({}); // Данные для редактирования категории
  const [newCategoryFormVisible, setNewCategoryFormVisible] = useState(false); // Управление отображением формы для новой категории

  useEffect(() => {
    // Получаем все категории при монтировании компонента
    const fetchCategories = async () => {
      try {
        const response = await api.get("/admin/categories");
        if (response.status === 200) {
          setCategories(response.data);
        }
      } catch (err) {
        setError("Не удалось загрузить категории.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleEdit = (category) => {
    setEditedCategoryId(category.id);
    setFormData({ ...category });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSave = async (categoryId) => {
    try {
      const response = await api.put(`/admin/categories/${categoryId}`, formData);
      if (response.status === 200) {
        setCategories(categories.map((category) => (category.id === categoryId ? { ...category, ...formData } : category)));
        setEditedCategoryId(null);
      }
    } catch (err) {
      setError("Не удалось обновить категорию.");
    }
  };

  const handleCancel = () => {
    setEditedCategoryId(null);
    setFormData({});
  };

  const handleDelete = async (categoryId) => {
    try {
      const response = await api.delete(`/admin/categories/${categoryId}`);
      if (response.status === 204) {
        setCategories(categories.filter((category) => category.id !== categoryId));
      }
    } catch (err) {
      setError("Не удалось удалить категорию.");
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    const categoryData = {
      ...formData,
      productIDs: formData.productIDs ? formData.productIDs.split(",").map(id => parseInt(id.trim())) : [],
    };

    try {
      const response = await api.post("/admin/categories", categoryData);
      if (response.status === 201) {
        setCategories([...categories, response.data]); // Добавляем новую категорию в список
        setNewCategoryFormVisible(false); // Скрываем форму
        setFormData({}); // Очищаем форму
      }
    } catch (err) {
      setError("Не удалось создать категорию.");
    }
  };

  if (loading) {
    return <div>Загрузка категорий...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="admin-category-page">
      <h2>Список категорий</h2>

      {/* Кнопка для отображения формы создания категории */}
      <button onClick={() => setNewCategoryFormVisible(!newCategoryFormVisible)}>
        {newCategoryFormVisible ? "Отменить создание" : "Создать категорию"}
      </button>

      {/* Форма для создания новой категории */}
      {newCategoryFormVisible && (
        <form onSubmit={handleCreateCategory}>
          <div>
            <label>Название</label>
            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Описание</label>
            <input
              type="text"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Создать категорию</button>
        </form>
      )}

      <div>
        {categories.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Описание</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>
                    {editedCategoryId === category.id ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    ) : (
                      category.name
                    )}
                  </td>
                  <td>
                    {editedCategoryId === category.id ? (
                      <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                      />
                    ) : (
                      category.description
                    )}
                  </td>
                  <td>
                    {editedCategoryId === category.id ? (
                      <>
                        <button onClick={() => handleSave(category.id)}>Сохранить</button>
                        <button onClick={handleCancel}>Отмена</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(category)}>Редактировать</button>
                        <button onClick={() => handleDelete(category.id)}>Удалить</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Категории не найдены.</p>
        )}
      </div>
    </div>
  );
};

export default AdminCategoryPage;
