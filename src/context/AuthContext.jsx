import { createContext, useState, useContext, useEffect } from "react";
import { login as apiLogin, register as apiRegister } from "../api/auth";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const loginRes = await apiLogin({ email, password });
      const { token, email: userEmail, role } = loginRes.data;

      localStorage.setItem("token", token);

      // ✅ Create user object from login response (no extra API call)
      const userObj = {
        id: "temp-id", // we don't have id from login, but we can keep it as placeholder
        email: userEmail,
        role: role,
        firstName: "User", // placeholder – you can update later
        lastName: "User",
      };

      localStorage.setItem("user", JSON.stringify(userObj));
      setUser(userObj);
      toast.success("Logged in successfully");
      return true;
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed";
      toast.error(msg);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      await apiRegister(userData);
      toast.success("Registration successful. Please log in.");
      return true;
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed";
      toast.error(msg);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Logged out");
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
