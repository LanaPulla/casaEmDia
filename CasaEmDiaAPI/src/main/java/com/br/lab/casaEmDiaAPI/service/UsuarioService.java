package com.br.lab.casaEmDiaAPI.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.br.lab.casaEmDiaAPI.dto.LoginRequest;
import com.br.lab.casaEmDiaAPI.dto.TrocarSenhaRequest;
import com.br.lab.casaEmDiaAPI.dto.UsuarioResponse;
import com.br.lab.casaEmDiaAPI.entities.Familia;
import com.br.lab.casaEmDiaAPI.entities.Usuario;
import com.br.lab.casaEmDiaAPI.exception.CredenciaisInvalidasException;
import com.br.lab.casaEmDiaAPI.exception.CustomException;
import com.br.lab.casaEmDiaAPI.exception.NaoAutenticadoException;
import com.br.lab.casaEmDiaAPI.repository.FamiliaRepository;
import com.br.lab.casaEmDiaAPI.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final FamiliaRepository familiaRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository,
            FamiliaRepository familiaRepository,
            PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.familiaRepository = familiaRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public UsuarioResponse login(LoginRequest req) {
        Usuario usuario = usuarioRepository.findByEmail(normalizar(req.email()))
                .filter(Usuario::isAtivo)
                .filter(u -> passwordEncoder.matches(req.senha(), u.getSenhaHash()))
                .orElseThrow(CredenciaisInvalidasException::new);

        Familia familia = familiaRepository.findById(usuario.getFamiliaId())
                .orElse(null);

        return UsuarioResponse.from(usuario, familia);
    }

    @Transactional
    public void trocarSenha(Long usuarioId, TrocarSenhaRequest req) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(NaoAutenticadoException::new);

        if (!passwordEncoder.matches(req.senhaAtual(), usuario.getSenhaHash())) {
            throw new CustomException("Senha atual incorreta");
        }
        if (req.senhaAtual().equals(req.novaSenha())) {
            throw new CustomException("A nova senha deve ser diferente da atual");
        }
        usuario.definirSenha(passwordEncoder.encode(req.novaSenha()), false);
    }

    private String normalizar(String email) {
        return email.trim().toLowerCase();
    }
}