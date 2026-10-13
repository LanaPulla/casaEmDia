import type { CSSProperties } from "react";

import "./cardTarefas.css";

import type { TarefaProps } from "../../../types/tarefas";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { DeleteOutlined, PersonOutlined } from "@mui/icons-material";
import RepeatIcon from "@mui/icons-material/Repeat";

interface CardTarefaProps {
  dataSelecionada: Date;
  tarefas: TarefaProps[];
  onDetalhes?: (tarefa: TarefaProps) => void;
  onExcluir?: (tarefa: TarefaProps) => void;
  onAlternarConclusao?: (tarefa: TarefaProps) => void;
}

function formatarData(data: Date) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

const corPrioridade: Record<string, string> = {
  Alta: "#dc3545",
  Média: "#e0a800",
  Baixa: "#239954",
};

export default function CardTarefa({
  dataSelecionada,
  tarefas,
  onDetalhes,
  onExcluir,
  onAlternarConclusao,
}: CardTarefaProps) {
  const dataFiltro = formatarData(dataSelecionada);

  const tarefasDoDia = tarefas.filter(
    (tarefa) => tarefa.data === dataFiltro
  );

  if (tarefasDoDia.length === 0) {
    return <p className="tarefa-vazio">Nenhuma tarefa para esse dia!</p>;
  }

  return (
    <ul className="tarefa-lista">
      {tarefasDoDia.map((tarefa) => {
        const cor = corPrioridade[tarefa.prioridade];
        const concluida = tarefa.status === "Concluída";

        return (
          <li key={tarefa.id}>
            <article
              className={`tarefa-card ${
                concluida ? "tarefa-card-concluida" : ""
              }`}
              style={
                cor
                  ? ({ "--tarefa-cor": cor } as CSSProperties)
                  : undefined
              }
            >
              <div className="tarefa-conteudo">
                <span className="tarefa-titulo">{tarefa.titulo}</span>

                <div className="tarefa-info">
                  <span className="tarefa-selo">
                    {tarefa.prioridade}
                  </span>

                  <span className="tarefa-info-item">
                    <PersonOutlined />
                    {tarefa.responsavel.nome}
                  </span>

                  <span className="tarefa-info-item">
                    <RepeatIcon />
                    {tarefa.recorrencia}
                  </span>
                </div>

                {tarefa.observacao && (
                  <p className="tarefa-observacao">
                    {tarefa.observacao}
                  </p>
                )}
              </div>

              <div className="tarefa-acoes">
                <input
                  type="checkbox"
                  id={`tarefa-concluida-${tarefa.id}`}
                  className="tarefa-checkbox"
                  checked={concluida}
                  onChange={() => onAlternarConclusao?.(tarefa)}
                  aria-label={`Marcar "${tarefa.titulo}" como concluída`}
                />

                <button
                  type="button"
                  className="tarefa-botao"
                  onClick={() => onDetalhes?.(tarefa)}
                  aria-label={`Editar "${tarefa.titulo}"`}
                  title="Editar tarefa"
                >
                  <EditOutlinedIcon fontSize="small" />
                </button>

                <button
                  type="button"
                  className="tarefa-botao tarefa-botao-excluir"
                  onClick={() => onExcluir?.(tarefa)}
                  aria-label={`Excluir "${tarefa.titulo}"`}
                  title="Excluir"
                >
                  <DeleteOutlined fontSize="small" />
                </button>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}