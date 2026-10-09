package com.br.lab.casaEmDiaAPI.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.br.lab.casaEmDiaAPI.entities.Permissao;

public interface PermissaoRepository extends JpaRepository<Permissao, Long> {
    Optional<Permissao> findByNome(String nome);
}
