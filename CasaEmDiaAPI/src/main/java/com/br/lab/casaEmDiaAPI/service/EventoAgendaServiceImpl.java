package com.br.lab.casaEmDiaAPI.service;

import com.br.lab.casaEmDiaAPI.dto.EventoAgendaRequest;
import com.br.lab.casaEmDiaAPI.dto.EventoAgendaResponse;
import com.br.lab.casaEmDiaAPI.entities.EventoAgenda;
import com.br.lab.casaEmDiaAPI.entities.Usuario;
import com.br.lab.casaEmDiaAPI.repository.EventoAgendaRepository;
import com.br.lab.casaEmDiaAPI.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventoAgendaServiceImpl implements EventoAgendaService {

    private final EventoAgendaRepository eventoRepository;
    private final UsuarioRepository usuarioRepository;

    @Override
    public List<EventoAgendaResponse> listarTodos() {
        return eventoRepository.findAll().stream()
                .map(EventoAgendaResponse::fromEntity)
                .toList();
    }

    @Override
    public EventoAgendaResponse criar(EventoAgendaRequest req) {
        Usuario membro = null;
        if (req.membroId() != null) {
            membro = usuarioRepository.findById(req.membroId())
                    .orElseThrow(() -> new RuntimeException("Membro não encontrado"));
        }

        EventoAgenda evento = EventoAgenda.builder()
                .titulo(req.titulo())
                .descricao(req.descricao())
                .dataEvento(req.dataEvento())
                .horarioInicio(req.horarioInicio())
                .horarioFim(req.horarioFim())
                .local(req.local())
                .categoria(req.categoria())
                .membro(membro)
                .build();

        return EventoAgendaResponse.fromEntity(eventoRepository.save(evento));
    }

    @Override
    public EventoAgendaResponse atualizar(Long id, EventoAgendaRequest req) {
        EventoAgenda evento = eventoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Evento não encontrado"));

        Usuario membro = null;
        if (req.membroId() != null) {
            membro = usuarioRepository.findById(req.membroId())
                    .orElseThrow(() -> new RuntimeException("Membro não encontrado"));
        }

        evento.setTitulo(req.titulo());
        evento.setDescricao(req.descricao());
        evento.setDataEvento(req.dataEvento());
        evento.setHorarioInicio(req.horarioInicio());
        evento.setHorarioFim(req.horarioFim());
        evento.setLocal(req.local());
        evento.setCategoria(req.categoria());
        evento.setMembro(membro);

        return EventoAgendaResponse.fromEntity(eventoRepository.save(evento));
    }

    @Override
    public void deletar(Long id) {
        eventoRepository.deleteById(id);
    }
}