
"use client";

import { useEffect, useState, type FormEvent } from "react";

import type {
  TarefaProps,
  UsuarioProps,
  Prioridade,
  Recorrencia,
  Status,
} from "../../../types/tarefas";

const OPCOES_RECORRENCIA: Recorrencia[] = [
 "Nenhuma",
  "Diária",
  "Semanal",
  "Mensal",
];

const OPCOES_STATUS: Status[] = [
  "Concluída",
  "Em Andamento",
  "Pendente",
];

const OPCOES_PRIORIDADE: Prioridade[] = [
  "Baixa",
  "Média",
  "Alta",
];

interface Props {
  tarefa: TarefaProps;
  usuarios: UsuarioProps[];
  onFechar: () => void;
  onSalvar: (
    tarefaAtualizada: TarefaProps
  ) => void | Promise<void>;
}

export default function EditarTarefaButton({
  tarefa,
  usuarios,
  onFechar,
  onSalvar,
}: Props) {
  const [titulo, setTitulo] = useState(tarefa.titulo);
  const [responsavelId, setResponsavelId] = useState<number | "">(
    tarefa.responsavel.id
  );
  const [prioridade, setPrioridade] = useState<Prioridade>(
    tarefa.prioridade
  );
  const [recorrencia, setRecorrencia] = useState<Recorrencia>(
    tarefa.recorrencia
  );
  const [status, setStatus] = useState<Status>(tarefa.status);
  const [observacao, setObservacao] = useState(
    tarefa.observacao ?? ""
  );
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  // Atualiza os campos caso seja selecionada outra tarefa.
  useEffect(() => {
    setTitulo(tarefa.titulo);
    setResponsavelId(tarefa.responsavel.id);
    setPrioridade(tarefa.prioridade);
    setRecorrencia(tarefa.recorrencia);
    setStatus(tarefa.status);
    setObservacao(tarefa.observacao ?? "");
    setErro("");
  }, [tarefa]);

  async function salvar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");

    if (responsavelId === "") {
      setErro("Seleciona um responsável.");
      return;
    }

    const responsavel = usuarios.find(
      (usuario) => usuario.id === responsavelId
    );

    if (!responsavel) {
      setErro("O responsável selecionado não foi encontrado.");
      return;
    }

    setEnviando(true);

    try {
      await onSalvar({
        ...tarefa,
        titulo: titulo.trim(),
        responsavel,
        prioridade,
        recorrencia,
        status,
        observacao,
      });
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      setErro("Não foi possível salvar as alterações. Tenta novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div
      role="presentation"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1050,
        overflowY: "auto",
        padding: "1rem",
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !enviando) {
          onFechar();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-modal-editar"
        className="bg-white rounded-4 shadow p-4"
        style={{
          width: "100%",
          maxWidth: "36rem",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h1
          id="titulo-modal-editar"
          className="titulo-modal fs-4 fw-bold mb-4"
        >
          Editar Tarefa
        </h1>

        <form
          className="d-flex flex-column gap-3"
          onSubmit={salvar}
        >
          <label>
            Título:
            <input
              className="form-control"
              type="text"
              value={titulo}
              onChange={(event) => setTitulo(event.target.value)}
              required
              maxLength={200}
            />
          </label>

          <label>
            Responsável:
            <select
              className="form-select"
              value={responsavelId}
              onChange={(event) =>
                setResponsavelId(
                  event.target.value === ""
                    ? ""
                    : Number(event.target.value)
                )
              }
              required
            >
              <option value="">Selecione um responsável</option>
              {usuarios.map((usuario) => (
                <option key={usuario.id} value={usuario.id}>
                  {usuario.nome}
                </option>
              ))}
            </select>
          </label>

          <fieldset>
            <legend className="form-label fs-6">Prioridade:</legend>
            {OPCOES_PRIORIDADE.map((opcao) => (
              <div
                key={opcao}
                className="form-check form-check-inline"
              >
                <input
                  className="form-check-input"
                  type="radio"
                  name="editar-prioridade"
                  id={`editar-prioridade-${opcao}`}
                  checked={prioridade === opcao}
                  onChange={() => setPrioridade(opcao)}
                />
                <label
                  className="form-check-label"
                  htmlFor={`editar-prioridade-${opcao}`}
                >
                  {opcao}
                </label>
              </div>
            ))}
          </fieldset>

          <fieldset>
            <legend className="form-label fs-6">Recorrência:</legend>
            {OPCOES_RECORRENCIA.map((opcao) => (
              <div
                key={opcao}
                className="form-check form-check-inline"
              >
                <input
                  className="form-check-input"
                  type="radio"
                  name="editar-recorrencia"
                  id={`editar-recorrencia-${opcao}`}
                  checked={recorrencia === opcao}
                  onChange={() => setRecorrencia(opcao)}
                />
                <label
                  className="form-check-label"
                  htmlFor={`editar-recorrencia-${opcao}`}
                >
                  {opcao}
                </label>
              </div>
            ))}
          </fieldset>

          <fieldset>
            <legend className="form-label fs-6">Status:</legend>
            {OPCOES_STATUS.map((opcao) => (
              <div
                key={opcao}
                className="form-check form-check-inline"
              >
                <input
                  className="form-check-input"
                  type="radio"
                  name="editar-status"
                  id={`editar-status-${opcao}`}
                  checked={status === opcao}
                  onChange={() => setStatus(opcao)}
                />
                <label
                  className="form-check-label"
                  htmlFor={`editar-status-${opcao}`}
                >
                  {opcao}
                </label>
              </div>
            ))}
          </fieldset>

          <label>
            Observação:
            <textarea
              className="form-control"
              value={observacao}
              onChange={(event) => setObservacao(event.target.value)}
              rows={3}
            />
          </label>

          {erro && (
            <p className="text-danger mb-0" role="alert">
              {erro}
            </p>
          )}

          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-secondary"
              type="button"
              onClick={onFechar}
              disabled={enviando}
            >
              Fechar
            </button>

            <button
              className="btn btn-success"
              type="submit"
              disabled={enviando}
            >
              {enviando ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
