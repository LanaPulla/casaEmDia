package com.br.lab.casaEmDiaAPI.exception;

import org.springframework.http.HttpStatus;

/** 401 - não há sessão ativa. */
public class NaoAutenticadoException extends ApiException {
    public NaoAutenticadoException() {
        super(HttpStatus.UNAUTHORIZED, "Você precisa fazer login");
    }
}
