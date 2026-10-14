package com.br.lab.casaEmDiaAPI.service;

import java.util.HashSet;
import java.util.Set;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.br.lab.casaEmDiaAPI.dto.AtualizarFamiliaRequest;
import com.br.lab.casaEmDiaAPI.dto.AtualizarMembroRequest;
import com.br.lab.casaEmDiaAPI.dto.CadastroFamiliaRequest;
import com.br.lab.casaEmDiaAPI.dto.FamiliaResponse;
import com.br.lab.casaEmDiaAPI.dto.NovoMembroRequest;
import com.br.lab.casaEmDiaAPI.dto.RedefinirSenhaRequest;
import com.br.lab.casaEmDiaAPI.dto.UsuarioResponse;
import com.br.lab.casaEmDiaAPI.entities.Familia;
import com.br.lab.casaEmDiaAPI.entities.Perfil;
import com.br.lab.casaEmDiaAPI.entities.Usuario;
import com.br.lab.casaEmDiaAPI.exception.CustomException;
import com.br.lab.casaEmDiaAPI.exception.EmailJaCadastradoException;
import com.br.lab.casaEmDiaAPI.exception.RecursoNaoEncontradoException;
import com.br.lab.casaEmDiaAPI.repository.FamiliaRepository;
import com.br.lab.casaEmDiaAPI.repository.PerfilRepository;
import com.br.lab.casaEmDiaAPI.repository.UsuarioRepository;

import jakarta.transaction.Transactional;

@Service
public class FamiliaService {
    private final FamiliaRepository familiaRepository;
    private final PerfilRepository perfilRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public FamiliaService(FamiliaRepository familiaRepository,
                          PerfilRepository perfilRepository,
                          UsuarioRepository usuarioRepository,
                          PasswordEncoder passwordEncoder) {
        this.familiaRepository = familiaRepository;
        this.perfilRepository = perfilRepository;
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Usuario cadastrar(CadastroFamiliaRequest req) {
        Set<String> emailsVistos = new HashSet<>();

        String emailAdmin = normalizarEmail(req.email());
        garantirEmailLivre(emailAdmin, emailsVistos);

        Familia familia = familiaRepository.save(new Familia(req.nomeFamilia().trim()));
        Perfil perfilAdministrador = buscarPerfil("ADMINISTRADOR_CASA");

        Usuario admin = usuarioRepository.save(new Usuario(
                familia.getId(),
                req.nomeResponsavel().trim(),
                emailAdmin,
                passwordEncoder.encode(req.senha()),
                false,
                perfilAdministrador));

        if (req.membros() != null) {
            for (NovoMembroRequest membro : req.membros()) {
                String email = normalizarEmail(membro.email());
                garantirEmailLivre(email, emailsVistos);
                usuarioRepository.save(novoMembro(familia.getId(), email, membro));
            }
        }
        return admin;
    }

    @Transactional
    public FamiliaResponse detalhar(Long familiaId) {
        Familia familia = buscarFamilia(familiaId);
        var membros = usuarioRepository.findByFamiliaIdOrderByNomeAsc(familiaId).stream()
                .map(UsuarioResponse::response)
                .toList();
        return new FamiliaResponse(familia.getId(), familia.getNome(), membros);
    }

    @Transactional
    public FamiliaResponse renomear(Long familiaId, AtualizarFamiliaRequest req) {
        buscarFamilia(familiaId).renomear(req.nomeFamilia().trim());
        return detalhar(familiaId);
    }

    @Transactional
    public UsuarioResponse adicionarMembro(Usuario admin, NovoMembroRequest req) {
        String email = normalizarEmail(req.email());
        garantirEmailLivre(email, new HashSet<>());

        return UsuarioResponse.response(usuarioRepository.save(novoMembro(admin.getFamiliaId(), email, req)));
    }

    @Transactional
    public UsuarioResponse atualizarMembro(Usuario admin, Long membroId, AtualizarMembroRequest req) {
        Usuario membro = buscarMembro(admin, membroId);

        // Adicionar regra para ninguém altera o próprio perfil, sempre sobra ao menos um admin

        membro.atualizar(req.nome().trim());
        return UsuarioResponse.response(membro);
    }

    @Transactional
    public void desativarMembro(Usuario admin, Long membroId) {
        if (membroId.equals(admin.getId())) {
            throw new CustomException("Você não pode desativar a sua própria conta");
        }
        buscarMembro(admin, membroId).desativar();
    }

    @Transactional
    public void redefinirSenha(Usuario admin, Long membroId, RedefinirSenhaRequest req) {
        if (membroId.equals(admin.getId())) {
            throw new CustomException("Para trocar a sua senha, use a opção de trocar senha");
        }
        buscarMembro(admin, membroId).definirSenha(passwordEncoder.encode(req.novaSenha()), true);
    }


    private Usuario novoMembro(Long familiaId, String email, NovoMembroRequest req) {
        return new Usuario(
                familiaId,
                req.nome().trim(),
                email,
                passwordEncoder.encode(req.senhaInicial()),
                true,
                buscarPerfil(req.perfil().name()));
    }

    private Perfil buscarPerfil(String nome) {
        return perfilRepository.findByNome(nome)
                .orElseThrow(() -> new RecursoNaoEncontradoException(
                        "Perfil " + nome + " não encontrado"));
    }

    private Familia buscarFamilia(Long familiaId) {
        return familiaRepository.findById(familiaId)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Família não encontrada"));
    }

    /** Só encontra membros da MESMA família do admin (isolamento entre famílias). */
    private Usuario buscarMembro(Usuario admin, Long membroId) {
        return usuarioRepository.findByIdAndFamiliaId(membroId, admin.getFamiliaId())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Membro não encontrado"));
    }

    private void garantirEmailLivre(String email, Set<String> vistosNestaRequisicao) {
        if (!vistosNestaRequisicao.add(email) || usuarioRepository.existsByEmail(email)) {
            throw new EmailJaCadastradoException(email);
        }
    }

    private String normalizarEmail(String email) {
        return email.trim().toLowerCase();
    }
}
