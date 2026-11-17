package com.br.lab.casaEmDiaAPI.dto;

import com.br.lab.casaEmDiaAPI.entities.enums.PrioridadeEnum;
import com.br.lab.casaEmDiaAPI.entities.enums.RecorrenciaEnum;
import com.br.lab.casaEmDiaAPI.entities.enums.StatusEnum;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record TarefaRequest(
        @NotBlank(message = "O título da tarefa é obrigatório")
        @Size(max = 100, message = "O título deve ter no máximo 100 caracteres")
        String titulo,

        @NotNull(message = "O responsável é obrigatório")
        Long responsavelId,

        @NotNull(message = "A prioridade é obrigatória")
        PrioridadeEnum prioridade,

        @NotNull(message = "A recorrência é obrigatória")
        RecorrenciaEnum recorrencia,

        @NotNull(message = "O status é obrigatório")
        StatusEnum status,

        @Size(max = 500, message = "A observação deve ter no máximo 500 caracteres")
        String observacao,

        LocalDate dataTarefa         // se vier null, o service usa hoje
) {}
