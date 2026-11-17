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
} from "../../../services/tarefas/tarefas";
import { exibirErro } from "../../../services/api/erroApi";

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

  const carregarTarefas = useCallback(async () => {
    setCarregando(true);

    try {
      const dados = await listarTarefas();
      setTarefas(dados);
    } catch (error) {
      exibirErro(error, "Não foi possível carregar as tarefas.");
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
  }

  async function alternarConclusao(tarefa: TarefaProps) {
    try {
      const salva = await atualizarTarefa({
        ...tarefa,
        status: tarefa.status === "Concluída" ? "Pendente" : "Concluída",
      });

      setTarefas((lista) =>
        lista.map((item) => (item.id === salva.id ? salva : item))
      );
    } catch (error) {
      exibirErro(error, "Não foi possível atualizar o status.");
    }
  }

  async function removerTarefa(tarefa: TarefaProps) {
    const confirmou = window.confirm(
      `Desejas excluir a tarefa "${tarefa.titulo}"?`
    );

    if (!confirmou) return;

    try {
      await excluirTarefa(tarefa.id);

      setTarefas((lista) =>
        lista.filter((item) => item.id !== tarefa.id)
      );

      if (tarefaEditando?.id === tarefa.id) {
        setTarefaEditando(null);
      }
    } catch (error) {
      exibirErro(error, "Não foi possível excluir a tarefa.");
    }
  }

  if (carregando) {
    return <p>Carregando tarefas...</p>;
  }

  return (
    <>
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