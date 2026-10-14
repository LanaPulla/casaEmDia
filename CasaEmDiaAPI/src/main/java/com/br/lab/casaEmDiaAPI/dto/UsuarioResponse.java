package com.br.lab.casaEmDiaAPI.dto;

import com.br.lab.casaEmDiaAPI.entities.Usuario;
import com.br.lab.casaEmDiaAPI.entities.Familia;

public record UsuarioResponse(Long id, String nome, String email, String familia) {

    public static UsuarioResponse from(Usuario u) {
        return from(u, u.getFamilia());
    }

    public static UsuarioResponse from(Usuario u, Familia familia) {
        String nomeFamilia = familia != null ? familia.getNome() : null;
        return new UsuarioResponse(u.getId(), u.getNome(), u.getEmail(), nomeFamilia);
    }

    public static UsuarioResponse response(Usuario u) {
        return from(u);
    }
}
