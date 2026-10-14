package com.br.lab.casaEmDiaAPI.entities;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "permissoes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Permissao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String nome; // TAREFA_CRIAR, FINANCAS_VER

    private String descricao; // "Permite criar novas tarefas na casa"
}
