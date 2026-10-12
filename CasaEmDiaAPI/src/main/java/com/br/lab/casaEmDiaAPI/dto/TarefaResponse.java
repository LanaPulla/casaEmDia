package com.br.lab.casaEmDiaAPI.dto;

import com.br.lab.casaEmDiaAPI.entities.Tarefa;
import com.br.lab.casaEmDiaAPI.entities.enums.PrioridadeEnum;
import com.br.lab.casaEmDiaAPI.entities.enums.RecorrenciaEnum;
import com.br.lab.casaEmDiaAPI.entities.enums.StatusEnum;

import java.time.LocalDate;

public record TarefaResponse(
        Long id,
        String titulo,
        Long responsavelId,
        String responsavelNome,
        PrioridadeEnum prioridade,
        RecorrenciaEnum recorrencia,
        StatusEnum status,
        String observacao,
        LocalDate dataTarefa
) {
    public static TarefaResponse de(Tarefa t) {
        return new TarefaResponse(
                t.getId(),
                t.getTitulo(),
                t.getResponsavel().getId(),
                t.getResponsavel().getNome(),
                t.getPrioridade(),
                t.getRecorrencia(),
                t.getStatus(),
                t.getObservacao(),
                t.getDataTarefa()
        );
    }
}