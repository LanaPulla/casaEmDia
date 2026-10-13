package com.br.lab.casaEmDiaAPI.dto;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CadastroFamiliaRequest(
        @NotBlank(message = "O nome da família é obrigatório")
        @Size(max = 120, message = "O nome da família deve ter no máximo 120 caracteres")
        String nomeFamilia,

        @NotBlank(message = "O nome do responsável é obrigatório")
        @Size(max = 120, message = "O nome deve ter no máximo 120 caracteres")
        String nomeResponsavel,

        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "E-mail inválido")
        String email,

        @NotBlank(message = "A senha é obrigatória")
        @Size(min = 8, max = 72, message = "A senha deve ter entre 8 e 72 caracteres")
        String senha,

        @Valid
        List<NovoMembroRequest> membros
) {}
