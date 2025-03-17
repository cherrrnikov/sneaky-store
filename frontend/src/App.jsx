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
import AdminLoginModal from './components/Admin/AdminLoginModal';
import AdminPage from './components/Admin/AdminPage';

const App = () => {
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // Компонент для работы с маршрутом и открытия модалки
  const AdminLoginRoute = () => {
    const location = useLocation(); // Здесь useLocation теперь внутри компонента

    useEffect(() => {
      if (location.pathname === "/admin-login") {
        setIsAdminLoginModalOpen(true); // Открываем модалку, когда путь /admin-login
      }
    }, [location]);

    return null; // Возвращаем null, так как этот компонент ничего не рендерит
  };

  const closeAdminLoginModal = () => setIsAdminLoginModalOpen(false);
  return (
    <AuthProvider>
        <Router>
        <AdminLoginRoute />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/brand/:brand" element={<BrandPage />} />
            <Route path="/search/:query" element={<SearchPage/>} />
            <Route path="/liked" element={<LikedPage />} />
            <Route path="/orders" element={<OrderPage />} />
            <Route
              path="/admin-login"
              element={
                <AdminLoginModal 
                  isOpen={isAdminLoginModalOpen} 
                  onClose={closeAdminLoginModal} 
                />
              }
            />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </Router>
    </AuthProvider>
  );
};

export default App;
