import React, { useEffect, useState } from "react";
import api from "../../services/api"; 
import "../../styles/Admin/AdminCategoryPage.css";
import { useNavigate } from "react-router-dom";

const AdminCategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedCategoryId, setEditedCategoryId] = useState(null); 
  const [formData, setFormData] = useState({}); 
  const [newCategoryFormVisible, setNewCategoryFormVisible] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
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
        setCategories([...categories, response.data]); 
        setNewCategoryFormVisible(false); 
        setFormData({}); 
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

      <div className="container admin-category-container">
      <div className="admin-category-header">
        <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
        <h2>Список категорий</h2>
      </div>

      <button onClick={() => setNewCategoryFormVisible(!newCategoryFormVisible)}>
        {newCategoryFormVisible ? "Отменить создание" : "Создать категорию"}
      </button>

      {newCategoryFormVisible && (
        <form onSubmit={handleCreateCategory} className="admin-category-form">
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
    </div>
  );
};

export default AdminCategoryPage;
