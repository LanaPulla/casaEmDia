package com.br.lab.casaEmDiaAPI.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AtualizarFamiliaRequest(
    @NotBlank(message = "O nome da família é obrigatório")
    @Size(max = 120, message = "O nome da família deve ter no máximo 120 caracteres")
    String nomeFamilia
) {
}
