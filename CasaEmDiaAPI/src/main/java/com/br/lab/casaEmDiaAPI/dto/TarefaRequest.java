package com.br.lab.casaEmDiaAPI.dto;

import com.br.lab.casaEmDiaAPI.entities.enums.PrioridadeEnum;
import com.br.lab.casaEmDiaAPI.entities.enums.RecorrenciaEnum;
import com.br.lab.casaEmDiaAPI.entities.enums.StatusEnum;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record TarefaRequest(
        @NotBlank @Size(max = 100)
        String titulo,

        @NotNull
        Long responsavelId,

        @NotNull
        PrioridadeEnum prioridade,

        @NotNull
        RecorrenciaEnum recorrencia,   // se vier null, o service usa NENHUMA

        @NotNull
        StatusEnum status,

        @Size(max = 500)
        String observacao,

        LocalDate dataTarefa         // se vier null, o service usa hoje
) {}