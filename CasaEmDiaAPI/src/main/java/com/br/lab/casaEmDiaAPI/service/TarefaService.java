package com.br.lab.casaEmDiaAPI.service;

import com.br.lab.casaEmDiaAPI.entities.Tarefa;

import java.util.List;

public interface TarefaService {

    List<Tarefa> listarTodas();

    Tarefa buscarPorId(Long id);

    Tarefa atualizar(Long id, Tarefa tarefaAtualizar);

    void deletar(Long id);
}
