"use client"
import { TAREFAS_MOCK } from "../../../data/tarefasMock";

interface CardTarefaProps {
  dataSelecionada: Date;
}

function formatarData(data: Date) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
}

const corBorda = {
    Alta: "#dc3545",
    Média: "#ffc107",
    Baixa: "#198754",
};

export default function CardTarefa({ dataSelecionada }: CardTarefaProps) {
    const dataFiltro = formatarData(dataSelecionada);

    const tarefaDoDia = TAREFAS_MOCK.filter((tarefa) =>
        tarefa.data == dataFiltro
    )

    if (tarefaDoDia.length == 0) {
        return (
            <div>
                <h2 className="fs-4 fw-bold">Nenhuma tarefa para esse dia!</h2>
            </div>
        )
    }

    return (
        <ul className="list-unstyled d-flex flex-column gap-4 w-100 align-items-center">
            {tarefaDoDia.map((tarefa) => {
                const corPrioridade =
                    corBorda[tarefa.prioridade as keyof typeof corBorda];

                return (
                    <li key={tarefa.id} className="col w-100" style={{ maxWidth: "64rem" }}>
                        <article
                            className="d-flex align-items-center justify-content-between rounded-4 px-5 py-3 shadow-sm task-card"
                            style={{
                                backgroundColor: "#faf9f6",
                                borderLeft: corPrioridade
                                    ? `8px solid ${corPrioridade}`
                                    : undefined,
                            }}
                        >
                            <div className="d-grid gap-4 w-100">
                                <div className="d-flex justify-content-between">
                                    <span className="fs-5 fw-bold">
                                        {tarefa.titulo}
                                    </span>

                                    <div className="d-flex align-items-center gap-4">
                                        <input
                                            type="checkbox"
                                            id={`tarefa-concluida-${tarefa.id}`}
                                            value="concluida"
                                            className="form-check-input"
                                            style={{
                                                width: "1.5rem",
                                                height: "1.5rem",
                                                accentColor: "#3F5B4B",
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="d-flex align-items-center justify-content-between">
                                    <div className="d-flex align-items-center gap-4">
                                        <span>
            
                                        </span>
                                        <span>
                                           
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </li>
                );
            })}
        </ul>
    );
}