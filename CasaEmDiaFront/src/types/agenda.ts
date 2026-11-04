export interface EventoAgenda {
  id: number;
  titulo: string;
  descricao?: string;
  dataEvento: string; // Formato "YYYY-MM-DD"
  horarioInicio?: string;
  horarioFim?: string;
  local?: string;
  membroId?: number;
  categoria?: 'FAMILIA' | 'CONSULTA' | 'ESCOLA' | 'LAZER' | 'OUTROS';
}