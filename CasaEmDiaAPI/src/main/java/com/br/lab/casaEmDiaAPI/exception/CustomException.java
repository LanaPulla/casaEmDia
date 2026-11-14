package com.br.lab.casaEmDiaAPI.exception;

import org.springframework.http.HttpStatus;

/** 400 - violação de regra de negócio (dados válidos no formato, mas não aceitos). */
public class CustomException extends ApiException {
    public CustomException(String mensagem) {
        super(HttpStatus.BAD_REQUEST, mensagem);
    }
}
