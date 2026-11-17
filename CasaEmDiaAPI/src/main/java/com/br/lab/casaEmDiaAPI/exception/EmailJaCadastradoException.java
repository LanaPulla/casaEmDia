package com.br.lab.casaEmDiaAPI.exception;

import org.springframework.http.HttpStatus;

/** 409 - e-mail já usado por outro usuário. */
public class EmailJaCadastradoException extends ApiException {
    public EmailJaCadastradoException(String email) {
        super(HttpStatus.CONFLICT, "E-mail já cadastrado: " + email);
    }
}
