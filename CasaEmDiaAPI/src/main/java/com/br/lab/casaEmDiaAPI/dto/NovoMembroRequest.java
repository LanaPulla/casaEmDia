package com.br.lab.casaEmDiaAPI.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import com.br.lab.casaEmDiaAPI.entities.enums.PerfilFamiliaEnum;

public record NovoMembroRequest(
        @NotBlank(message = "O nome é obrigatório")
        @Size(max = 120, message = "O nome deve ter no máximo 120 caracteres")
        String nome,

        @NotBlank(message = "O e-mail é obrigatório")
        @Email(message = "E-mail inválido")
        String email,

        @NotBlank(message = "A senha inicial é obrigatória")
        @Size(min = 8, max = 72, message = "A senha deve ter entre 8 e 72 caracteres")
        String senhaInicial,

        @NotNull(message = "O perfil é obrigatório")
        PerfilFamiliaEnum perfil,

        @Size(max = 40, message = "O parentesco deve ter no máximo 40 caracteres")
        String parentesco
) {}
