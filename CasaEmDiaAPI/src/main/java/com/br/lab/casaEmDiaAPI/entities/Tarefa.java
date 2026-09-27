package com.br.lab.casaEmDiaAPI.entities;

import com.br.lab.casaEmDiaAPI.entities.enums.Prioridade;
import com.br.lab.casaEmDiaAPI.entities.enums.Recorrencia;
import com.br.lab.casaEmDiaAPI.entities.enums.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;


@Entity
@Table(name = "tb_tarefa")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tarefa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String titulo;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String responsavel;

    @Enumerated(EnumType.STRING)
    private Prioridade prioridade;

    @Enumerated(EnumType.STRING)
    private Recorrencia recorrencia;

    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(length = 500)
    private String observacao;

    private LocalDate dataTarefa;

}
