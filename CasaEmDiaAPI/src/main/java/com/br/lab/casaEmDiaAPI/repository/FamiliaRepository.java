package com.br.lab.casaEmDiaAPI.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.br.lab.casaEmDiaAPI.entities.Familia;

public interface FamiliaRepository extends JpaRepository<Familia, Long> {
    
}
