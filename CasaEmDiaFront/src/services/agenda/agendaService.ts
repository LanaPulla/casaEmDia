import type { EventoAgenda } from '../../types/agenda';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';
const API_URL = `${BASE_URL}/api/agenda`;

async function getUsuarioIdLogado(): Promise<number> {
  const response = await fetch(`${BASE_URL}/api/usuario/me`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Sessão expirada ou usuário não autenticado. Faça login novamente.');
  }

  const usuario = await response.json();
  const id = usuario?.id ?? usuario?.usuarioId ?? usuario?.usuario?.id;

  if (!id) {
    throw new Error('ID do usuário não encontrado na sessão.');
  }

  return Number(id);
}

async function tratarErro(response: Response, mensagemPadrao: string): Promise<never> {
  const detalhe = await response.text().catch(() => '');
  throw new Error(`${mensagemPadrao} (HTTP ${response.status}${detalhe ? `: ${detalhe}` : ''})`);
}

export const agendaService = {
  async listarTodos(): Promise<EventoAgenda[]> {
    const usuarioId = await getUsuarioIdLogado();
    const response = await fetch(`${API_URL}?usuarioId=${usuarioId}`, {
      credentials: 'include',
    });
    if (!response.ok) await tratarErro(response, 'Erro ao buscar eventos da família');
    return response.json();
  },

  async criar(evento: Omit<EventoAgenda, 'id'>): Promise<EventoAgenda> {
    const usuarioId = await getUsuarioIdLogado();
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ...evento, usuarioId }),
    });
    if (!response.ok) await tratarErro(response, 'Erro ao criar evento');
    return response.json();
  },

  async atualizar(id: number, evento: Partial<EventoAgenda>): Promise<EventoAgenda> {
    const usuarioId = await getUsuarioIdLogado();
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ...evento, usuarioId }),
    });
    if (!response.ok) await tratarErro(response, 'Erro ao atualizar evento');
    return response.json();
  },

  async deletar(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) await tratarErro(response, 'Erro ao deletar evento');
  },
};