import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "../Login/LoginModal";
import AuthContext from "../AuthContext";
import "../../styles/HomePage/Header.css";
import SearchForm from "../SearchForm";
import CartModal from "../Cart/CartModal";
import UserMenuModal from "../UserMenuModal";

const Header = ({ renderSearchForm }) => {
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLikedClick = () => {
    if (isAuthenticated) {
        navigate("/liked")
    } else {
        setIsLoginModalOpen(true)
    }
  }

  const handleAuthRequired = () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true); // Открываем модальное окно, если пользователь не авторизован
    }
  };

  const closeModal = () => {
    setIsLoginModalOpen(false); // Закрываем модальное окно
  };

  const handleCartClick = () => {
    if (isAuthenticated) {
      setIsCartModalOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  }

  const handleUserMenuClick = () => {
    if (isAuthenticated) {
      setIsUserMenuOpen(true); // Открываем меню пользователя
    } else {
      setIsLoginModalOpen(true); // Открываем окно логина, если не авторизован
    }
  };

  const handleLogout = () => {
    logout();  // Логика выхода из системы
    setIsUserMenuOpen(false);  // Закрываем меню пользователя после выхода
  };

  return (
    <header id="header" className="w-full bg-white shadow-md px-4 py-3 md:py-4 md:px-4 flex justify-center">
      <div className="container">
        <div className="header-container">
          <Link to="/" state={{ section: "hero-section" }} className="text-3xl font-bold text-gray-800">SNEAKY</Link>
          <nav className="hidden md:block">
            <ul className="flex gap-x-6 text-sm text-gray-600">
              <li>
                <Link to="/" state={{ section: "product-list" }} className="hover:text-gray-800">Products</Link>
              </li>
              <li>
                <Link to="/" state={{ section: "categories" }} className="hover:text-gray-800">Categories</Link>
              </li>
              <li>
                <Link to="/" state={{ section: "brands" }} className="hover:text-gray-800">Brands</Link>
              </li>
            </ul>
          </nav>

          {renderSearchForm && <SearchForm />}

          <div className="flex gap-x-4 items-center">
            <button className="w-9 h-8 flex items-center justify-center" onClick={handleLikedClick}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="hover:fill-black">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 4.02253C9.88304 1.24159 6.34559 0.38216 3.69319 2.92866C1.04078 5.47516 0.667353 9.73278 2.75031 12.7446C4.48215 15.2485 9.7233 20.5299 11.4411 22.2393C11.6331 22.4305 11.7293 22.5261 11.8414 22.5637C11.9391 22.5964 12.0462 22.5964 12.1441 22.5637C12.2562 22.5261 12.3522 22.4305 12.5444 22.2393C14.2622 20.5299 19.5033 15.2485 21.2352 12.7446C23.3181 9.73278 22.9902 5.44837 20.2923 2.92866C17.5942 0.408948 14.1169 1.24159 12 4.02253Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <button className="w-9 h-8 flex items-center justify-center" onClick={handleCartClick}>
            <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="hover:fill-black"
                    >
                        <path
                        d="M3 3H5L6 7M6 7H21L20 13H7M6 7L7 13H20M16 18C16.5523 18 17 18.4477 17 19C17 19.5523 16.5523 20 16 20C15.4477 20 15 19.5523 15 19C15 18.4477 15.4477 18 16 18ZM10 18C10.5523 18 11 18.4477 11 19C11 19.5523 10.5523 20 10 20C9.44772 20 9 19.5523 9 19C9 18.4477 9.44772 18 10 18Z"
                        stroke="black"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        />
                    </svg>
            </button>

            {isAuthenticated ? (
              <button className="w-9 h-8 flex items-center justify-center" onClick={handleUserMenuClick}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="hover:fill-black">
                  <path d="M10 9V15M14 9V15M3 12H21M8 19H16C17.1046 19 18 18.1046 18 17V7C18 5.89543 17.1046 5 16 5H8C6.89543 5 6 5.89543 6 7V17C6 18.1046 6.89543 19 8 19Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ) : (
              <button className="w-9 h-8 flex items-center justify-center" onClick={handleAuthRequired}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="hover:fill-black">
                  <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 8.06087 15.5786 9.07828 14.8284 9.82843C14.0783 10.5786 13.0609 11 12 11C10.9391 11 9.92172 10.5786 9.17157 9.82843C8.42143 9.07828 8 8.06087 8 7C8 5.93913 8.42143 4.92172 9.17157 4.17157C9.92172 3.42143 10.9391 3 12 3C13.0609 3 14.0786 3.42143 14.8284 4.17157C15.5786 4.92172 16 5.93913 16 7Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={closeModal} />
      <CartModal isOpen={isCartModalOpen} onClose={() => setIsCartModalOpen(false)} />
      <UserMenuModal isOpen={isUserMenuOpen} onClose={() => setIsUserMenuOpen(false)} user={user} onLogout={handleLogout} />
    </header>
  );
};

export default Header;
