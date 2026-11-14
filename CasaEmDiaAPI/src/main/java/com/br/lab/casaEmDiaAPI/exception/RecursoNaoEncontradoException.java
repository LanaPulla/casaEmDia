package com.br.lab.casaEmDiaAPI.exception;

import org.springframework.http.HttpStatus;

/** 404 - registro solicitado não existe. */
public class RecursoNaoEncontradoException extends ApiException {
    public RecursoNaoEncontradoException(String mensagem) {
        super(HttpStatus.NOT_FOUND, mensagem);
    }
}
