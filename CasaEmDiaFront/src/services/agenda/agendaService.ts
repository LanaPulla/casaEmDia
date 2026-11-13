import type { EventoAgenda } from '../../types/agenda';

// Deve estar exatamente desta forma:
const API_URL = 'http://localhost:8080/api/agenda';

export const agendaService = {
  async listarTodos(): Promise<EventoAgenda[]> {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Erro ao buscar eventos da agenda');
    return response.json();
  },

  async criar(evento: Omit<EventoAgenda, 'id'>): Promise<EventoAgenda> {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evento),
    });
    if (!response.ok) throw new Error('Erro ao criar evento');
    return response.json();
  },

  async atualizar(id: number, evento: Partial<EventoAgenda>): Promise<EventoAgenda> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evento),
    });
    if (!response.ok) throw new Error('Erro ao atualizar evento');
    return response.json();
  },

  async deletar(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao deletar evento');
  },
};