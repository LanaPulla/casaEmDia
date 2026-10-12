import type { TarefaProps, Prioridade, Recorrencia, Status } from "../../types/tarefas";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

const PRIORIDADES: Prioridade[] = ["Baixa", "Média", "Alta"];
const RECORRENCIAS: Recorrencia[] = ["Nenhuma", "Diária", "Semanal", "Mensal"];
const STATUS: Status[] = ["Concluída", "Em Andamento", "Pendente"];

// Como cada enum do back espera receber o valor (todos confirmados pelo log).
// Prioridade e Recorrência: rótulo com acento.
// Status: MAIÚSCULO_COM_UNDERSCORE.
const PRIORIDADE_API: Record<Prioridade, string> = {
  Baixa: "Baixa",
  Média: "Média",
  Alta: "Alta",
};

const RECORRENCIA_API: Record<Recorrencia, string> = {
  Nenhuma: "Nenhuma",
  Diária: "Diária",
  Semanal: "Semanal",
  Mensal: "Mensal",
};

const STATUS_API: Record<Status, string> = {
  Concluída: "CONCLUIDA",
  "Em Andamento": "EM_ANDAMENTO",
  Pendente: "PENDENTE",
};

// Remove acentos, espaços e underscores e põe em maiúsculas, só para comparar.
function chave(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\s_]+/g, "")
    .toUpperCase();
}

// Aceita qualquer formato vindo da API e devolve o rótulo do front.
function paraRotulo<T extends string>(valor: unknown, opcoes: readonly T[], padrao: T): T {
  if (typeof valor !== "string") return padrao;
  const v = chave(valor);
  return opcoes.find((o) => chave(o) === v) ?? padrao;
}

function normalizarData(d: unknown): string {
  if (Array.isArray(d)) {
    const [a, m, dia] = d as number[];
    return `${a}-${String(m).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
  }
  return typeof d === "string" ? d.slice(0, 10) : "";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function paraFront(t: any): TarefaProps {
  return {
    id: t.id,
    titulo: t.titulo,
    responsavel: {
      id: t.responsavel?.id ?? t.responsavelId,
      nome: t.responsavel?.nome ?? t.responsavelNome ?? "",
    },
    prioridade: paraRotulo(t.prioridade, PRIORIDADES, "Baixa"),
    recorrencia: paraRotulo(t.recorrencia, RECORRENCIAS, "Nenhuma"),
    status: paraRotulo(t.status, STATUS, "Pendente"),
    observacao: t.observacao ?? "",
    data: normalizarData(t.dataTarefa ?? t.data),
  } as TarefaProps;
}

export interface NovaTarefaDados {
  titulo: string;
  responsavelId: number;
  prioridade: Prioridade;
  recorrencia: Recorrencia;
  status: Status;
  observacao: string;
  data: string; // yyyy-MM-dd
}

function paraApi(d: NovaTarefaDados) {
  return {
    titulo: d.titulo.trim(),
    responsavelId: d.responsavelId,
    prioridade: PRIORIDADE_API[d.prioridade],
    recorrencia: RECORRENCIA_API[d.recorrencia],
    status: STATUS_API[d.status],
    observacao: d.observacao,
    dataTarefa: d.data,
  };
}

export async function listarTarefas(): Promise<TarefaProps[]> {
  const response = await fetch(`${API_URL}/tarefas`, { credentials: "include" });
  if (!response.ok) throw new Error("Erro ao carregar tarefas.");
  const dados = await response.json();
  return dados.map(paraFront);
}

export async function criarTarefa(dados: NovaTarefaDados): Promise<void> {
  const response = await fetch(`${API_URL}/tarefas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(paraApi(dados)),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Não foi possível criar a tarefa.");
}

export async function atualizarTarefa(tarefa: TarefaProps): Promise<TarefaProps> {
  const response = await fetch(`${API_URL}/tarefas/${tarefa.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      paraApi({
        titulo: tarefa.titulo,
        responsavelId: tarefa.responsavel.id,
        prioridade: tarefa.prioridade,
        recorrencia: tarefa.recorrencia,
        status: tarefa.status,
        observacao: tarefa.observacao ?? "",
        data: tarefa.data,
      })
    ),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Erro ao atualizar a tarefa.");
  return paraFront(await response.json());
}

export async function excluirTarefa(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/tarefas/${id}`, { method: "DELETE", credentials: "include" });
  if (!response.ok) throw new Error("Erro ao excluir a tarefa.");
}