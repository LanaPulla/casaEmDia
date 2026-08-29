package com.br.lab.casaEmDiaAPI.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.br.lab.casaEmDiaAPI.entities.Fruta;
import com.br.lab.casaEmDiaAPI.repository.FrutaRepository;

@RestController
@RequestMapping("/hello-world")
public class HelloWorldTeste {

    @Autowired
    private FrutaRepository frutaRepository;

    @GetMapping
    public List<Fruta> testarBanco() {
        return frutaRepository.findAll();
    }
}