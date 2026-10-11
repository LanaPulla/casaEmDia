import { useState, type FormEvent } from "react";
import type { UsuarioProps } from "../../../types/tarefas";
import { criarTarefa } from "../../../services/tarefas/tarefas";

const OPCOES_RECORRENCIA = ["Nenhuma", "Diária", "Semanal", "Mensal"] as const;
const OPCOES_STATUS = ["Concluída", "Em Andamento", "Pendente"] as const;
const OPCOES_PRIORIDADE = ["Baixa", "Média", "Alta"] as const;

type Recorrencia = (typeof OPCOES_RECORRENCIA)[number];
type Status = (typeof OPCOES_STATUS)[number];
type Prioridade = (typeof OPCOES_PRIORIDADE)[number];

type Props = { usuarios: UsuarioProps[]; onCriada?: () => void };

function hoje() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function NovaTarefaButton({ usuarios, onCriada }: Props) {
  const [modal, setModal] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [responsavelId, setResponsavelId] = useState<number | "">("");
  const [prioridade, setPrioridade] = useState<Prioridade>("Alta");
  const [recorrencia, setRecorrencia] = useState<Recorrencia>("Nenhuma");
  const [status, setStatus] = useState<Status>("Pendente");
  const [observacao, setObservacao] = useState("");
  const [data, setData] = useState(hoje());
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  function limpar() {
    setTitulo("");
    setResponsavelId("");
    setPrioridade("Alta");
    setRecorrencia("Nenhuma");
    setStatus("Pendente");
    setObservacao("");
    setData(hoje());
    setErro("");
  }

  async function cadastrarTarefa(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (responsavelId === "") return;
    setErro("");
    setEnviando(true);

    try {
      await criarTarefa({ titulo, responsavelId, prioridade, recorrencia, status, observacao, data });
      limpar();
      setModal(false);
      onCriada?.();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Ocorreu um erro inesperado.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div>
      <button className="btn btn-lg btn-success" onClick={() => setModal(true)}>
        + Nova Tarefa
      </button>

      {modal && (
        <div
          style={{
            position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1050, overflowY: "auto", padding: "1rem",
          }}
          onClick={() => !enviando && setModal(false)}
        >
          <div
            className="bg-white rounded-4 shadow p-4"
            style={{ width: "100%", maxWidth: "36rem", maxHeight: "90vh", overflowY: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="titulo-modal fs-4 fw-bold mb-4">Nova Tarefa</h1>

            <form className="d-flex flex-column gap-3" onSubmit={cadastrarTarefa}>
              <label>
                Título:
                <input className="form-control" type="text" value={titulo} maxLength={100}
                  onChange={(e) => setTitulo(e.target.value)} required />
              </label>

              <label>
                Responsável:
                <select className="form-select" value={responsavelId} required
                  onChange={(e) => setResponsavelId(e.target.value === "" ? "" : Number(e.target.value))}>
                  <option value="">Selecione um responsável</option>
                  {usuarios.map((u) => (
                    <option key={u.id} value={u.id}>{u.nome}</option>
                  ))}
                </select>
              </label>

              <label>
                Data:
                <input className="form-control" type="date" value={data} required
                  onChange={(e) => setData(e.target.value)} />
              </label>

              <fieldset>
                <legend className="form-label fs-6">Prioridade:</legend>
                {OPCOES_PRIORIDADE.map((opcao) => (
                  <div key={opcao} className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="prioridade"
                      id={`prioridade-${opcao}`} checked={prioridade === opcao}
                      onChange={() => setPrioridade(opcao)} />
                    <label className="form-check-label" htmlFor={`prioridade-${opcao}`}>{opcao}</label>
                  </div>
                ))}
              </fieldset>

              <fieldset>
                <legend className="form-label fs-6">Recorrência:</legend>
                {OPCOES_RECORRENCIA.map((opcao) => (
                  <div key={opcao} className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="recorrencia"
                      id={`recorrencia-${opcao}`} checked={recorrencia === opcao}
                      onChange={() => setRecorrencia(opcao)} />
                    <label className="form-check-label" htmlFor={`recorrencia-${opcao}`}>{opcao}</label>
                  </div>
                ))}
              </fieldset>

              <fieldset>
                <legend className="form-label fs-6">Status:</legend>
                {OPCOES_STATUS.map((opcao) => (
                  <div key={opcao} className="form-check form-check-inline">
                    <input className="form-check-input" type="radio" name="status"
                      id={`status-${opcao}`} checked={status === opcao}
                      onChange={() => setStatus(opcao)} />
                    <label className="form-check-label" htmlFor={`status-${opcao}`}>{opcao}</label>
                  </div>
                ))}
              </fieldset>

              <label>
                Observação:
                <textarea className="form-control" value={observacao} maxLength={500} rows={3}
                  onChange={(e) => setObservacao(e.target.value)} />
              </label>

              {erro && <p className="text-danger mb-0" role="alert">{erro}</p>}

              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-secondary" type="button" disabled={enviando}
                  onClick={() => setModal(false)}>
                  Fechar
                </button>
                <button className="btn btn-success" type="submit" disabled={enviando}>
                  {enviando ? "Criando..." : "Criar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}