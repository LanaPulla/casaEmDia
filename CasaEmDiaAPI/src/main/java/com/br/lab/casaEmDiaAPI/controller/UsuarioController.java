package com.br.lab.casaEmDiaAPI.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.br.lab.casaEmDiaAPI.dto.CadastroRequest;
import com.br.lab.casaEmDiaAPI.dto.LoginRequest;
import com.br.lab.casaEmDiaAPI.dto.UsuarioResponse;
import com.br.lab.casaEmDiaAPI.exception.CredenciaisInvalidasException;
import com.br.lab.casaEmDiaAPI.service.UsuarioService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/usuario")
public class UsuarioController{

    private static final String USUARIO_ID = "usuarioId";
    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/cadastro")
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioResponse cadastrar(@Valid @RequestBody CadastroRequest request) {
        return usuarioService.cadastrar(request);
    }

    @PostMapping("/login")
    public UsuarioResponse login(@Valid @RequestBody LoginRequest request, HttpServletRequest http) {
        UsuarioResponse usuario = usuarioService.login(request);
        http.getSession(true).setAttribute(USUARIO_ID, usuario.id());
        return usuario;
    }

    @org.springframework.web.bind.annotation.GetMapping("/me")
    public UsuarioResponse usuarioAtual(HttpServletRequest http) {
        HttpSession sessao = http.getSession(false);
        if (sessao == null || sessao.getAttribute(USUARIO_ID) == null) {
            throw new CredenciaisInvalidasException();
        }
        return usuarioService.buscarPorId((Long) sessao.getAttribute(USUARIO_ID));
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(HttpServletRequest http) {
        HttpSession sessao = http.getSession(false);
        if (sessao != null) {
            sessao.invalidate();
        }
    }
}