"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type UserRole = "admin" | "operador" | "consulta";

export type AuthUser = {
  username: string;
  name: string;
  role: UserRole;
  roleLabel: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isHydrated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  canAccessPath: (path: string) => boolean;
};

const USERS: Array<AuthUser & { password: string }> = [
  {
    username: "admin",
    password: "admin123",
    name: "Admin OF+",
    role: "admin",
    roleLabel: "Administrador",
  },
  {
    username: "operador",
    password: "operador123",
    name: "Operador Banco",
    role: "operador",
    roleLabel: "Operador",
  },
  {
    username: "consulta",
    password: "consulta123",
    name: "Consulta Riesgo",
    role: "consulta",
    roleLabel: "Consulta",
  },
];

const PUBLIC_PATHS = ["/login"];

const ROLE_ACCESS: Record<UserRole, string[]> = {
  admin: [
    "/home",
    "/dashboard",
    "/conexiones",
    "/certificado",
    "/certificado-fiscal",
    "/ofertas-credito",
    "/emisor-creditos",
    "/simulador-elegibilidad",
    "/asistente-fiscal",
    "/catalogo-bancos",
    "/configuracion",
    "/onboarding",
  ],
  operador: [
    "/home",
    "/dashboard",
    "/certificado",
    "/certificado-fiscal",
    "/ofertas-credito",
    "/emisor-creditos",
    "/simulador-elegibilidad",
    "/asistente-fiscal",
    "/catalogo-bancos",
    "/configuracion",
    "/onboarding",
  ],
  consulta: [
    "/home",
    "/dashboard",
    "/certificado",
    "/certificado-fiscal",
    "/simulador-elegibilidad",
    "/catalogo-bancos",
    "/configuracion",
  ],
};

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizePath(path: string) {
  if (path === "/") return "/home";
  const cleanPath = path.split("?")[0].split("#")[0];
  return cleanPath.endsWith("/") && cleanPath.length > 1
    ? cleanPath.slice(0, -1)
    : cleanPath;
}

export function canRoleAccessPath(role: UserRole, path: string) {
  const normalizedPath = normalizePath(path);
  return ROLE_ACCESS[role].some(
    (allowedPath) =>
      normalizedPath === allowedPath || normalizedPath.startsWith(`${allowedPath}/`)
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const storedUser = window.localStorage.getItem("openfinance-user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser) as AuthUser);
      } catch {
        window.localStorage.removeItem("openfinance-user");
      }
    }
    setIsHydrated(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isHydrated,
      login: (username, password) => {
        const match = USERS.find(
          (candidate) =>
            candidate.username.toLowerCase() === username.trim().toLowerCase() &&
            candidate.password === password
        );

        if (!match) return false;

        const { password: _password, ...safeUser } = match;
        setUser(safeUser);
        window.localStorage.setItem("openfinance-user", JSON.stringify(safeUser));
        return true;
      },
      logout: () => {
        setUser(null);
        window.localStorage.removeItem("openfinance-user");
      },
      canAccessPath: (path) => {
        const normalizedPath = normalizePath(path);
        if (PUBLIC_PATHS.includes(normalizedPath)) return true;
        if (!user) return false;
        return canRoleAccessPath(user.role, normalizedPath);
      },
    }),
    [isHydrated, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return value;
}
