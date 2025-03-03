import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

import "../../styles/HomePage/Categories.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load categories");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div id="categories" className="categories">
        <div className="container">
            <div className="categories-header">
                <h2 className="categories-title">Categories</h2>
            </div>
            <div className="categories-container">
                {categories.map((category) => (
                <Link
                to={`/category/${category.id}`} 
                key={category.id}
                className="category-card"
                style={{
                    backgroundColor: `rgb(${Math.floor(Math.random() * 256)}, 
                    ${Math.floor(Math.random() * 256)}, 
                    ${Math.floor(Math.random() * 256)})`,
                }}
                >
                <div className="category-card-title">{category.name}</div>
                </Link>
            ))}
            </div>
        </div>
    </div>
  );
};

export default Categories;
