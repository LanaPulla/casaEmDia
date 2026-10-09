package com.br.lab.casaEmDiaAPI.dto;

import com.br.lab.casaEmDiaAPI.entities.Usuario;

public record UsuarioResponse(Long id, String nome, String email) {
    public static UsuarioResponse response(Usuario u) {
        return new UsuarioResponse(u.getId(), u.getNome(), u.getEmail());
    }
}
