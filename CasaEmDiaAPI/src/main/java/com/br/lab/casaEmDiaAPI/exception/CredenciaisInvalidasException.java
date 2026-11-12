package com.br.lab.casaEmDiaAPI.exception;

import org.springframework.http.HttpStatus;

/** 401 - e-mail ou senha incorretos no login. */
public class CredenciaisInvalidasException extends ApiException {
    public CredenciaisInvalidasException() {
        super(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos");
    }
}
