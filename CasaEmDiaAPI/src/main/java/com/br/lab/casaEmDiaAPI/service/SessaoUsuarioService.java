package com.br.lab.casaEmDiaAPI.service;

import org.springframework.stereotype.Component;

import com.br.lab.casaEmDiaAPI.entities.Usuario;
import com.br.lab.casaEmDiaAPI.exception.AcessoNegadoException;
import com.br.lab.casaEmDiaAPI.exception.NaoAutenticadoException;
import com.br.lab.casaEmDiaAPI.repository.UsuarioRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;

@Component
public class SessaoUsuarioService {
       private static final String ATRIBUTO = "usuarioId";

    private final UsuarioRepository repository;

    public SessaoUsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public void iniciar(HttpServletRequest http, Long usuarioId) {
        http.getSession(true);
        http.changeSessionId(); 
        http.getSession().setAttribute(ATRIBUTO, usuarioId);

        Usuario usuario = repository.findById(usuarioId)
                .filter(Usuario::isAtivo)
                .orElseThrow(NaoAutenticadoException::new);

        var authorities = usuario.getPerfil().getPermissoes().stream()
                .map(permissao -> new SimpleGrantedAuthority(permissao.getNome()))
                .toList();
        var authentication = UsernamePasswordAuthenticationToken.authenticated(
                usuario.getId(), null, authorities);
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        http.getSession().setAttribute(
                HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);
    }

    public void encerrar(HttpServletRequest http) {
        HttpSession sessao = http.getSession(false);
        if (sessao != null) {
            sessao.invalidate();
        }
        SecurityContextHolder.clearContext();
    }

    public Usuario usuarioLogado(HttpServletRequest http) {
        HttpSession sessao = http.getSession(false);
        Long id = sessao == null ? null : (Long) sessao.getAttribute(ATRIBUTO);
        if (id == null) {
            throw new NaoAutenticadoException();
        }

        return repository.findById(id)
                .filter(Usuario::isAtivo)
                .orElseThrow(NaoAutenticadoException::new);
    }

    public Usuario exigirLogin(HttpServletRequest http) {
        Usuario usuario = usuarioLogado(http);
        if (usuario.isSenhaProvisoria()) {
            throw new AcessoNegadoException("Troque sua senha provisória para continuar");
        }
        return usuario;
    }

    public Usuario exigirAdmin(HttpServletRequest http) {
        Usuario usuario = exigirLogin(http);
        if (usuario.getPerfil() == null
                || !"ADMINISTRADOR_CASA".equals(usuario.getPerfil().getNome())) {
            throw new AcessoNegadoException("Apenas o administrador da família pode fazer isso");
        }
        return usuario;
    }
}
