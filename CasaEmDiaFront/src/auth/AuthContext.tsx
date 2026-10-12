import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Usuario = {
  id: number;
  nome: string;
  email: string;
};

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

type AuthContextValue = {
  usuario: Usuario | null;
  carregando: boolean;
  definirUsuario: (usuario: Usuario) => void;
  sair: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/usuario/me`, { credentials: "include" })
      .then((response) => response.ok ? response.json() : null)
      .then((dados: Usuario | null) => setUsuario(dados))
      .catch(() => setUsuario(null))
      .finally(() => setCarregando(false));
  }, []);

  async function sair() {
    await fetch(`${API_URL}/api/usuario/logout`, {
      method: "POST",
      credentials: "include",
    });
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, definirUsuario: setUsuario, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const contexto = useContext(AuthContext);
  if (!contexto) throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  return contexto;
}
