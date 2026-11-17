package com.br.lab.casaEmDiaAPI.dto;

import com.br.lab.casaEmDiaAPI.entities.enums.CategoriaAgendaEnum;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;
import java.time.LocalTime;

public record EventoAgendaRequest(
    String titulo,
    String descricao,

    @JsonFormat(pattern = "yyyy-MM-dd")
    LocalDate dataEvento,

    @JsonFormat(pattern = "HH:mm")
    LocalTime horarioInicio,

    @JsonFormat(pattern = "HH:mm")
    LocalTime horarioFim,

    String local,
    CategoriaAgendaEnum categoria,
    Long membroId
) {}