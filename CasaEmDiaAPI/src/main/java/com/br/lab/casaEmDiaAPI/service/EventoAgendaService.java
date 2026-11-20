package com.br.lab.casaEmDiaAPI.service;

import com.br.lab.casaEmDiaAPI.dto.EventoAgendaRequest;
import com.br.lab.casaEmDiaAPI.dto.EventoAgendaResponse;

import java.util.List;

public interface EventoAgendaService {
    List<EventoAgendaResponse> listarPorUsuario(Long usuarioId);
    EventoAgendaResponse criar(EventoAgendaRequest request);
    EventoAgendaResponse atualizar(Long id, EventoAgendaRequest request);
    void deletar(Long id);
}