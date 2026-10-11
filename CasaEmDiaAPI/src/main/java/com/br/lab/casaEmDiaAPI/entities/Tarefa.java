package com.br.lab.casaEmDiaAPI.entities;

import com.br.lab.casaEmDiaAPI.entities.enums.PrioridadeEnum;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Getter;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

@Entity
@Table(name = "tb_tarefa")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Tarefa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false, length = 100)
    private String titulo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name="responsavel", nullable=false)
    private Usuario responsavel;

    @Enumerated(EnumType.STRING)
    private PrioridadeEnum prioridade;

    @Enumerated(EnumType.STRING)
    private StatusEnum status;

    @Column(length = 500)
    private String observacao;

    private LocalDate dataTarefa;





}
