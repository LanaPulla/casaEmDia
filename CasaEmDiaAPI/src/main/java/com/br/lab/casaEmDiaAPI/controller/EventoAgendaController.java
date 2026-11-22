package com.br.lab.casaEmDiaAPI.controller;

import com.br.lab.casaEmDiaAPI.dto.EventoAgendaRequest;
import com.br.lab.casaEmDiaAPI.dto.EventoAgendaResponse;
import com.br.lab.casaEmDiaAPI.service.EventoAgendaService;
import com.br.lab.casaEmDiaAPI.service.SessaoUsuarioService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agenda")
public class EventoAgendaController {

    private final EventoAgendaService agendaService;
    private final SessaoUsuarioService sessao;

    public EventoAgendaController(EventoAgendaService agendaService, SessaoUsuarioService sessao) {
        this.agendaService = agendaService;
        this.sessao = sessao;
    }

    @GetMapping
    public ResponseEntity<List<EventoAgendaResponse>> listarPorFamilia(@RequestParam Long usuarioId) {
        return ResponseEntity.ok(agendaService.listarPorUsuario(usuarioId));
    }

    @PostMapping
    public ResponseEntity<EventoAgendaResponse> criar(@RequestBody EventoAgendaRequest request) {
        return ResponseEntity.ok(agendaService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventoAgendaResponse> atualizar(@PathVariable Long id, @RequestBody EventoAgendaRequest request) {
        return ResponseEntity.ok(agendaService.atualizar(id, request));
    }

    @PreAuthorize("hasAuthority('DELETAR_EVENTO')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id, HttpServletRequest http) {
        agendaService.deletar(id, sessao.exigirLogin(http).getFamiliaId());
        return ResponseEntity.noContent().build();
    }
}