"use client";

import "./cardResumos.css"

interface ItemResumo {
  valor: number;
  rotulo: string;
}

const itens: ItemResumo[] = [
  { valor: 4, rotulo: "Tarefas de hoje" },
  { valor: 2, rotulo: "Compromissos" },
  { valor: 3, rotulo: "Concluídas" },
  { valor: 1, rotulo: "Pendentes" },
];

export default function CardResumo() {
  return (
    <div className="resumo">
      <h3 className="resumo-titulo">Resumo do dia</h3>

      <div className="resumo-grade">
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