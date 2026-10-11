"use client";

import "./tarefas.css";
import { useState } from "react";
import CardTarefa from "../components/tarefas/cardTarefas";
import CalendarioTarefa from "../components/tarefas/calendario";
import CardResumo from "../components/tarefas/cardResumos";
import NovaTarefaButton from "../components/tarefas/novaTarefaButton";
import { USUARIOS_MOCK } from "../../data/usuariosMock";

export default function Tarefas() {
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  function mudarDia(delta: number) {
    const novaData = new Date(dataSelecionada);
    novaData.setDate(novaData.getDate() + delta);
    setDataSelecionada(novaData);
  }

  return (
    <main>
      <section className="tarefas-principal">
        <div className="tarefas-topo">
          <div>
            <h1 className="tarefas-titulo">Tarefas</h1>
            <h2 className="tarefas-subtitulo">Gerencie as tarefas da família!</h2>
          </div>
          <NovaTarefaButton usuarios={USUARIOS_MOCK} />
        </div>

        <div className="tarefas-painel">
          <CalendarioTarefa
            dataSelecionada={dataSelecionada}
            setDataSelecionada={setDataSelecionada}
          />
          <CardResumo />
        </div>

        <div className="tarefas-lista-area">
          <div className="tarefas-dia-nav">
            <button
              type="button"
              onClick={() => mudarDia(-1)}
              className="tarefas-botao-dia"
              aria-label="Dia anterior"
            >
              ‹
            </button>

            <h2 className="tarefas-dia-titulo">
              {dataSelecionada.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </h2>

            <button
              type="button"
              onClick={() => mudarDia(1)}
              className="tarefas-botao-dia"
              aria-label="Próximo dia"
            >
              ›
            </button>
          </div>

          <CardTarefa dataSelecionada={dataSelecionada} />
        </div>
      </section>
    </main>
  );
}