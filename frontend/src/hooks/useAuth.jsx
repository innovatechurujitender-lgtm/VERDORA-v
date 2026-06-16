import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { safeFetch } from "@/lib/safeFetch";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("verdora_user");
    localStorage.removeItem("verdora_email");
    localStorage.removeItem("verdora_password");
  }, []);

  const refreshUser = useCallback(async () => {
    const saved = localStorage.getItem("verdora_user");
    if (!saved) {
      setLoading(false);
      return;
    }
    try {
      const parsed = JSON.parse(saved);
      if (parsed.email && parsed._emailLogin) {
        setUser(parsed);
        setLoading(false);
        return;
      }
      if (parsed.firebase_uid) {
        const { ok, data } = await safeFetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firebase_uid: parsed.firebase_uid })
        });
        if (!ok || !data) { logout(); setLoading(false); return; }
        setUser(data);
        localStorage.setItem("verdora_user", JSON.stringify(data));
      }
    } catch { logout(); }
    setLoading(false);
  }, [logout]);

  useEffect(() => {
    const saved = localStorage.getItem("verdora_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.email && parsed._emailLogin) {
          setUser(parsed);
          setLoading(false);
          return;
        }
        if (parsed.firebase_uid) { setUser(parsed); refreshUser(); return; }
        localStorage.removeItem("verdora_user");
      } catch { localStorage.removeItem("verdora_user"); }
    }
    setLoading(false);
  }, [refreshUser]);

  async function login(firebase_uid) {
    const { ok, data } = await safeFetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firebase_uid })
    });
    if (!ok || !data) throw new Error("Login failed. Server is starting up, please try again.");
    setUser(data);
    localStorage.setItem("verdora_user", JSON.stringify(data));
    return data;
  }

  async function emailLogin(email, password) {
    const { ok, data } = await safeFetch("/api/auth/email/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    if (!ok || !data) throw new Error("Login failed. Server is starting up, please try again.");
    const userData = { ...data, _emailLogin: true };
    setUser(userData);
    localStorage.setItem("verdora_user", JSON.stringify(userData));
    localStorage.setItem("verdora_email", email);
    localStorage.setItem("verdora_password", password);
    return userData;
  }

  return (
    <AuthContext.Provider value={{ user, login, emailLogin, logout, refreshUser, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
