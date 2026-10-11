
"use client";

import { useCallback, useEffect, useState } from "react";

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

interface ListaTarefasProps {
  dataSelecionada: Date;
  usuarios: UsuarioProps[];
}

export default function ListaTarefas({
  dataSelecionada,
  usuarios,
}: ListaTarefasProps) {
  const [tarefas, setTarefas] = useState<TarefaProps[]>([]);
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
  }, []);

  useEffect(() => {
    void carregarTarefas();
  }, [carregarTarefas]);

  async function salvarEdicao(tarefaAtualizada: TarefaProps) {
    await atualizarTarefa(tarefaAtualizada);

    setTarefas((lista) =>
      lista.map((tarefa) =>
        tarefa.id === tarefaAtualizada.id
          ? tarefaAtualizada
          : tarefa
      )
    );

    setTarefaEditando(null);
    setErro("");
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
      console.error(error);
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
