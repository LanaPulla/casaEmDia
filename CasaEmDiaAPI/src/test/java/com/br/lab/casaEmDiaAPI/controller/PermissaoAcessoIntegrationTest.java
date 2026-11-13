package com.br.lab.casaEmDiaAPI.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import jakarta.servlet.Filter;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

import com.br.lab.casaEmDiaAPI.config.SecurityConfig;
import com.br.lab.casaEmDiaAPI.dto.EventoAgendaResponse;
import com.br.lab.casaEmDiaAPI.dto.FamiliaResponse;
import com.br.lab.casaEmDiaAPI.entities.Perfil;
import com.br.lab.casaEmDiaAPI.entities.Usuario;
import com.br.lab.casaEmDiaAPI.service.EventoAgendaService;
import com.br.lab.casaEmDiaAPI.service.FamiliaService;
import com.br.lab.casaEmDiaAPI.service.SessaoUsuarioService;
import com.br.lab.casaEmDiaAPI.service.TarefaService;

@ExtendWith(SpringExtension.class)
@WebAppConfiguration
@ContextConfiguration(classes = PermissaoAcessoIntegrationTest.TestConfig.class)
class PermissaoAcessoIntegrationTest {

    private static final String TAREFA = """
            {"titulo":"Organizar cozinha","responsavelId":1,"prioridade":"Baixa",
             "recorrencia":"Nenhuma","status":"PENDENTE"}
            """;

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private FamiliaService familiaService;

    @Autowired
    private SessaoUsuarioService sessaoUsuarioService;

    @Autowired
    private TarefaService tarefaService;

    @Autowired
    private EventoAgendaService eventoAgendaService;

    private MockMvc mockMvc;

    @BeforeEach
    void configurarMockMvc() {
        Filter securityFilter = context.getBean("springSecurityFilterChain", Filter.class);
        mockMvc = MockMvcBuilders.webAppContextSetup(context).addFilters(securityFilter).build();

        Usuario membro = usuario(1L, "MEMBRO_CASA");
        Usuario administrador = usuario(1L, "ADMINISTRADOR_CASA");
        when(sessaoUsuarioService.exigirLogin(any())).thenReturn(membro);
        when(sessaoUsuarioService.exigirAdmin(any())).thenReturn(administrador);
        when(familiaService.detalhar(1L)).thenReturn(new FamiliaResponse(1L, "Família", List.of()));
        when(familiaService.renomear(anyLong(), any())).thenReturn(new FamiliaResponse(1L, "Nova família", List.of()));
        when(tarefaService.criarTarefa(any())).thenReturn(List.of());
        when(eventoAgendaService.listarTodos()).thenReturn(List.of());
        when(eventoAgendaService.criar(any())).thenReturn(new EventoAgendaResponse(
                1L, "Consulta", null, null, null, null, null, null, null));
    }

    @Test
    void membroPodeCriarTarefaEConsultarFamiliaMasNaoAcessaFuncoesAdministrativas() throws Exception {
        MockHttpSession sessao = sessaoCom("CRIAR_TAREFA", "ATUALIZAR_STATUS_TAREFA");

        mockMvc.perform(post("/tarefas").session(sessao)
                        .contentType(MediaType.APPLICATION_JSON).content(TAREFA))
                .andExpect(status().isCreated());
        mockMvc.perform(get("/api/familia").session(sessao))
                .andExpect(status().isOk());

        mockMvc.perform(put("/api/familia").session(sessao)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"nomeFamilia\":\"Nova\"}"))
                .andExpect(status().isForbidden());
        mockMvc.perform(delete("/tarefas/1").session(sessao))
                .andExpect(status().isForbidden());
        mockMvc.perform(get("/api/agenda").session(sessao))
                .andExpect(status().isForbidden());
        mockMvc.perform(post("/api/agenda").session(sessao)
                        .contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void administradorPodeExecutarAsSeisFuncionalidadesAutorizadas() throws Exception {
        MockHttpSession sessao = sessaoCom(
                "GERENCIAR_FAMILIA",
                "CRIAR_TAREFA",
                "DELETAR_TAREFA",
                "CRIAR_COMPROMISSO",
                "VER_AGENDA");

        mockMvc.perform(post("/tarefas").session(sessao)
                        .contentType(MediaType.APPLICATION_JSON).content(TAREFA))
                .andExpect(status().isCreated());
        mockMvc.perform(get("/api/agenda").session(sessao))
                .andExpect(status().isOk());
        mockMvc.perform(post("/api/agenda").session(sessao)
                        .contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isOk());
        mockMvc.perform(get("/api/familia").session(sessao))
                .andExpect(status().isOk());
        mockMvc.perform(put("/api/familia").session(sessao)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"nomeFamilia\":\"Nova\"}"))
                .andExpect(status().isOk());
        mockMvc.perform(delete("/tarefas/1").session(sessao))
                .andExpect(status().isNoContent());
    }

    @Test
    void bloqueiaAcessoSemAutenticacaoNasSeisFuncionalidades() throws Exception {
        mockMvc.perform(post("/tarefas")
                        .contentType(MediaType.APPLICATION_JSON).content(TAREFA))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/agenda")).andExpect(status().isUnauthorized());
        mockMvc.perform(post("/api/agenda")
                        .contentType(MediaType.APPLICATION_JSON).content("{}"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(get("/api/familia")).andExpect(status().isUnauthorized());
        mockMvc.perform(put("/api/familia")
                        .contentType(MediaType.APPLICATION_JSON).content("{\"nomeFamilia\":\"Nova\"}"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(delete("/tarefas/1")).andExpect(status().isUnauthorized());
    }

    private MockHttpSession sessaoCom(String... permissoes) {
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(UsernamePasswordAuthenticationToken.authenticated(
                1L,
                null,
                java.util.Arrays.stream(permissoes).map(SimpleGrantedAuthority::new).toList()));

        MockHttpSession sessao = new MockHttpSession();
        sessao.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);
        return sessao;
    }

    private Usuario usuario(Long id, String perfilNome) {
        Usuario usuario = mock(Usuario.class);
        when(usuario.getId()).thenReturn(id);
        when(usuario.getFamiliaId()).thenReturn(1L);
        when(usuario.getPerfil()).thenReturn(new Perfil(1L, perfilNome, java.util.Set.of()));
        return usuario;
    }

    @Configuration
    @EnableWebMvc
    @Import({
            SecurityConfig.class,
            FamiliaController.class,
            TarefaController.class,
            EventoAgendaController.class
    })
    static class TestConfig {
        @Bean
        FamiliaService familiaService() {
            return mock(FamiliaService.class);
        }

        @Bean
        SessaoUsuarioService sessaoUsuarioService() {
            return mock(SessaoUsuarioService.class);
        }

        @Bean
        TarefaService tarefaService() {
            return mock(TarefaService.class);
        }

        @Bean
        EventoAgendaService eventoAgendaService() {
            return mock(EventoAgendaService.class);
        }
    }
}
