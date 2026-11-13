export interface EventoAgenda {
  id: number;
  titulo: string;
  descricao?: string | null;
  dataEvento: string; // Formato "YYYY-MM-DD"
  horarioInicio?: string | null;
  horarioFim?: string | null;
  local?: string | null;
  categoria?: 'FAMILIA' | 'CONSULTA' | 'ESCOLA' | 'LAZER' | 'OUTROS';
}