package com.br.lab.casaEmDiaAPI.dto;

import java.util.List;

public record FamiliaResponse(Long id, String nome, List<UsuarioResponse> membros) {}