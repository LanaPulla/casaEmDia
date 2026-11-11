package com.br.lab.casaEmDiaAPI.dto;

import com.br.lab.casaEmDiaAPI.entities.EventoAgenda;
import com.br.lab.casaEmDiaAPI.entities.enums.CategoriaAgendaEnum;
import java.time.LocalDate;
import java.time.LocalTime;

public record EventoAgendaResponse(
    Long id,
    String titulo,
    String descricao,
    LocalDate dataEvento,
    LocalTime horarioInicio,
    LocalTime horarioFim,
    String local,
    CategoriaAgendaEnum categoria,
    Long membroId
) {
    public static EventoAgendaResponse fromEntity(EventoAgenda e) {
        return new EventoAgendaResponse(
            e.getId(),
            e.getTitulo(),
            e.getDescricao(),
            e.getDataEvento(),
            e.getHorarioInicio(),
            e.getHorarioFim(),
            e.getLocal(),
            e.getCategoria(),
            e.getMembro() != null ? e.getMembro().getId() : null
        );
    }
}