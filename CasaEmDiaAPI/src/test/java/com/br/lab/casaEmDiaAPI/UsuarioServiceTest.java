package com.br.lab.casaEmDiaAPI;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.br.lab.casaEmDiaAPI.dto.LoginRequest;
import com.br.lab.casaEmDiaAPI.dto.UsuarioResponse;
import com.br.lab.casaEmDiaAPI.entities.Familia;
import com.br.lab.casaEmDiaAPI.entities.Perfil;
import com.br.lab.casaEmDiaAPI.entities.Usuario;
import com.br.lab.casaEmDiaAPI.exception.CredenciaisInvalidasException;
import com.br.lab.casaEmDiaAPI.repository.FamiliaRepository;
import com.br.lab.casaEmDiaAPI.repository.UsuarioRepository;
import com.br.lab.casaEmDiaAPI.service.UsuarioService;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private FamiliaRepository familiaRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

    @Test
    void deveAutenticarComCredenciaisValidas() {
        Perfil perfil = new Perfil(1L, "ADMINISTRADOR_CASA", null);
        Usuario usuario = new Usuario(
                10L, "Ana Silva", "ana@exemplo.com", "hash-da-senha", false, perfil);
        Familia familia = new Familia("Família Silva");
        LoginRequest request = new LoginRequest("  ANA@EXEMPLO.COM  ", "senha-segura");

        when(usuarioRepository.findByEmail("ana@exemplo.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senha-segura", "hash-da-senha")).thenReturn(true);
        when(familiaRepository.findById(10L)).thenReturn(Optional.of(familia));

        UsuarioResponse response = usuarioService.login(request);

        assertEquals("Ana Silva", response.nome());
        assertEquals("ana@exemplo.com", response.email());
        assertEquals("Família Silva", response.familia());
        verify(passwordEncoder).matches("senha-segura", "hash-da-senha");
        verify(familiaRepository).findById(10L);
    }

    @Test
    void deveFalharQuandoSenhaEstiverIncorreta() {
        Usuario usuario = new Usuario(
                10L, "Ana Silva", "ana@exemplo.com", "hash-da-senha", false,
                new Perfil(1L, "ADMINISTRADOR_CASA", null));
        LoginRequest request = new LoginRequest("ana@exemplo.com", "senha-incorreta");

        when(usuarioRepository.findByEmail("ana@exemplo.com")).thenReturn(Optional.of(usuario));
        when(passwordEncoder.matches("senha-incorreta", "hash-da-senha")).thenReturn(false);

        assertThrows(CredenciaisInvalidasException.class,
                () -> usuarioService.login(request));

        verify(familiaRepository, never()).findById(10L);
    }
}