import React, { createContext, useState, useEffect } from "react";
import api from "../services/api"; 
import Cookies from "js-cookie";

const AuthContext = createContext({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  login: () => {},
  adminLogin: () => {},
  logout: () => {},
  fetchLikedProducts: () => {},
  toggleLikeProduct: () => {},
  fetchCartProducts: () => {},
  toggleCartProduct: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [checkedTokens, setCheckedTokens] = useState(false); // Флаг для проверки токенов

  useEffect(() => {
    if (!checkedTokens) { // Проверка выполняется только один раз
      setCheckedTokens(true);
      console.log("Checking cookies after login...");
      const accessToken = Cookies.get("accessToken");
      const refreshToken = Cookies.get("refreshToken");

      console.log("Access Token from cookies:", accessToken);
      console.log("Refresh Token from cookies:", refreshToken);

      if (accessToken) {
        console.log("Access token found, checking validity...");
        api
          .get("/auth", { withCredentials: true })
          .then((res) => {
            console.log("Response from /auth:", res.data);
            if (res.data && res.data.user) {
              setUser(res.data.user); // Устанавливаем пользователя
              fetchLikedProducts(res.data.user.id); 
              fetchCartProducts(res.data.user.id);
            } else {
              console.log("User data is missing in the response");
              logout(); 
            }
          })
          .catch((error) => {
            console.error("Error verifying token:", error);
            logout();
          })
          .finally(() => {
            setLoading(false);
          });
      } else if (refreshToken) {
        console.log("No access token, but found refresh token...");
        refreshAccessToken(refreshToken);
      } else {
        console.log("No tokens found in cookies.");
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [checkedTokens]); // Зависимость от user, т.е. проверка будет происходить только после того, как user появится

  const refreshAccessToken = (refreshToken) => {
    console.log("Trying to refresh access token...");
    api
      .post("/auth/refresh", { refreshToken }, { withCredentials: true })
      .then((res) => {
        console.log("New tokens received:", res.data);
        Cookies.set("accessToken", res.data.accessToken, {
          expires: 1,
          secure: process.env.NODE_ENV === "production", // Secure только в продакшене
          httpOnly: false,
          sameSite: 'Lax',
        });
        Cookies.set("refreshToken", res.data.refreshToken, {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          httpOnly: false,
          sameSite: 'Lax',
        });

        setUser(res.data.user);
        fetchLikedProducts(res.data.user.id);
        fetchCartProducts(res.data.user.id);
      })
      .catch((error) => {
        console.error("Error refreshing tokens:", error);
        logout();
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchLikedProducts = async (userId = user?.id) => {
    console.log("Fetching liked products for userId:", userId);
    if (!userId) return;

    try {
      const { data } = await api.get(`/users/${userId}/liked`, {
        withCredentials: true,
      });
      console.log("Liked products:", data);
      setUser((prevUser) => ({
        ...prevUser,
        likedProducts: Array.isArray(data) ? data : [],
      }));
    } catch (error) {
      if (error.response?.status === 401) {
        logout(); // Если токен истек или неверный
      }
      console.error("Error loading liked products", error);
    }
  };

  const fetchCartProducts = async (userId = user?.id) => {
    console.log("Fetching cart products for userId:", userId)
    if (!userId) return;
  
    try {
      const { data } = await api.get(`/cart/${userId}`, { withCredentials: true });
      setUser((prevUser) => ({
        ...prevUser,
        cart: Array.isArray(data.cartItems) ? data.cartItems : [],  // Проверка типа
      }));
      console.log("Cart:", data.cartItems)
    } catch (error) {
      if (error.response?.status === 401) {
        logout(); // Если токен истек или неверный
      }
      console.error("Error loading cart products", error);
    }
  }
  

  const toggleLikeProduct = async (productId) => {
    console.log("Toggling like for productId:", productId);
    if (!user) return;

    try {
      const userId = user.id;
      const isLiked = user.likedProducts?.some((p) => p.id === productId);

      if (isLiked) {
        await api.delete(`/users/${userId}/like/${productId}`, {
          withCredentials: true,
        });
        setUser((prevUser) => ({
          ...prevUser,
          likedProducts: prevUser.likedProducts.filter((p) => p.id !== productId),
        }));
      } else {
        await api.put(`/users/${userId}/like/${productId}`, {}, {
          withCredentials: true,
        });
        const { data: likedProduct } = await api.get(`/products/${productId}`, {
          withCredentials: true,
        });
        setUser((prevUser) => ({
          ...prevUser,
          likedProducts: [...prevUser.likedProducts, likedProduct],
        }));
      }
    } catch (error) {
      if (error.response?.status === 401) {
        logout(); // Если токен истек или неверный
      }
      console.error("Error toggling like", error);
    }
  };

  const toggleCartProduct = async (productID) => {
    if (!user) return;
  
    try {
      const userId = user.id;
      const cartItem = user.cart?.find((item) => item.productID === productID);
  
      // Если товара нет в корзине, добавляем его
      if (!cartItem) {
        // Отправляем запрос на добавление товара в корзину
        const response = await api.post(`/cart/${userId}`, { productID }, { withCredentials: true });
  
        // Получаем актуальное состояние корзины с новым товаром
        const { data: updatedCart } = await api.get(`/cart/${userId}`, { withCredentials: true });
  
        // Обновляем состояние пользователя с актуальной корзиной
        setUser((prevUser) => ({
          ...prevUser,
          cart: updatedCart.cartItems, // Обновляем корзину
        }));

        console.log("USER CART", updatedCart.cartItems)
      } else {
        // Если товар уже в корзине, удаляем его
        if (cartItem.id) {
          // Отправляем запрос на удаление товара из корзины
          await api.delete(`/cart/${userId}/remove/${cartItem.id}`, { withCredentials: true });
  
          // Получаем актуальное состояние корзины после удаления товара
          const { data: updatedCart } = await api.get(`/cart/${userId}`, { withCredentials: true });
  
          // Обновляем локальное состояние корзины
          setUser((prevUser) => ({
            ...prevUser,
            cart: updatedCart.cartItems, // Обновляем корзину
          }));

          console.log("USER CART", updatedCart.cartItems)
        } else {
          console.error("Cart item ID is missing, cannot delete.");
        }
      }
    } catch (error) {
      if (error.response?.status === 401) {
        logout(); // Если токен истек или неверный
      }
      console.error("Error toggling cart product", error);
    }
  };

  const login = async (userData) => {
    console.log("Logging in with data:", userData);

    Cookies.set("accessToken", userData.accessToken, {
      expires: 1,
      secure: process.env.NODE_ENV === "production", 
      httpOnly: false,
      sameSite: 'Lax',
    });
    Cookies.set("refreshToken", userData.refreshToken, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      httpOnly: false,
      sameSite: 'Lax',
    });

    console.log("Cookies set:", Cookies.get("accessToken"), Cookies.get("refreshToken"));

    setUser(userData.user); 
    await Promise.all([
      fetchLikedProducts(userData.user.id),
      fetchCartProducts(userData.user.id),
    ]);
  };

  const adminLogin = async (userData) => {
    console.log("Admin logging in with data:", userData);

    if (!userData.user.roles.includes("ADMIN")) {
      console.error("Access denied. User is not an admin.");
      logout();
      return;
    }

    Cookies.set("accessToken", userData.accessToken, {
      expires: 1,
      secure: process.env.NODE_ENV === "production",
      httpOnly: false,
      sameSite: "Lax",
    });

    Cookies.set("refreshToken", userData.refreshToken, {
      expires: 7,
      secure: process.env.NODE_ENV === "production",
      httpOnly: false,
      sameSite: "Lax",
    });

    console.log("Admin cookies set:", Cookies.get("accessToken"), Cookies.get("refreshToken"));

    setUser(userData.user);
  };

  const logout = () => {
    console.log("Logging out...");
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    setUser(null);
  };

  if (loading) {
    console.log("Loading...");
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: !!user,
        loading,
        login,
        adminLogin,
        logout,
        fetchLikedProducts,
        toggleLikeProduct,
        fetchCartProducts,
        toggleCartProduct,
      }}
    >
      {children}
    </AuthContext.Provider>

  );
};

export default AuthContext;
