import { useState, useEffect, createContext, useContext, useCallback } from "react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("verdora_user");
  }, []);

  const refreshUser = useCallback(async () => {
    const savedUser = localStorage.getItem("verdora_user");
    if (!savedUser) return;
    try {
      const parsed = JSON.parse(savedUser);
      if (!parsed.email || !parsed.password) {
        logout();
        return;
      }
      const res = await fetch(`/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: parsed.email, password: parsed.password })
      });
      if (!res.ok) {
        logout();
        return;
      }
      const data = await res.json();
      const refreshed = { ...data, password: parsed.password };
      setUser(refreshed);
      localStorage.setItem("verdora_user", JSON.stringify(refreshed));
    } catch {
      logout();
    }
  }, [logout]);

  useEffect(() => {
    const savedUser = localStorage.getItem("verdora_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed.email && parsed.password) {
          setUser(parsed);
          refreshUser();
        } else {
          localStorage.removeItem("verdora_user");
        }
      } catch {
        localStorage.removeItem("verdora_user");
      }
    }
    setLoading(false);
  }, [refreshUser]);

  async function login(email, password) {
    const res = await fetch(`/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Login failed");
    }
    const newUser = { ...data, password };
    setUser(newUser);
    localStorage.setItem("verdora_user", JSON.stringify(newUser));
    return newUser;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshUser, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
