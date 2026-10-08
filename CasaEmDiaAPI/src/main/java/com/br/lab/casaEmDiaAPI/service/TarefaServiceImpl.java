package com.br.lab.casaEmDiaAPI.service;

import com.br.lab.casaEmDiaAPI.entities.Tarefa;
import com.br.lab.casaEmDiaAPI.repository.TarefaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TarefaServiceImpl implements TarefaService {

    private final TarefaRepository tarefaRepository;

    @Override
    public List<Tarefa> listarTodas() {
        return tarefaRepository.findAll();
    }

    @Override
    public Tarefa buscarPorId(Long id) {
        return tarefaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));
    }

    @Override
    public Tarefa atualizar(Long id, Tarefa tarefaAtualizar) {
        Tarefa tarefa = buscarPorId(id);
        tarefa.setTitulo(tarefaAtualizar.getTitulo());
        tarefa.setResponsavel(tarefaAtualizar.getResponsavel());
        tarefa.setPrioridade(tarefaAtualizar.getPrioridade());
        tarefa.setRecorrencia(tarefaAtualizar.getRecorrencia());
        tarefa.setStatus(tarefaAtualizar.getStatus());
        tarefa.setObservacao(tarefaAtualizar.getObservacao());
        tarefa.setDataTarefa(tarefaAtualizar.getDataTarefa());
        return tarefaRepository.save(tarefa);
    }

    @Override
    public void deletar(Long id) {
        tarefaRepository.deleteById(id);
    }
}
