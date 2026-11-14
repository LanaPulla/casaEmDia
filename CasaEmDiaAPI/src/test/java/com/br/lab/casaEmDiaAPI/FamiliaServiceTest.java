package com.br.lab.casaEmDiaAPI;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.br.lab.casaEmDiaAPI.dto.CadastroFamiliaRequest;
import com.br.lab.casaEmDiaAPI.dto.NovoMembroRequest;
import com.br.lab.casaEmDiaAPI.dto.RedefinirSenhaRequest;
import com.br.lab.casaEmDiaAPI.entities.Familia;
import com.br.lab.casaEmDiaAPI.entities.Perfil;
import com.br.lab.casaEmDiaAPI.entities.Usuario;
import com.br.lab.casaEmDiaAPI.entities.enums.PerfilFamiliaEnum;
import com.br.lab.casaEmDiaAPI.exception.EmailJaCadastradoException;
import com.br.lab.casaEmDiaAPI.repository.FamiliaRepository;
import com.br.lab.casaEmDiaAPI.repository.PerfilRepository;
import com.br.lab.casaEmDiaAPI.repository.UsuarioRepository;
import com.br.lab.casaEmDiaAPI.service.FamiliaService;

@ExtendWith(MockitoExtension.class)
class FamiliaServiceTest {

    @Mock
    private FamiliaRepository familiaRepository;

    @Mock
    private PerfilRepository perfilRepository;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private FamiliaService familiaService;

    private Perfil perfilAdministrador;

    @BeforeEach
    void setUp() {
        perfilAdministrador = new Perfil(1L, "ADMINISTRADOR_CASA", null);
    }

    @Test
    void deveCriarContaComDadosValidos() {
        CadastroFamiliaRequest request = new CadastroFamiliaRequest(
                "  Família Silva  ",
                "  Ana Silva  ",
                "  ANA@EXEMPLO.COM  ",
                "senha-segura",
                List.of());
        Familia familia = new Familia("Família Silva");

        when(usuarioRepository.existsByEmail("ana@exemplo.com")).thenReturn(false);
        when(familiaRepository.save(any(Familia.class))).thenReturn(familia);
        when(perfilRepository.findByNome("ADMINISTRADOR_CASA"))
                .thenReturn(Optional.of(perfilAdministrador));
        when(passwordEncoder.encode("senha-segura")).thenReturn("senha-codificada");
        when(usuarioRepository.save(any(Usuario.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        Usuario administrador = familiaService.cadastrar(request);

        assertEquals("Família Silva", familia.getNome());
        assertEquals("ana@exemplo.com", administrador.getEmail());
        assertEquals("Ana Silva", administrador.getNome());
        assertEquals("senha-codificada", administrador.getSenhaHash());
        assertSame(perfilAdministrador, administrador.getPerfil());
        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    void deveFalharQuandoEmailJaEstiverCadastrado() {
        CadastroFamiliaRequest request = new CadastroFamiliaRequest(
                "Família Silva",
                "Ana Silva",
                "ANA@EXEMPLO.COM",
                "senha-segura",
                List.of());

        when(usuarioRepository.existsByEmail("ana@exemplo.com")).thenReturn(true);

        assertThrows(EmailJaCadastradoException.class,
                () -> familiaService.cadastrar(request));

        verify(familiaRepository, never()).save(any(Familia.class));
        verify(usuarioRepository, never()).save(any(Usuario.class));
        verify(perfilRepository, never()).findByNome(any(String.class));
    }

    @Test
    void deveCadastrarUsuarioComDadosValidos() {
        Usuario administrador = new Usuario(
                10L, "Ana Silva", "ana@exemplo.com", "hash-admin", false, perfilAdministrador);
        NovoMembroRequest request = new NovoMembroRequest(
                "  Bruno Silva  ",
                "  BRUNO@EXEMPLO.COM  ",
                "senha-segura",
                PerfilFamiliaEnum.MEMBRO_CASA,
                "Filho");
        Perfil perfilMembro = new Perfil(2L, "MEMBRO_CASA", null);

        when(usuarioRepository.existsByEmail("bruno@exemplo.com")).thenReturn(false);
        when(perfilRepository.findByNome("MEMBRO_CASA")).thenReturn(Optional.of(perfilMembro));
        when(passwordEncoder.encode("senha-segura")).thenReturn("senha-codificada");
        when(usuarioRepository.save(any(Usuario.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var resposta = familiaService.adicionarMembro(administrador, request);

        assertEquals("Bruno Silva", resposta.nome());
        assertEquals("bruno@exemplo.com", resposta.email());
        assertSame(perfilMembro, resposta.perfil());
        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    void deveFalharAoCadastrarUsuarioComEmailJaCadastrado() {
        Usuario administrador = new Usuario(
                10L, "Ana Silva", "ana@exemplo.com", "hash-admin", false, perfilAdministrador);
        NovoMembroRequest request = new NovoMembroRequest(
                "Bruno Silva",
                "BRUNO@EXEMPLO.COM",
                "senha-segura",
                PerfilFamiliaEnum.MEMBRO_CASA,
                "Filho");

        when(usuarioRepository.existsByEmail("bruno@exemplo.com")).thenReturn(true);

        assertThrows(EmailJaCadastradoException.class,
                () -> familiaService.adicionarMembro(administrador, request));

        verify(perfilRepository, never()).findByNome(any(String.class));
        verify(usuarioRepository, never()).save(any(Usuario.class));
    }

    @Test
    void administradorDeveTrocarSenhaDeUmMembro() {
        Usuario administrador = new Usuario(
                10L, "Ana Silva", "ana@exemplo.com", "hash-admin", false, perfilAdministrador);
        Usuario membro = new Usuario(
                20L, "Bruno Silva", "bruno@exemplo.com", "hash-antigo", true,
                new Perfil(2L, "MEMBRO_CASA", null));
        RedefinirSenhaRequest request = new RedefinirSenhaRequest("nova-senha-segura");

        when(usuarioRepository.findByIdAndFamiliaId(20L, 10L)).thenReturn(Optional.of(membro));
        when(passwordEncoder.encode("nova-senha-segura")).thenReturn("hash-novo");

        familiaService.redefinirSenha(administrador, 20L, request);

        assertEquals("hash-novo", membro.getSenhaHash());
        assertEquals(true, membro.isSenhaProvisoria());
        verify(passwordEncoder).encode("nova-senha-segura");
    }
}
