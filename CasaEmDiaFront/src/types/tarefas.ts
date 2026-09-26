export interface TarefaProps {
    id: number;
    titulo: string;
    responsavel: string;
    prioridade: 'Baixa' | 'Média' | 'Alta';
    ondeCasa: string;
    recorrencia: 'Diária' | 'Semanal' | 'Quinzenal' | 'Mensal';
    status: 'Concluída' | 'Pendente';
    observacao: string;
    data: string;
}