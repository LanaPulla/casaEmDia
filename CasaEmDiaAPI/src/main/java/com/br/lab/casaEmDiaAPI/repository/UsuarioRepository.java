package com.br.lab.casaEmDiaAPI.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.br.lab.casaEmDiaAPI.entities.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<Usuario> findByIdAndFamiliaId(Long id, Long familiaId);
    List<Usuario> findByFamiliaIdOrderByNomeAsc(Long familiaId);
}