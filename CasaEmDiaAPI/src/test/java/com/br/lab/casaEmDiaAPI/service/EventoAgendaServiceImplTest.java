package com.br.lab.casaEmDiaAPI.service;

import com.br.lab.casaEmDiaAPI.dto.EventoAgendaRequest;
import com.br.lab.casaEmDiaAPI.dto.EventoAgendaResponse;
import com.br.lab.casaEmDiaAPI.entities.EventoAgenda;
import com.br.lab.casaEmDiaAPI.entities.Usuario;
import com.br.lab.casaEmDiaAPI.entities.enums.CategoriaAgendaEnum;
import com.br.lab.casaEmDiaAPI.repository.EventoAgendaRepository;
import com.br.lab.casaEmDiaAPI.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EventoAgendaServiceImplTest {

    @Mock
    private EventoAgendaRepository eventoRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private EventoAgendaServiceImpl eventoService;

    private Usuario criarUsuarioComFamilia(Long usuarioId, Long familiaId) {
        Usuario usuario = mock(Usuario.class, RETURNS_DEEP_STUBS);
        lenient().when(usuario.getId()).thenReturn(usuarioId);
        lenient().when(usuario.getFamiliaId()).thenReturn(familiaId);
        lenient().when(usuario.getFamilia().getId()).thenReturn(familiaId);
        return usuario;
    }

    @Test
    void deveListarApenasEventosDaFamiliaDoUsuario() {
        Usuario usuario = criarUsuarioComFamilia(16L, 5L);

        EventoAgenda eventoFamilia = new EventoAgenda();
        eventoFamilia.setId(1L);
        eventoFamilia.setTitulo("Almoço em Família");
        eventoFamilia.setDataEvento(LocalDate.of(2026, 11, 25));
        eventoFamilia.setCategoria(CategoriaAgendaEnum.FAMILIA);
        eventoFamilia.setFamiliaId(5L);

        when(usuarioRepository.findById(16L)).thenReturn(Optional.of(usuario));
        when(eventoRepository.findByFamiliaId(5L)).thenReturn(List.of(eventoFamilia));

        List<EventoAgendaResponse> resultado = eventoService.listarPorUsuario(16L);

        assertEquals(1, resultado.size());
        assertEquals(5L, resultado.get(0).familiaId());
        assertEquals("Almoço em Família", resultado.get(0).titulo());
        verify(eventoRepository, times(1)).findByFamiliaId(5L);
        verify(eventoRepository, never()).findAll();
    }

    @Test
    void deveCriarEventoVinculadoAFamiliaDoUsuario() {
        Usuario usuario = criarUsuarioComFamilia(16L, 5L);

        EventoAgendaRequest request = new EventoAgendaRequest(
                "Consulta Pediatra",
                "Rotina semestral",
                LocalDate.of(2026, 11, 25),
                LocalTime.of(14, 0),
                LocalTime.of(15, 0),
                "Clínica Central",
                CategoriaAgendaEnum.CONSULTA,
                16L
        );

        EventoAgenda salvo = new EventoAgenda();
        salvo.setId(10L);
        salvo.setTitulo(request.titulo());
        salvo.setDataEvento(request.dataEvento());
        salvo.setCategoria(request.categoria());
        salvo.setFamiliaId(5L);

        when(usuarioRepository.findById(16L)).thenReturn(Optional.of(usuario));
        when(eventoRepository.save(any(EventoAgenda.class))).thenReturn(salvo);

        EventoAgendaResponse response = eventoService.criar(request);

        assertNotNull(response);
        assertEquals(10L, response.id());
        assertEquals(5L, response.familiaId());
        assertEquals("Consulta Pediatra", response.titulo());
        verify(eventoRepository, times(1)).save(any(EventoAgenda.class));
    }

    @Test
    void deveAtualizarEventoExistenteComSucesso() {
        Usuario usuario = criarUsuarioComFamilia(16L, 5L);

        EventoAgenda existente = new EventoAgenda();
        existente.setId(10L);
        existente.setTitulo("Antigo");
        existente.setFamiliaId(5L);

        EventoAgendaRequest request = new EventoAgendaRequest(
                "Consulta Atualizada",
                null,
                LocalDate.of(2026, 11, 26),
                null,
                null,
                "Hospital",
                CategoriaAgendaEnum.CONSULTA,
                16L
        );

        when(usuarioRepository.findById(16L)).thenReturn(Optional.of(usuario));
        when(eventoRepository.findById(10L)).thenReturn(Optional.of(existente));
        when(eventoRepository.save(any(EventoAgenda.class))).thenReturn(existente);

        EventoAgendaResponse response = eventoService.atualizar(10L, request);

        assertEquals("Consulta Atualizada", response.titulo());
        verify(eventoRepository).save(existente);
    }
    
    @Test
    void deveLancarExcecaoAoAtualizarEventoInexistente() {
        when(eventoRepository.findById(9999L)).thenReturn(Optional.empty());

        EventoAgendaRequest request = new EventoAgendaRequest(
                "Teste", null, LocalDate.now(), null, null, null, CategoriaAgendaEnum.OUTROS, 16L
        );

        assertThrows(RuntimeException.class, () -> eventoService.atualizar(9999L, request));
    }
}