package com.br.lab.casaEmDiaAPI.service;

import com.br.lab.casaEmDiaAPI.dto.EventoAgendaRequest;
import com.br.lab.casaEmDiaAPI.dto.EventoAgendaResponse;
import com.br.lab.casaEmDiaAPI.entities.EventoAgenda;
import com.br.lab.casaEmDiaAPI.entities.Usuario;
import com.br.lab.casaEmDiaAPI.repository.EventoAgendaRepository;
import com.br.lab.casaEmDiaAPI.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class EventoAgendaServiceImpl implements EventoAgendaService {

    private final EventoAgendaRepository eventoRepository;
    private final UsuarioRepository usuarioRepository;

    public EventoAgendaServiceImpl(EventoAgendaRepository eventoRepository, UsuarioRepository usuarioRepository) {
        this.eventoRepository = eventoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public List<EventoAgendaResponse> listarPorUsuario(Long usuarioId) {
        Long familiaId = obterFamiliaIdDoUsuario(usuarioId);
        return eventoRepository.findByFamiliaId(familiaId).stream()
                .map(EventoAgendaResponse::fromEntity)
                .toList();
    }

    @Override
    public EventoAgendaResponse criar(EventoAgendaRequest req) {
        Long familiaId = obterFamiliaIdDoUsuario(req.usuarioId());

        EventoAgenda evento = new EventoAgenda();
        evento.setTitulo(req.titulo());
        evento.setDescricao(req.descricao());
        evento.setDataEvento(req.dataEvento());
        evento.setHorarioInicio(req.horarioInicio());
        evento.setHorarioFim(req.horarioFim());
        evento.setLocal(req.local());
        evento.setCategoria(req.categoria());
        evento.setFamiliaId(familiaId);

        return EventoAgendaResponse.fromEntity(eventoRepository.save(evento));
    }

    @Override
    public EventoAgendaResponse atualizar(Long id, EventoAgendaRequest req) {
        EventoAgenda evento = eventoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento não encontrado"));

        if (req.usuarioId() != null) {
            Long familiaId = obterFamiliaIdDoUsuario(req.usuarioId());
            if (!familiaId.equals(evento.getFamiliaId())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem permissão para editar eventos de outra família");
            }
        }

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
    public void deletar(Long id, Long familiaId) {
        EventoAgenda evento = eventoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Evento não encontrado"));

        if (!evento.getFamiliaId().equals(familiaId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Você não tem permissão para excluir eventos de outra família");
        }
        eventoRepository.delete(evento);
    }

    private Long obterFamiliaIdDoUsuario(Long usuarioId) {
        if (usuarioId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID do usuário é obrigatório");
        }
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));

        if (usuario.getFamilia() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Usuário não está vinculado a nenhuma família");
        }
        return usuario.getFamilia().getId();
    }
}