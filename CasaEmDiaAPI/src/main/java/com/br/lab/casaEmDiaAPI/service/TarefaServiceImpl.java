package com.br.lab.casaEmDiaAPI.service;

import com.br.lab.casaEmDiaAPI.dto.TarefaRequest;
import com.br.lab.casaEmDiaAPI.dto.TarefaResponse;
import com.br.lab.casaEmDiaAPI.entities.Tarefa;
import com.br.lab.casaEmDiaAPI.entities.Usuario;
import com.br.lab.casaEmDiaAPI.entities.enums.RecorrenciaEnum;
import com.br.lab.casaEmDiaAPI.entities.enums.StatusEnum;
import com.br.lab.casaEmDiaAPI.repository.TarefaRepository;
import com.br.lab.casaEmDiaAPI.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TarefaServiceImpl implements TarefaService {
    private final TarefaRepository tarefaRepository;
    private final UsuarioRepository usuarioRepository;

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

    @Override
    @Transactional
    public List<TarefaResponse> criarTarefa(TarefaRequest req) {
        Usuario responsavel = usuarioRepository.findById(req.responsavelId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Responsável não encontrado"));

        LocalDate inicio = req.dataTarefa() != null ? req.dataTarefa() : LocalDate.now();
        RecorrenciaEnum recorrencia = req.recorrencia() != null
                ? req.recorrencia()
                : RecorrenciaEnum.NENHUMA;

        List<Tarefa> ocorrencias = recorrencia.gerarDatas(inicio).stream()
                .map(data -> Tarefa.builder()
                        .titulo(req.titulo())
                        .responsavel(responsavel)
                        .prioridade(req.prioridade())
                        .recorrencia(recorrencia)
                        .status(StatusEnum.PENDENTE)
                        .observacao(req.observacao())
                        .dataTarefa(data)
                        .build())
                .toList();

        return tarefaRepository.saveAll(ocorrencias).stream()
                .map(TarefaResponse::de)
                .toList();
    }   
}
