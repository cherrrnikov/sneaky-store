import React, {useState, useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import ProductPage from './components/ProductPage/ProductPage';
import CategoryPage from './components/CategoryPage/CategoryPage';
import BrandPage from './components/BrandPage/BrandPage';
import SearchPage from './components/SearchPage/SearchPage';
import { AuthProvider } from './components/AuthContext';
import LikedPage from './components/LikedPage/LikedPage';
import OrderPage from './components/OrderPage/OrderPage';
import AdminLoginPage from './components/Admin/AdminLoginPage';
import AdminPage from './components/Admin/AdminPage';
import AdminProductPage from './components/Admin/AdminProductPage';
import AdminUserPage from './components/Admin/AdminUserPage';
import AdminCategoryPage from './components/Admin/AdminCategoryPage';

const App = () => {
  console.log("API DOCKER: ", import.meta.env.VITE_API_URL_DOCKER)
  console.log("API LOCAL: ", import.meta.env.VITE_API_URL_LOCAL)

  return (
    <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/brand/:brand" element={<BrandPage />} />
            <Route path="/search/:query" element={<SearchPage/>} />
            <Route path="/liked" element={<LikedPage />} />
            <Route path="/orders" element={<OrderPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/products" element={<AdminProductPage />} />
            <Route path="/admin/users" element={<AdminUserPage />} />
            <Route path="/admin/categories" element={<AdminCategoryPage />} />
          </Routes>
        </Router>
    </AuthProvider>
  );
};

export default App;
