import type { EventoAgenda } from '../types/agenda.ts';

export const agendaMock: EventoAgenda[] = [
  {
    id: 1,
    titulo: 'Reunião Escolar',
    descricao: 'Reunião de pais e mestres',
    dataEvento: '2026-11-05',
    horarioInicio: '14:00',
    horarioFim: '15:30',
    local: 'Escola Municipal',
    membroId: 1,
    categoria: 'ESCOLA',
  },
  {
    id: 2,
    titulo: 'Consulta Médica Pediatra',
    descricao: 'Consulta de rotina do Leo',
    dataEvento: '2026-11-10',
    horarioInicio: '09:00',
    horarioFim: '10:00',
    local: 'Clínica Infantil',
    membroId: 2,
    categoria: 'CONSULTA',
  },
  {
    id: 3,
    titulo: 'Almoço em Família',
    descricao: 'Churrasco de domingo',
    dataEvento: '2026-11-08',
    horarioInicio: '12:00',
    horarioFim: '16:00',
    local: 'Casa da Vovó',
    membroId: 1,
    categoria: 'LAZER',
  },
];