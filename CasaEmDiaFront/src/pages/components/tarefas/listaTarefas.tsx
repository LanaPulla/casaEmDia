import { useCallback, useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import CardTarefa from "./cardTarefas";
import EditarTarefaButton from "./editarTarefaButton";

import type {
  TarefaProps,
  UsuarioProps,
} from "../../../types/tarefas";

import {
  listarTarefas,
  atualizarTarefa,
  excluirTarefa,
  ErroHttp,
} from "../../../services/tarefas/tarefas";

interface ListaTarefasProps {
  dataSelecionada: Date;
  usuarios: UsuarioProps[];
  tarefas: TarefaProps[];
  setTarefas: Dispatch<SetStateAction<TarefaProps[]>>;
}

export default function ListaTarefas({
  dataSelecionada,
  usuarios,
  tarefas,
  setTarefas,
}: ListaTarefasProps) {
  const [tarefaEditando, setTarefaEditando] =
    useState<TarefaProps | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  const carregarTarefas = useCallback(async () => {
    setCarregando(true);
    setErro("");

    try {
      const dados = await listarTarefas();
      setTarefas(dados);
    } catch (error) {
      console.error(error);
      setErro("Não foi possível carregar as tarefas.");
    } finally {
      setCarregando(false);
    }
  }, [setTarefas]);

  useEffect(() => {
    void carregarTarefas();
  }, [carregarTarefas]);

  async function salvarEdicao(tarefaAtualizada: TarefaProps) {
    const salva = await atualizarTarefa(tarefaAtualizada);

    setTarefas((lista) =>
      lista.map((tarefa) => (tarefa.id === salva.id ? salva : tarefa))
    );

    setTarefaEditando(null);
    setErro("");
  }

  async function alternarConclusao(tarefa: TarefaProps) {
    setErro("");

    try {
      const salva = await atualizarTarefa({
        ...tarefa,
        status: tarefa.status === "Concluída" ? "Pendente" : "Concluída",
      });

      setTarefas((lista) =>
        lista.map((item) => (item.id === salva.id ? salva : item))
      );
    } catch (error) {
      console.error(error);
      setErro("Não foi possível atualizar o status.");
    }
  }

  async function removerTarefa(tarefa: TarefaProps) {
    const confirmou = window.confirm(
      `Desejas excluir a tarefa "${tarefa.titulo}"?`
    );

    if (!confirmou) return;

    setErro("");

    try {
      await excluirTarefa(tarefa.id);

      setTarefas((lista) =>
        lista.filter((item) => item.id !== tarefa.id)
      );

      if (tarefaEditando?.id === tarefa.id) {
        setTarefaEditando(null);
      }
    } catch (error) {
        if (error instanceof ErroHttp && error.status === 403) {
        setErro("Você não tem permissão para excluir a tarefa.");
        return;
      }

      setErro("Não foi possível excluir a tarefa.");
    }
  }

  if (carregando) {
    return <p>Carregando tarefas...</p>;
  }

  return (
    <>
      {erro && (
        <p className="text-danger" role="alert">
          {erro}
        </p>
      )}

      <CardTarefa
        dataSelecionada={dataSelecionada}
        tarefas={tarefas}
        onDetalhes={(tarefa) => setTarefaEditando(tarefa)}
        onExcluir={removerTarefa}
        onAlternarConclusao={alternarConclusao}
      />

      {tarefaEditando && (
        <EditarTarefaButton
          key={tarefaEditando.id}
          tarefa={tarefaEditando}
          usuarios={usuarios}
          onFechar={() => setTarefaEditando(null)}
          onSalvar={salvarEdicao}
        />
      )}
    </>
  );
}