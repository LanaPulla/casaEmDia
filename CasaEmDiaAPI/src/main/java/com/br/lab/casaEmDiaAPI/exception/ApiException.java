package com.br.lab.casaEmDiaAPI.exception;

import org.springframework.http.HttpStatus;

/**
 * Base para todas as exceções de negócio da API.
 * Cada subclasse define o status HTTP; a mensagem é exibida ao usuário no front.
 */
public abstract class ApiException extends RuntimeException {

    private final HttpStatus status;

    protected ApiException(HttpStatus status, String mensagem) {
        super(mensagem);
        this.status = status;
    }

    public HttpStatus getStatus() {
        return status;
    }
}
