package com.br.lab.casaEmDiaAPI.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.br.lab.casaEmDiaAPI.entities.Perfil;

import java.util.Optional;

public interface PerfilRepository extends JpaRepository<Perfil, Long> {
    Optional<Perfil> findByNome(String nome);
}
