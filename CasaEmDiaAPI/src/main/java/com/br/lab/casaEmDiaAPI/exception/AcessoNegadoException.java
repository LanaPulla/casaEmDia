package com.br.lab.casaEmDiaAPI.exception;

import org.springframework.http.HttpStatus;

/** 403 - usuário logado, mas sem permissão para a ação. */
public class AcessoNegadoException extends ApiException {
    public AcessoNegadoException(String mensagem) {
        super(HttpStatus.FORBIDDEN, mensagem);
    }
}
