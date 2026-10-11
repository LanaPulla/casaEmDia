// export enum RecorrenciaEnum {
//     DIARIA = 'Diária',
//     SEMANAL = 'Semanal',
//     MENSAL = 'Mensal'
// }

// export enum StatusEnum {
//     CONCLUIDA = 'Concluída',
//     EM_ANDAMENTO = 'Em Andamento',
//     PENDENTE = 'Pendente'
// }

// export enum PrioridadeEnum {
//     BAIXA = 'Baixa',
//     MEDIA = 'Media',
//     ALTA = 'Alta'
// }

export type Recorrencia = 'Nenhuma' | 'Diária' | 'Semanal' | 'Mensal';
export type Status = 'Concluída' | 'Em Andamento' | 'Pendente';
export type Prioridade = 'Baixa' | 'Média' | 'Alta';

export interface TarefaProps {
    id: number;
    titulo: string;
    responsavel: UsuarioProps;
    prioridade: Prioridade;
    recorrencia: Recorrencia;
    status: Status;
    observacao: string;
    data: string;
}

export interface UsuarioProps {
    id: number;
    nome: string;
    email: string;
    criado_em: string;
}