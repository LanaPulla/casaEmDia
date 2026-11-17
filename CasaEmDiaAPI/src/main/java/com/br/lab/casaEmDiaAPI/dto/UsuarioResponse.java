package com.br.lab.casaEmDiaAPI.dto;

import com.br.lab.casaEmDiaAPI.entities.Usuario;
import com.br.lab.casaEmDiaAPI.entities.Familia;
import com.br.lab.casaEmDiaAPI.entities.Perfil;

public record UsuarioResponse(Long id, String nome, Perfil perfil, String email, String familia,
        boolean senhaProvisoria) {

    public static UsuarioResponse from(Usuario u) {
        return from(u, u.getFamilia());
    }

    public static UsuarioResponse from(Usuario u, Familia familia) {
        String nomeFamilia = familia != null ? familia.getNome() : null;
        return new UsuarioResponse(u.getId(), u.getNome(), u.getPerfil(), u.getEmail(), nomeFamilia,
                u.isSenhaProvisoria());
    }

    public static UsuarioResponse response(Usuario u) {
        return from(u);
    }
}
