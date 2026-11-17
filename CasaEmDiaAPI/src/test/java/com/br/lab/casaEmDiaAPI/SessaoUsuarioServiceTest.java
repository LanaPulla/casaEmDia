package com.br.lab.casaEmDiaAPI;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.br.lab.casaEmDiaAPI.entities.Perfil;
import com.br.lab.casaEmDiaAPI.entities.Usuario;
import com.br.lab.casaEmDiaAPI.exception.AcessoNegadoException;
import com.br.lab.casaEmDiaAPI.repository.UsuarioRepository;
import com.br.lab.casaEmDiaAPI.service.SessaoUsuarioService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@ExtendWith(MockitoExtension.class)
class SessaoUsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpSession session;

    @Test
    void deveNegarAcessoAoCadastroDeMembroSemPerfilAdministrador() {
        Perfil perfilMembro = new Perfil(2L, "MEMBRO_CASA", null);
        Usuario usuario = new Usuario(
                10L, "Bruno Silva", "bruno@exemplo.com", "hash", false, perfilMembro);
        SessaoUsuarioService sessaoService = new SessaoUsuarioService(usuarioRepository);

        when(request.getSession(false)).thenReturn(session);
        when(session.getAttribute("usuarioId")).thenReturn(20L);
        when(usuarioRepository.findById(20L)).thenReturn(java.util.Optional.of(usuario));

        assertThrows(AcessoNegadoException.class,
                () -> sessaoService.exigirAdmin(request));
    }
}
