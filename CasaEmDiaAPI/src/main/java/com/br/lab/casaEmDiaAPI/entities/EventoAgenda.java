package com.br.lab.casaEmDiaAPI.entities;

import com.br.lab.casaEmDiaAPI.entities.enums.CategoriaAgendaEnum;
import jakarta.persistence.*;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "evento_agenda")
public class EventoAgenda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    private String descricao;

    @Column(name = "data_evento", nullable = false)
    private LocalDate dataEvento;

    @Column(name = "horario_inicio")
    private LocalTime horarioInicio;

    @Column(name = "horario_fim")
    private LocalTime horarioFim;

    private String local;

    @Enumerated(EnumType.STRING)
    @Column(name = "categoria")
    private CategoriaAgendaEnum categoria;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "membro_id")
    private Usuario membro;

    public EventoAgenda() {
    }

    public EventoAgenda(Long id, String titulo, String descricao, LocalDate dataEvento,
                        LocalTime horarioInicio, LocalTime horarioFim, String local,
                        CategoriaAgendaEnum categoria) {
        this(id, titulo, descricao, dataEvento, horarioInicio, horarioFim, local, categoria, null);
    }

    @Builder
    public EventoAgenda(Long id, String titulo, String descricao, LocalDate dataEvento,
                        LocalTime horarioInicio, LocalTime horarioFim, String local,
                        CategoriaAgendaEnum categoria, Usuario membro) {
        this.id = id;
        this.titulo = titulo;
        this.descricao = descricao;
        this.dataEvento = dataEvento;
        this.horarioInicio = horarioInicio;
        this.horarioFim = horarioFim;
        this.local = local;
        this.categoria = categoria;
        this.membro = membro;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public LocalDate getDataEvento() { return dataEvento; }
    public void setDataEvento(LocalDate dataEvento) { this.dataEvento = dataEvento; }

    public LocalTime getHorarioInicio() { return horarioInicio; }
    public void setHorarioInicio(LocalTime horarioInicio) { this.horarioInicio = horarioInicio; }

    public LocalTime getHorarioFim() { return horarioFim; }
    public void setHorarioFim(LocalTime horarioFim) { this.horarioFim = horarioFim; }

    public String getLocal() { return local; }
    public void setLocal(String local) { this.local = local; }

    public CategoriaAgendaEnum getCategoria() { return categoria; }
    public void setCategoria(CategoriaAgendaEnum categoria) { this.categoria = categoria; }

    public Usuario getMembro() { return membro; }
    public void setMembro(Usuario membro) { this.membro = membro; }
}