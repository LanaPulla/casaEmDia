package com.br.lab.casaEmDiaAPI.controller;

import org.springframework.http.HttpStatus;
import com.br.lab.casaEmDiaAPI.dto.TarefaRequest;
import com.br.lab.casaEmDiaAPI.dto.TarefaResponse;
import com.br.lab.casaEmDiaAPI.service.SessaoUsuarioService;
import com.br.lab.casaEmDiaAPI.service.TarefaService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Todas as rotas exigem login e trabalham apenas com as tarefas
 * da família do usuário logado.
 */
@RestController
@RequestMapping("/tarefas")
@Slf4j
@RequiredArgsConstructor
public class TarefaController {

    public final TarefaService tarefaService;
    private final SessaoUsuarioService sessao;

    @GetMapping
    public ResponseEntity<List<TarefaResponse>> listarTodas(HttpServletRequest http) {
        return ResponseEntity.ok(tarefaService.listarTodas(familiaDoUsuario(http)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TarefaResponse> buscarPorId(@PathVariable Long id, HttpServletRequest http) {
        return ResponseEntity.ok(tarefaService.buscarPorId(id, familiaDoUsuario(http)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TarefaResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody TarefaRequest request,
            HttpServletRequest http) {
        return ResponseEntity.ok(tarefaService.atualizar(id, request, familiaDoUsuario(http)));
    }

    @PreAuthorize("hasAuthority('DELETAR_TAREFA')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id, HttpServletRequest http) {
        tarefaService.deletar(id, familiaDoUsuario(http));
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasAuthority('CRIAR_TAREFA')")
    @PostMapping
    public ResponseEntity<List<TarefaResponse>> cadastrarTarefa(
            @Valid @RequestBody TarefaRequest request,
            HttpServletRequest http) {

        List<TarefaResponse> tarefasCriadas = tarefaService.criarTarefa(request, familiaDoUsuario(http));

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(tarefasCriadas);
    }

    /** Exige login (e senha definitiva) e devolve o id da família do usuário. */
    private Long familiaDoUsuario(HttpServletRequest http) {
        return sessao.exigirLogin(http).getFamiliaId();
    }
}
