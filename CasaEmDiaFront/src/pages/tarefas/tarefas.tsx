"use client";

import { useState } from "react";
import CardTarefa from "../components/tarefas/cardTarefas";
import CalendarioTarefa from "../components/tarefas/calendario";
import CardResumo from "../components/tarefas/cardResumos";

export default function Tarefas() {
    const [dataSelecionada, setDataSelecionada] = useState(new Date());

    function diaAnterior() {
        const novaData = new Date(dataSelecionada);
        novaData.setDate(novaData.getDate() - 1);
        setDataSelecionada(novaData);
    }

    function proximoDia() {
        const novaData = new Date(dataSelecionada);
        novaData.setDate(novaData.getDate() + 1);
        setDataSelecionada(novaData);
    }

    return (
        <main>
            <div className="d-grid" style={{ gridTemplateColumns: "14rem 1fr", minHeight: "100vh" }}>
                <div>
                    {/* menu lateral aqui */}
                </div>
                <div>
                    <div>
                        <div
                            className="d-flex flex-column justify-content-between align-items-start p-4 rounded-4"
                        >
                            <h1>Tarefas</h1>
                            <h2>Gerencie as tarefas da familia!</h2>
                        </div>

                        <div
                            className="d-flex flex-column gap-4 align-items-center p-4 rounded-4"
                        >
                            <div className="d-flex justify-content-between">
                                <CalendarioTarefa
                                    dataSelecionada={dataSelecionada}
                                    setDataSelecionada={setDataSelecionada}
                                />
                                <div>
                                    <CardResumo />
                                </div>
                            </div>
                            <div>
                                <div className="d-flex align-items-start justify-content-between p-4 gap-3">
                                    <button
                                        type="button"
                                        onClick={diaAnterior}
                                        className="btn btn-sm rounded-circle border-0 fs-4 lh-1"
                                        aria-label="Dia anterior"
                                    >
                                        ‹
                                    </button>

                                    <h2 className="fs-4 fw-bold m-0 text-capitalize text-center">
                                        {dataSelecionada.toLocaleDateString("pt-BR", {
                                            weekday: "long",
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </h2>

                                    <button
                                        type="button"
                                        onClick={proximoDia}
                                        className="btn btn-sm rounded-circle border-0 fs-4 lh-1"
                                        aria-label="Próximo dia"
                                    >
                                        ›
                                    </button>
                                </div>
                                <CardTarefa dataSelecionada={dataSelecionada} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}