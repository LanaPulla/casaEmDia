package com.br.lab.casaEmDiaAPI.controller;

import com.br.lab.casaEmDiaAPI.dto.EventoAgendaRequest;
import com.br.lab.casaEmDiaAPI.dto.EventoAgendaResponse;
import com.br.lab.casaEmDiaAPI.service.EventoAgendaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agenda")
public class EventoAgendaController {

    private final EventoAgendaService agendaService;

    public EventoAgendaController(EventoAgendaService agendaService) {
        this.agendaService = agendaService;
    }

    @GetMapping
    public ResponseEntity<List<EventoAgendaResponse>> listarTodos() {
        return ResponseEntity.ok(agendaService.listarTodos());
    }

    @PostMapping
    public ResponseEntity<EventoAgendaResponse> criar(@RequestBody EventoAgendaRequest request) {
        return ResponseEntity.ok(agendaService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventoAgendaResponse> atualizar(@PathVariable Long id, @RequestBody EventoAgendaRequest request) {
        return ResponseEntity.ok(agendaService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        agendaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}