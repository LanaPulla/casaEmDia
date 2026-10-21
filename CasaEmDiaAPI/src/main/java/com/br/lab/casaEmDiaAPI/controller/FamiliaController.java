package com.br.lab.casaEmDiaAPI.controller;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.br.lab.casaEmDiaAPI.dto.AtualizarFamiliaRequest;
import com.br.lab.casaEmDiaAPI.dto.AtualizarMembroRequest;
import com.br.lab.casaEmDiaAPI.dto.CadastroFamiliaRequest;
import com.br.lab.casaEmDiaAPI.dto.FamiliaResponse;
import com.br.lab.casaEmDiaAPI.dto.NovoMembroRequest;
import com.br.lab.casaEmDiaAPI.dto.RedefinirSenhaRequest;
import com.br.lab.casaEmDiaAPI.dto.UsuarioResponse;
import com.br.lab.casaEmDiaAPI.entities.Usuario;
import com.br.lab.casaEmDiaAPI.service.FamiliaService;
import com.br.lab.casaEmDiaAPI.service.SessaoUsuarioService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/familia")
public class FamiliaController {

    private final FamiliaService service;
    private final SessaoUsuarioService sessao;

    public FamiliaController(FamiliaService service, SessaoUsuarioService sessao) {
        this.service = service;
        this.sessao = sessao;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FamiliaResponse criar(@Valid @RequestBody CadastroFamiliaRequest request, HttpServletRequest http) {
        Usuario admin = service.cadastrar(request);
        sessao.iniciar(http, admin.getId());
        return service.detalhar(admin.getFamiliaId());
    }

    @GetMapping
    public FamiliaResponse detalhar(HttpServletRequest http) {
        Usuario usuario = sessao.exigirLogin(http);
        return service.detalhar(usuario.getFamiliaId());
    }

    @PutMapping
    @PreAuthorize("hasAuthority('GERENCIAR_FAMILIA')")
    public FamiliaResponse renomear(@Valid @RequestBody AtualizarFamiliaRequest request, HttpServletRequest http) {
        Usuario admin = sessao.exigirAdmin(http);
        return service.renomear(admin.getFamiliaId(), request);
    }

    @PostMapping("/membros")
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('GERENCIAR_FAMILIA')")
    public UsuarioResponse adicionarMembro(@Valid @RequestBody NovoMembroRequest request, HttpServletRequest http) {
        return service.adicionarMembro(sessao.exigirAdmin(http), request);
    }

    @PutMapping("/membros/{id}")
    @PreAuthorize("hasAuthority('GERENCIAR_FAMILIA')")
    public UsuarioResponse atualizarMembro(@PathVariable Long id,
            @Valid @RequestBody AtualizarMembroRequest request,
            HttpServletRequest http) {
        return service.atualizarMembro(sessao.exigirAdmin(http), id, request);
    }

    @DeleteMapping("/membros/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAuthority('GERENCIAR_FAMILIA')")
    public void desativarMembro(@PathVariable Long id, HttpServletRequest http) {
        service.desativarMembro(sessao.exigirAdmin(http), id);
    }

    @PostMapping("/membros/{id}/senha")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void redefinirSenha(@PathVariable Long id,
            @Valid @RequestBody RedefinirSenhaRequest request,
            HttpServletRequest http) {
        service.redefinirSenha(sessao.exigirAdmin(http), id, request);
    }
}
