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
    @Transactional(readOnly = true)
    public List<TarefaResponse> listarTodas() {
        return tarefaRepository.findAll().stream()
                .map(TarefaResponse::de)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TarefaResponse buscarPorId(Long id) {
        return TarefaResponse.de(buscarEntidade(id));
    }

    @Override
    @Transactional
    public TarefaResponse atualizar(Long id, TarefaRequest req) {
        Tarefa tarefa = buscarEntidade(id);
        Usuario responsavel = buscarResponsavel(req.responsavelId());

        tarefa.setTitulo(req.titulo());
        tarefa.setResponsavel(responsavel);
        tarefa.setPrioridade(req.prioridade());
        tarefa.setRecorrencia(req.recorrencia() != null
                ? req.recorrencia()
                : RecorrenciaEnum.NENHUMA);
        if (req.status() != null) {
            tarefa.setStatus(req.status());
        }
        tarefa.setObservacao(req.observacao());
        if (req.dataTarefa() != null) {
            tarefa.setDataTarefa(req.dataTarefa());
        }

        return TarefaResponse.de(tarefaRepository.save(tarefa));
    }

    @Override
    @Transactional
    public void deletar(Long id) {
        if (!tarefaRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Tarefa não encontrada");
        }
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

    private Tarefa buscarEntidade(Long id) {
        return tarefaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Tarefa não encontrada"));
    }

    private Usuario buscarResponsavel(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Responsável não encontrado"));
    }
}
