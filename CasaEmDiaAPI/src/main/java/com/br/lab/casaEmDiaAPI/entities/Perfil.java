package com.br.lab.casaEmDiaAPI.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "perfis")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Perfil {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String nome; // Ex: ROLE_ADMINISTRADOR_CASA

    // Relação ManyToMany com Permissões
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "perfil_permissoes", joinColumns = @JoinColumn(name = "perfil_id"), inverseJoinColumns = @JoinColumn(name = "permissao_id"))
    private Set<Permissao> permissoes = new HashSet<>();
}