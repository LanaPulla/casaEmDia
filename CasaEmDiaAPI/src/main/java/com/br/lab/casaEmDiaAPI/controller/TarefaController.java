package com.br.lab.casaEmDiaAPI.controller;
import org.springframework.http.HttpStatus;
import com.br.lab.casaEmDiaAPI.dto.TarefaRequest;
import com.br.lab.casaEmDiaAPI.dto.TarefaResponse;
import com.br.lab.casaEmDiaAPI.entities.Tarefa;
import com.br.lab.casaEmDiaAPI.service.TarefaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tarefas")
@Slf4j
@RequiredArgsConstructor
public class TarefaController {

    public final TarefaService tarefaService;

    @GetMapping
    public ResponseEntity<List<Tarefa>> listarTodas(){
        return  ResponseEntity.ok(tarefaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tarefa> buscarPorId(@PathVariable Long id){
        return ResponseEntity.ok(tarefaService.buscarPorId(id));
    }

    @PutMapping
    public ResponseEntity<Tarefa> atualizar(@PathVariable Long id, @Valid @RequestBody Tarefa tarefa){
        return ResponseEntity.ok(tarefaService.atualizar(id, tarefa));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Tarefa> deletar(@PathVariable Long id){
        tarefaService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<List<TarefaResponse>> cadastrarTarefa(
            @Valid @RequestBody TarefaRequest request) {

        List<TarefaResponse> tarefasCriadas =
                tarefaService.criarTarefa(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(tarefasCriadas);
    }    
}
