
import "./cardResumos.css";

import type { TarefaProps } from "../../../types/tarefas";

interface CardResumoProps {
  dataSelecionada: Date;
  tarefas: TarefaProps[];
  telaInteira?: boolean;
}

function formatarData(data: Date) {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

export default function CardResumo({ dataSelecionada, tarefas, telaInteira }: CardResumoProps) {
  const dataFiltro = formatarData(dataSelecionada);
  const tarefasDoDia = tarefas.filter((t) => t.data === dataFiltro);

  const itens = [
    { valor: tarefasDoDia.length, rotulo: "Tarefas do dia" },
    {
      valor: tarefasDoDia.filter((t) => t.status === "Em Andamento").length,
      rotulo: "Em andamento",
    },
    {
      valor: tarefasDoDia.filter((t) => t.status === "Concluída").length,
      rotulo: "Concluídas",
    },
    {
      valor: tarefasDoDia.filter((t) => t.status === "Pendente").length,
      rotulo: "Pendentes",
    },
  ];

  return (
    <div className={telaInteira ? "resumo-telaIntira" : "resumo"}>
      <h3 className="resumo-titulo">Resumo do dia</h3>

      <div className={telaInteira ? "resumo-grade-telaIntira" : "resumo-grade"}>
        {itens.map((item) => (
          <div key={item.rotulo} className="resumo-card">
            <span className="resumo-valor">{item.valor}</span>
            <span className="resumo-rotulo">{item.rotulo}</span>
          </div>
        ))}
      </div>
    </div>
  );
}