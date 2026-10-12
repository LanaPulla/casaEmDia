package com.br.lab.casaEmDiaAPI.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.servlet.HandlerInterceptor;

public class AutenticacaoInterceptor implements HandlerInterceptor {

    private static final String USUARIO_ID = "usuarioId";

    @Override
    public boolean preHandle(
            HttpServletRequest request,
            HttpServletResponse response,
            Object handler) {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        var sessao = request.getSession(false);
        if (sessao == null || sessao.getAttribute(USUARIO_ID) == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return false;
        }
        return true;
    }
}
