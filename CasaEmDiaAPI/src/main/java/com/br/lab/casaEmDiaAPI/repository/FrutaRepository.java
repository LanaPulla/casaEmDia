package com.br.lab.casaEmDiaAPI.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.br.lab.casaEmDiaAPI.entities.Fruta;

public interface FrutaRepository extends JpaRepository<Fruta, Long> {
}