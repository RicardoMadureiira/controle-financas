import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { getAnonUserId } from "../utils/getAnonUserId";
import { clearUserCache, migrateAnonymousCache } from "../utils/storage";

export interface AuthUser { id: string; name: string; email: string; avatarUrl: string | null; }
type AuthStatus = "loading" | "authenticated" | "guest";
interface AuthContextValue {
  user: AuthUser | null;
  status: AuthStatus;
  login: (credential: string) => Promise<number>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const CACHED_USER_KEY = "finance.auth.user";

function getCachedUser(): AuthUser | null {
  try { const value = localStorage.getItem(CACHED_USER_KEY); return value ? JSON.parse(value) as AuthUser : null; }
  catch { return null; }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");
  useEffect(() => {
    api.get<{ user: AuthUser }>("/auth/me").then(({ data }) => {
      setUser(data.user); localStorage.setItem(CACHED_USER_KEY, JSON.stringify(data.user)); setStatus("authenticated");
    }).catch(() => {
      const cached = !navigator.onLine ? getCachedUser() : null;
      setUser(cached); setStatus(cached ? "authenticated" : "guest");
    });
  }, []);

  useEffect(() => {
    const expire = () => { setUser(null); setStatus("guest"); };
    window.addEventListener("finance:session-expired", expire);
    return () => window.removeEventListener("finance:session-expired", expire);
  }, []);

  const login = useCallback(async (credential: string) => {
    const { data } = await api.post<{ user: AuthUser; migratedCount: number }>("/auth/google", { credential, anonUserId: getAnonUserId() });
    migrateAnonymousCache(data.user.id);
    localStorage.setItem(CACHED_USER_KEY, JSON.stringify(data.user));
    setUser(data.user); setStatus("authenticated");
    return data.migratedCount;
  }, []);

  const logout = useCallback(async () => {
    await api.post("/auth/logout");
    if (user) clearUserCache(user.id);
    localStorage.removeItem(CACHED_USER_KEY);
    setUser(null); setStatus("guest");
  }, [user]);

  const deleteAccount = useCallback(async () => {
    await api.delete("/auth/account");
    if (user) clearUserCache(user.id);
    localStorage.removeItem(CACHED_USER_KEY);
    setUser(null); setStatus("guest");
  }, [user]);

  return <AuthContext.Provider value={{ user, status, login, logout, deleteAccount }}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return value;
}
