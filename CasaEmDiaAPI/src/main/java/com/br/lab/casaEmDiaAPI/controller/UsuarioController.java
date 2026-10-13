package com.br.lab.casaEmDiaAPI.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.br.lab.casaEmDiaAPI.dto.LoginRequest;
import com.br.lab.casaEmDiaAPI.dto.TrocarSenhaRequest;
import com.br.lab.casaEmDiaAPI.dto.UsuarioResponse;
import com.br.lab.casaEmDiaAPI.entities.Usuario;
import com.br.lab.casaEmDiaAPI.service.SessaoUsuarioService;
import com.br.lab.casaEmDiaAPI.service.UsuarioService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController{

    private final UsuarioService usuarioService;
    private final SessaoUsuarioService sessao;

    public UsuarioController(UsuarioService usuarioService, SessaoUsuarioService sessao) {
        this.usuarioService = usuarioService;
        this.sessao = sessao;
    }

    @PostMapping("/login")
    public UsuarioResponse login(@Valid @RequestBody LoginRequest request, HttpServletRequest http) {
        UsuarioResponse usuario = usuarioService.login(request);
        sessao.iniciar(http, usuario.id());
        return usuario;    
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(HttpServletRequest http) {
        sessao.encerrar(http);
    }
    
    @PostMapping("/trocar-senha")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void trocarSenha(@Valid @RequestBody TrocarSenhaRequest request, HttpServletRequest http) {
        Usuario usuario = sessao.usuarioLogado(http);
        usuarioService.trocarSenha(usuario.getId(), request);
    }
}