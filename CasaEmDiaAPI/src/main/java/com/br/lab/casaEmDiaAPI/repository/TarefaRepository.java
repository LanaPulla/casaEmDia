package com.br.lab.casaEmDiaAPI.repository;

import com.br.lab.casaEmDiaAPI.entities.Tarefa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TarefaRepository extends JpaRepository<Tarefa, Long> {

    /** Tarefas cujo responsável pertence à família informada. */
    List<Tarefa> findByResponsavel_FamiliaId(Long familiaId);

    /** Busca a tarefa só se o responsável for da família informada (isolamento entre famílias). */
    Optional<Tarefa> findByIdAndResponsavel_FamiliaId(Long id, Long familiaId);
}
