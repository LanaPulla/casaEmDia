package com.br.lab.casaEmDiaAPI.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.UNAUTHORIZED)
public class NaoAutenticadoException extends RuntimeException {
    public NaoAutenticadoException() {
        super("Você precisa fazer login");
    }
}
