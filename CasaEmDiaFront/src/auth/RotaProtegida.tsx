import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export function RotaProtegida() {
  const { usuario, carregando } = useAuth();

  if (carregando) return <p>Verificando sessão...</p>;
  return usuario ? <Outlet /> : <Navigate to="/login" replace />;
}
