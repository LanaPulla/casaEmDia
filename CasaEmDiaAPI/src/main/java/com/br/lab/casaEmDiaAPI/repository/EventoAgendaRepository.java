package com.br.lab.casaEmDiaAPI.repository;

import com.br.lab.casaEmDiaAPI.entities.EventoAgenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventoAgendaRepository extends JpaRepository<EventoAgenda, Long> {
    List<EventoAgenda> findByDataEventoBetween(LocalDate inicio, LocalDate fim);
}