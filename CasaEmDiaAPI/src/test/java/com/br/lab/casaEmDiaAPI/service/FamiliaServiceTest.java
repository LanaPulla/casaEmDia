package com.br.lab.casaEmDiaAPI.service;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.br.lab.casaEmDiaAPI.dto.AtualizarMembroRequest;
import com.br.lab.casaEmDiaAPI.entities.Perfil;
import com.br.lab.casaEmDiaAPI.entities.Usuario;
import com.br.lab.casaEmDiaAPI.exception.CustomException;
import com.br.lab.casaEmDiaAPI.repository.FamiliaRepository;
import com.br.lab.casaEmDiaAPI.repository.PerfilRepository;
import com.br.lab.casaEmDiaAPI.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
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

    private Perfil administrador;
    private Perfil membro;
    private Usuario admin;
    private Usuario integrante;

    @BeforeEach
    void setUp() {
        administrador = new Perfil(1L, "ADMINISTRADOR_CASA", Set.of());
        membro = new Perfil(2L, "MEMBRO_CASA", Set.of());
        admin = usuario(10L, administrador);
        integrante = usuario(11L, membro);
    }

    @Test
    void atualizaPerfilDoMembroESeuNome() {
        when(usuarioRepository.findByIdAndFamiliaId(11L, 5L)).thenReturn(Optional.of(integrante));
        when(perfilRepository.findByNome("ADMINISTRADOR_CASA")).thenReturn(Optional.of(administrador));
        when(usuarioRepository.findByFamiliaIdOrderByNomeAsc(5L)).thenReturn(List.of(admin, integrante));

        familiaService.atualizarMembro(admin, 11L,
                new AtualizarMembroRequest("Bia Atualizada", com.br.lab.casaEmDiaAPI.entities.enums.PerfilFamiliaEnum.ADMINISTRADOR_CASA, null));

        verify(integrante).atualizar("Bia Atualizada", administrador);
    }

    @Test
    void impedeAdministradorDeAlterarSeuProprioPerfil() {
        when(usuarioRepository.findByIdAndFamiliaId(10L, 5L)).thenReturn(Optional.of(admin));
        when(perfilRepository.findByNome("MEMBRO_CASA")).thenReturn(Optional.of(membro));

        assertThrows(CustomException.class, () -> familiaService.atualizarMembro(admin, 10L,
                new AtualizarMembroRequest("Ana", com.br.lab.casaEmDiaAPI.entities.enums.PerfilFamiliaEnum.MEMBRO_CASA, null)));
    }

    @Test
    void permiteRebaixarAdministradorQuandoOutroAdministradorAtivoExiste() {
        Usuario segundoAdmin = usuario(12L, administrador);
        when(usuarioRepository.findByIdAndFamiliaId(12L, 5L)).thenReturn(Optional.of(segundoAdmin));
        when(perfilRepository.findByNome("MEMBRO_CASA")).thenReturn(Optional.of(membro));
        when(usuarioRepository.findByFamiliaIdOrderByNomeAsc(5L)).thenReturn(List.of(admin, segundoAdmin));

        familiaService.atualizarMembro(admin, 12L,
                new AtualizarMembroRequest("Carlos", com.br.lab.casaEmDiaAPI.entities.enums.PerfilFamiliaEnum.MEMBRO_CASA, null));

        verify(segundoAdmin).atualizar("Carlos", membro);
    }

    private Usuario usuario(Long id, Perfil perfil) {
        Usuario usuario = mock(Usuario.class);
        when(usuario.getId()).thenReturn(id);
        when(usuario.getFamiliaId()).thenReturn(5L);
        when(usuario.getPerfil()).thenReturn(perfil);
        when(usuario.isAtivo()).thenReturn(true);
        return usuario;
    }
}
