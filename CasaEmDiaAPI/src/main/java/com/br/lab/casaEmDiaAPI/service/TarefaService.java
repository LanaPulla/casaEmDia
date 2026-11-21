package com.br.lab.casaEmDiaAPI.service;

import com.br.lab.casaEmDiaAPI.dto.TarefaRequest;
import com.br.lab.casaEmDiaAPI.dto.TarefaResponse;

import java.util.List;

/**
 * Todas as operações recebem o id da família do usuário logado,
 * para que cada família veja e altere apenas as próprias tarefas.
 */
public interface TarefaService {

    List<TarefaResponse> listarTodas(Long familiaId);

    TarefaResponse buscarPorId(Long id, Long familiaId);

    TarefaResponse atualizar(Long id, TarefaRequest request, Long familiaId);

    void deletar(Long id, Long familiaId);

    List<TarefaResponse> criarTarefa(TarefaRequest request, Long familiaId);
}
