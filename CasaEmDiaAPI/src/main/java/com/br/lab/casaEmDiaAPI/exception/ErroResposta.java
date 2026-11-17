package com.br.lab.casaEmDiaAPI.exception;

import java.time.LocalDateTime;
import java.util.Map;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * Corpo padrão de toda resposta de erro da API.
 *
 * Exemplo:
 * {
 *   "timestamp": "2026-11-12T19:40:00.123",
 *   "status": 400,
 *   "erro": "Bad Request",
 *   "mensagem": "Dados inválidos:\n- O título é obrigatório",
 *   "caminho": "/tarefas",
 *   "campos": { "titulo": "O título é obrigatório" }
 * }
 *
 * O front exibe o campo "mensagem" para o usuário.
 */
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public record ErroResposta(
        String timestamp,
        int status,
        String erro,
        String mensagem,
        String caminho,
        Map<String, String> campos
) {
    public static ErroResposta de(int status, String erro, String mensagem, String caminho,
                                  Map<String, String> campos) {
        return new ErroResposta(LocalDateTime.now().toString(), status, erro, mensagem, caminho, campos);
    }
}
