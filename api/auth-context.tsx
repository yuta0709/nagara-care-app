"use client";

import { createContext, useContext, ReactNode } from "react";

type AuthContextType = {
  token: string;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

type AuthProviderProps = {
  token: string;
  children: ReactNode;
};

export function AuthProvider({ token, children }: AuthProviderProps) {
  return (
    <AuthContext.Provider value={{ token }}>{children}</AuthContext.Provider>
  );
}
