package com.br.lab.casaEmDiaAPI.service;

import com.br.lab.casaEmDiaAPI.dto.EventoAgendaRequest;
import com.br.lab.casaEmDiaAPI.dto.EventoAgendaResponse;
import com.br.lab.casaEmDiaAPI.entities.EventoAgenda;
import com.br.lab.casaEmDiaAPI.repository.EventoAgendaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class EventoAgendaServiceImpl implements EventoAgendaService {

    private final EventoAgendaRepository eventoRepository;

    public EventoAgendaServiceImpl(EventoAgendaRepository eventoRepository) {
        this.eventoRepository = eventoRepository;
    }

    @Override
    public List<EventoAgendaResponse> listarTodos() {
        return eventoRepository.findAll().stream()
                .map(EventoAgendaResponse::fromEntity)
                .toList();
    }

    @Override
    public EventoAgendaResponse criar(EventoAgendaRequest req) {
        EventoAgenda evento = new EventoAgenda();
        evento.setTitulo(req.titulo());
        evento.setDescricao(req.descricao());
        evento.setDataEvento(req.dataEvento());
        evento.setHorarioInicio(req.horarioInicio());
        evento.setHorarioFim(req.horarioFim());
        evento.setLocal(req.local());
        evento.setCategoria(req.categoria());

        return EventoAgendaResponse.fromEntity(eventoRepository.save(evento));
    }

    @Override
    public EventoAgendaResponse atualizar(Long id, EventoAgendaRequest req) {
        EventoAgenda evento = eventoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento não encontrado"));

        evento.setTitulo(req.titulo());
        evento.setDescricao(req.descricao());
        evento.setDataEvento(req.dataEvento());
        evento.setHorarioInicio(req.horarioInicio());
        evento.setHorarioFim(req.horarioFim());
        evento.setLocal(req.local());
        evento.setCategoria(req.categoria());

        return EventoAgendaResponse.fromEntity(eventoRepository.save(evento));
    }

    @Override
    public void deletar(Long id) {
        if (!eventoRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento não encontrado");
        }
        eventoRepository.deleteById(id);
    }
}