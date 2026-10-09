package com.br.lab.casaEmDiaAPI.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.br.lab.casaEmDiaAPI.dto.CadastroRequest;
import com.br.lab.casaEmDiaAPI.dto.LoginRequest;
import com.br.lab.casaEmDiaAPI.dto.UsuarioResponse;
import com.br.lab.casaEmDiaAPI.entities.Usuario;
import com.br.lab.casaEmDiaAPI.exception.CredenciaisInvalidasException;
import com.br.lab.casaEmDiaAPI.exception.EmailJaCadastradoException;
import com.br.lab.casaEmDiaAPI.repository.UsuarioRepository;


@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }
    
    @Transactional(readOnly = true)
    public UsuarioResponse login(LoginRequest req) {
        Usuario usuario = repository.findByEmail(normalizar(req.email()))
                .filter(u -> passwordEncoder.matches(req.senha(), u.getSenhaHash()))
                .orElseThrow(CredenciaisInvalidasException::new);

        return UsuarioResponse.response(usuario);
    }

    @Transactional
    public UsuarioResponse cadastrar(CadastroRequest req) {
        String email = normalizar(req.email());

        if (repository.existsByEmail(email)) {
            throw new EmailJaCadastradoException(email);
        }

        Usuario usuario = new Usuario(
                req.nome().trim(),
                email,
                passwordEncoder.encode(req.senha()));

        return UsuarioResponse.response(repository.save(usuario));
    }

    private String normalizar(String email) {
        return email.trim().toLowerCase();
    }
}