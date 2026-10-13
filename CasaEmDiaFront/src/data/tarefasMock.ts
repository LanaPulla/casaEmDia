import type { TarefaProps } from "../types/tarefas";

export const TAREFAS_MOCK: TarefaProps[] = [
    {
        id: 1,
        titulo: "Lavar a louça", //text 
        responsavel: "Ana", //
        prioridade: "Baixa", 
        recorrencia: "Diária",
        status: "Pendente",
        observacao: "Não esquecer de secar os talheres",
        data: "2026-09-25",
    },
    {
        id: 2,
        titulo: "Limpar o banheiro",
        responsavel: "Bruno",
        prioridade: "Média",
        recorrencia: "Semanal",
        status: "Pendente",
        observacao: "",
        data: "2026-09-25",
    },
    {
        id: 3,
        titulo: "Passar roupa",
        responsavel: "Carla",
        prioridade: "Baixa",
        recorrencia: "Semanal",
        status: "Concluída",
        observacao: "Camisas do trabalho primeiro",
        data: "2026-09-26",
    },
    {
        id: 4,
        titulo: "Pagar as contas",
        responsavel: "Ana",
        prioridade: "Alta",
        recorrencia: "Mensal",
        status: "Pendente",
        observacao: "Vencimento dia 30",
        data: "2026-09-26",
    },
    {
        id: 5,
        titulo: "Trocar roupa de cama",
        responsavel: "Bruno",
        prioridade: "Baixa",
        recorrencia: "Semanal",
        status: "Pendente",
        observacao: "",
        data: "2026-09-27",
    },
    {
        id: 6,
        titulo: "Regar as plantas",
        responsavel: "Carla",
        prioridade: "Média",
        recorrencia: "Diária",
        status: "Concluída",
        observacao: "Evitar excesso de água nas suculentas",
        data: "2026-09-25",
    },
];