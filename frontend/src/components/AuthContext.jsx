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

  useEffect(() => {
    console.log("Checking authentication...");
  
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      console.log("No access token, skipping auth check.");
      setLoading(false);
      return;
    }
  
    api.get("/auth")
      .then((res) => {
        console.log("Authenticated user:", res.data);
        if (res.data.user) {
          setUser(res.data.user);
          fetchLikedProducts(res.data.user.id);
          fetchCartProducts(res.data.user.id);
        }
      })
      .catch((error) => {
        console.error("Not authenticated:", error);
        logout();
      })
      .finally(() => {
        setLoading(false);
      });
  
  }, []);
  

  const fetchLikedProducts = async (userId = user?.id) => {
    if (!userId) return;

    try {
      const { data } = await api.get(`/users/${userId}/liked`);
      setUser((prevUser) => ({
        ...prevUser,
        likedProducts: Array.isArray(data) ? data : [],
      }));
    } catch (error) {
      console.error("Error loading liked products", error);
    }
  };

  const fetchCartProducts = async (userId = user?.id) => {
    if (!userId) return;

    try {
      const { data } = await api.get(`/cart/${userId}`);
      setUser((prevUser) => ({
        ...prevUser,
        cart: Array.isArray(data.cartItems) ? data.cartItems : [],
      }));
    } catch (error) {
      console.error("Error loading cart products", error);
    }
  };

  const toggleLikeProduct = async (productId) => {
    if (!user) return;

    try {
      const userId = user.id;
      const isLiked = user.likedProducts?.some((p) => p.id === productId);

      if (isLiked) {
        await api.delete(`/users/${userId}/like/${productId}`);
        setUser((prevUser) => ({
          ...prevUser,
          likedProducts: prevUser.likedProducts.filter((p) => p.id !== productId),
        }));
      } else {
        await api.put(`/users/${userId}/like/${productId}`);
        const { data: likedProduct } = await api.get(`/products/${productId}`);
        setUser((prevUser) => ({
          ...prevUser,
          likedProducts: [...prevUser.likedProducts, likedProduct],
        }));
      }
    } catch (error) {
      console.error("Error toggling like", error);
    }
  };

  const toggleCartProduct = async (productID) => {
    if (!user) return;

    try {
      const userId = user.id;
      const cartItem = user.cart?.find((item) => item.productID === productID);

      if (!cartItem) {
        await api.post(`/cart/${userId}`, { productID });
      } else {
        await api.delete(`/cart/${userId}/remove/${cartItem.id}`);
      }

      const { data: updatedCart } = await api.get(`/cart/${userId}`);
      setUser((prevUser) => ({
        ...prevUser,
        cart: updatedCart.cartItems || [],
      }));

    } catch (error) {
      console.error("Error toggling cart product", error);
    }
  };

  const login = async (userData) => {
    console.log("Logging in...", userData);
    api.get("/auth")
      .then((res) => {
        setUser(res.data.user);
        fetchLikedProducts(res.data.user.id);
        fetchCartProducts(res.data.user.id);
      })
      .catch((error) => {
        console.error("Error after login:", error);
        logout();
      });
  };

  const adminLogin = async (userData) => {
    console.log("Admin logging in...", userData);

    setUser(userData.user);

    if (!userData.user.roles.includes("ADMIN")) {
      console.error("Access denied. User is not an admin.");
      logout();
      return;
    }

    login(userData)
  };

  const logout = () => {
    console.log("Logging out...");
    
    Cookies.set("accessToken", "", { expires: 1, secure: process.env.NODE_ENV === "production" });
    Cookies.set("refreshToken", "", { expires: 7, secure: process.env.NODE_ENV === "production" });
  
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
