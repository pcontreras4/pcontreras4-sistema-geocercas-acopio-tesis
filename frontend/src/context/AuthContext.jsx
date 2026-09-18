import { createContext, useContext, useEffect, useState } from "react";
import apiClient from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("access_token")
  );
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const onStorage = () => setIsAuthenticated(!!localStorage.getItem("access_token"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setUser(null);
      return;
    }
    apiClient
      .get("/auth/me/")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, [isAuthenticated]);

  async function login(username, password) {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.post("/auth/login/", { username, password });
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      setIsAuthenticated(true);
      return true;
    } catch {
      setError("Usuario o contraseña incorrectos.");
      return false;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setIsAuthenticated(false);
  }

  const isAdmin = user?.rol === "administrador";

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, isAdmin, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
