import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import ProductPage from './components/ProductPage/ProductPage';
import CategoryPage from './components/CategoryPage/CategoryPage';
import BrandPage from './components/BrandPage/BrandPage';
import SearchPage from './components/SearchPage/SearchPage';
import { AuthProvider } from './components/AuthContext';
import LikedPage from './components/LikedPage/LikedPage';
import OrderPage from './components/OrderPage/OrderPage';

const App = () => {
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
          </Routes>
        </Router>
    </AuthProvider>
  );
};

export default App;
