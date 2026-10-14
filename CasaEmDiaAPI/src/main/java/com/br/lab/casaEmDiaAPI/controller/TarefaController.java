package com.br.lab.casaEmDiaAPI.controller;

import org.springframework.http.HttpStatus;
import com.br.lab.casaEmDiaAPI.dto.TarefaRequest;
import com.br.lab.casaEmDiaAPI.dto.TarefaResponse;
import com.br.lab.casaEmDiaAPI.entities.Tarefa;
import com.br.lab.casaEmDiaAPI.service.TarefaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tarefas")
@Slf4j
@RequiredArgsConstructor
public class TarefaController {

    public final TarefaService tarefaService;

    @GetMapping
    public ResponseEntity<List<TarefaResponse>> listarTodas() {
        return ResponseEntity.ok(tarefaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TarefaResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(tarefaService.buscarPorId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TarefaResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody TarefaRequest request) {
        return ResponseEntity.ok(tarefaService.atualizar(id, request));
    }

    @PreAuthorize("hasAuthority('DELETAR_TAREFA')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        tarefaService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<List<TarefaResponse>> cadastrarTarefa(
            @Valid @RequestBody TarefaRequest request) {

        List<TarefaResponse> tarefasCriadas = tarefaService.criarTarefa(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(tarefasCriadas);
    }
}
