package com.br.lab.casaEmDiaAPI.service;

import com.br.lab.casaEmDiaAPI.dto.TarefaRequest;
import com.br.lab.casaEmDiaAPI.dto.TarefaResponse;
import com.br.lab.casaEmDiaAPI.entities.Tarefa;

import java.util.List;

public interface TarefaService {

    List<TarefaResponse> listarTodas();

    TarefaResponse buscarPorId(Long id);

    TarefaResponse atualizar(Long id, TarefaRequest request);

    void deletar(Long id);

    List<TarefaResponse> criarTarefa(TarefaRequest request);
}
