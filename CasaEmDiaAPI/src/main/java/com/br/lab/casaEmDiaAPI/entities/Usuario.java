package com.br.lab.casaEmDiaAPI.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "usuario")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "familia_id", nullable = false, updatable = false)
    private Long familiaId;

    @Column(nullable = false)
    private String nome;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "senha_hash", nullable = false)
    private String senhaHash;

    @Column(nullable = false, columnDefinition = "boolean default true")
    private boolean ativo = true;

    @Column(name = "senha_provisoria", nullable = false)
    private boolean senhaProvisoria;

    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    protected Usuario() {
    }

    public Usuario(Long familiaId, String nome, String email, String senhaHash,
            boolean senhaProvisoria, Perfil perfil) {
        this.familiaId = familiaId;
        this.nome = nome;
        this.email = email;
        this.senhaHash = senhaHash;
        this.senhaProvisoria = senhaProvisoria;
    }

    @PrePersist
    void aoCriar() {
        this.criadoEm = LocalDateTime.now();
    }

    public void atualizar(String nome) {
        this.nome = nome;
        // adicionar perfil
    }

    public void desativar() {
        this.ativo = false;
    }

    public void definirSenha(String novoHash, boolean provisoria) {
        this.senhaHash = novoHash;
        this.senhaProvisoria = provisoria;
    }

    public Long getId() {
        return id;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "familia_id", insertable = false, updatable = false)
    private Familia familia;

    public Familia getFamilia() {
        return familia;
    }

    public Long getFamiliaId() {
        return familiaId;
    }

    public String getNome() {
        return nome;
    }

    public Perfil getPerfil() {
        return perfil;
    }

    public String getEmail() {
        return email;
    }

    public String getSenhaHash() {
        return senhaHash;
    }

    public boolean isAtivo() {
        return ativo;
    }

    public boolean isSenhaProvisoria() {
        return senhaProvisoria;
    }

    public LocalDateTime getCriadoEm() {
        return criadoEm;
    }
}
