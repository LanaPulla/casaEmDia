package com.br.lab.casaEmDiaAPI.entities.enums;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.IntStream;

import com.fasterxml.jackson.annotation.JsonValue;

public enum RecorrenciaEnum {
    NENHUMA("Nenhuma", 1, ChronoUnit.DAYS),
    DIARIA("Diária", 30, ChronoUnit.DAYS),
    SEMANAL("Semanal", 4, ChronoUnit.WEEKS),
    MENSAL("Mensal", 3, ChronoUnit.MONTHS);

    private final String label;
    private final int quantidade;
    private final ChronoUnit unidade;

    RecorrenciaEnum(String label, int quantidade, ChronoUnit unidade) {
        this.label = label;
        this.quantidade = quantidade;
        this.unidade = unidade;
    }

    @JsonValue
    public String getLabel() { return label; }

    public List<LocalDate> gerarDatas(LocalDate inicio) {
        return IntStream.range(0, quantidade)
                .mapToObj(i -> inicio.plus(i, unidade))
                .toList();
    }
}
