import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import "../../styles/HomePage/Brands.css";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await api.get("/products/brands");
        setBrands(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load brands");
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div id="brands" className="brands mb-5">
      <div className="container">
        <div className="brands-header">
          <h2 className="brands-title">Brands</h2>
        </div>
        <div className="brands-container">
          {brands.map((brand, index) => (
            <Link to={`/brand/${brand}`} key={index} className="brand-card"
                style={{
                    backgroundColor: `rgb(${Math.floor(Math.random() * 256)}, 
                    ${Math.floor(Math.random() * 256)}, 
                    ${Math.floor(Math.random() * 256)})`,
                }}
            >
                <div className="brand-card-title">{brand}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Brands;
