import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "../../styles/Admin/AdminProductPage.css";
import { useNavigate } from "react-router-dom";

const AdminProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedProductId, setEditedProductId] = useState(null);
  const [formData, setFormData] = useState({}); 
  const [newProductData, setNewProductData] = useState({});
  const [newProductFormVisible, setNewProductFormVisible] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
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

  const handleEdit = (product) => {
    setEditedProductId(product.id);
    setFormData({ ...product });
  };

  const handleChange = (e, isNewProduct = false) => {
    const { name, value } = e.target;
  
    if (isNewProduct) {
      setNewProductData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  
  

  const handleSave = async (productId) => {
    try {
      const response = await api.put(`/admin/products/${productId}`, formData);
      if (response.status === 200) {
        setProducts(products.map((product) => (product.id === productId ? { ...product, ...formData } : product)));
        setEditedProductId(null);
      }
    } catch (err) {
      setError("Не удалось обновить товар.");
    }
  };

  const handleCancel = () => {
    setEditedProductId(null);
    setFormData({});
  };

  const handleDelete = async (productId) => {
    try {
      const response = await api.delete(`/admin/products/${productId}`);
      if (response.status === 204) {
        setProducts(products.filter((product) => product.id !== productId));
      }
    } catch (err) {
      setError("Не удалось удалить товар.");
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();

    const categoriesArray = newProductData.categories ? newProductData.categories.split(",").map((cat) => cat.trim()) : [];

    const productData = {
      ...newProductData,
      categories: categoriesArray,
    };

    try {
      const response = await api.post("/admin/products", productData);
      if (response.status === 201) {
        setProducts([...products, response.data]);
        setNewProductFormVisible(false); 
        setNewProductData({}); 
      }
    } catch (err) {
      setError("Не удалось создать товар.");
    }
  };

  if (loading) {
    return <div>Загрузка товаров...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="admin-product-page">
      <div className="container admin-product-container">
        
    <div className="admin-product-header">
      <button className="back-button" onClick={() => navigate(-1)}>← Back</button>
      <h2>Список товаров</h2>
    </div>

      <button onClick={() => setNewProductFormVisible(!newProductFormVisible)}>
        {newProductFormVisible ? "Отменить создание" : "Создать товар"}
      </button>

      {newProductFormVisible && (
        <form onSubmit={handleCreateProduct} className="admin-product-form">
          <div>
            <label>Название</label>
            <input
              type="text"
              name="name"
              value={newProductData.name || ""}
              onChange={(e) => handleChange(e, true)}
              required
            />
          </div>
          <div>
            <label>Производитель</label>
            <input
              type="text"
              name="manufacturer"
              value={newProductData.manufacturer || ""}
              onChange={(e) => handleChange(e, true)}
              required
            />
          </div>
          <div>
            <label>Цвет</label>
            <input
              type="text"
              name="color"
              value={newProductData.color || ""}
              onChange={(e) => handleChange(e, true)}
              required
            />
          </div>
          <div>
            <label>Размер</label>
            <input
              type="text"
              name="size"
              value={newProductData.size || ""}
              onChange={(e) => handleChange(e, true)}
              required
            />
          </div>
          <div>
            <label>Цена</label>
            <input
              type="number"
              name="price"
              value={newProductData.price || ""}
              onChange={(e) => handleChange(e, true)}
              required
            />
          </div>
          <div>
            <label>Фото URL</label>
            <input
              type="text"
              name="photoURL"
              value={newProductData.photoURL || ""}
              onChange={(e) => handleChange(e, true)}
            />
          </div>
          <div>
            <label>Категории (через запятую)</label>
            <input
              type="text"
              name="categories"
              value={newProductData.categories || ""}
              onChange={(e) => handleChange(e, true)}
            />
          </div>
          <button type="submit">Создать товар</button>
        </form>
      )}

      <div>
        {products.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Manufacturer</th>
                <th>Color</th>
                <th>Size</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>
                    {editedProductId === product.id ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    ) : (
                      product.name
                    )}
                  </td>
                  <td>
                    {editedProductId === product.id ? (
                      <input
                        type="text"
                        name="manufacturer"
                        value={formData.manufacturer}
                        onChange={handleChange}
                      />
                    ) : (
                      product.manufacturer
                    )}
                  </td>
                  <td>
                    {editedProductId === product.id ? (
                      <input
                        type="text"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                      />
                    ) : (
                      product.color
                    )}
                  </td>
                  <td>
                    {editedProductId === product.id ? (
                      <input
                        type="text"
                        name="size"
                        value={formData.size}
                        onChange={handleChange}
                      />
                    ) : (
                      product.size
                    )}
                  </td>
                  <td>
                    {editedProductId === product.id ? (
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                      />
                    ) : (
                      product.price
                    )}
                  </td>
                  <td>
                    {editedProductId === product.id ? (
                      <>
                        <button onClick={() => handleSave(product.id)}>Сохранить</button>
                        <button onClick={handleCancel}>Отмена</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(product)}>Редактировать</button>
                        <button onClick={() => handleDelete(product.id)}>Удалить</button>
                      </>
                    )}
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
    </div>
  );
};

export default AdminProductPage;
