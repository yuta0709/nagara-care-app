"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useQueryClient } from "@tanstack/react-query";

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_STORAGE_KEY = "auth_token";

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [token, setTokenState] = useState<string | null>(() => {
    // クライアントサイドでのみローカルストレージとCookieにアクセス
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem(TOKEN_STORAGE_KEY) ||
        Cookies.get(TOKEN_STORAGE_KEY) ||
        null
      );
    }
    return null;
  });

  const setToken = useCallback((newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      localStorage.setItem(TOKEN_STORAGE_KEY, newToken);
      // Cookieにも保存（7日間有効）
      Cookies.set(TOKEN_STORAGE_KEY, newToken, { expires: 7 });
    } else {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      Cookies.remove(TOKEN_STORAGE_KEY);
    }
  }, []);

  // ログアウト時にトークンとキャッシュをクリアしてログインページにリダイレクト
  const logout = useCallback(() => {
    setToken(null);
    // すべてのキャッシュをクリア
    queryClient.clear();
    router.push("/login");
  }, [setToken, router, queryClient]);

  // トークンの有効性チェックなどが必要な場合はここに追加

  const value = {
    token,
    setToken,
    isAuthenticated: !!token,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
