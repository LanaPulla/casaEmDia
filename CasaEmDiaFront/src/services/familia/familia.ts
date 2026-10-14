import type { UsuarioProps } from "../../types/tarefas";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

interface FamiliaResponse {
  id: number;
  nome: string;
  membros: Array<{
    id: number;
    nome: string;
    email: string;
  }>;
}

export async function listarMembrosFamilia(): Promise<UsuarioProps[]> {
  const response = await fetch(`${API_URL}/api/familia`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Não foi possível carregar os membros da família.");
  }

  const familia: FamiliaResponse = await response.json();

  return familia.membros.map((membro) => ({
    ...membro,
    criado_em: "",
  }));
}
