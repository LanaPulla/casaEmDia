package com.br.lab.casaEmDiaAPI.entities.enums;

public enum PrioridadeEnum {
    BAIXA("Baixa"), MEDIA("Média"), ALTA("Alta");

    private final String label;

    PrioridadeEnum(String label) { this.label = label; }

    @JsonValue
    public String getLabel() { return label; }
}