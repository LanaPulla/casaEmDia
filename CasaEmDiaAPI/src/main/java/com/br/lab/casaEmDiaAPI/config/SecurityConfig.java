package com.br.lab.casaEmDiaAPI.config;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .formLogin(formLogin -> formLogin.disable())
                .httpBasic(httpBasic -> httpBasic.disable())
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, exception) ->
                                response.sendError(HttpServletResponse.SC_UNAUTHORIZED)))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.GET, "/api/familia").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/familia").hasAuthority("GERENCIAR_FAMILIA")
                        .requestMatchers(HttpMethod.POST, "/tarefas").hasAuthority("CRIAR_TAREFA")
                        .requestMatchers(HttpMethod.DELETE, "/tarefas/*").hasAuthority("DELETAR_TAREFA")
                        .requestMatchers(HttpMethod.GET, "/api/agenda").hasAuthority("VER_AGENDA")
                        .requestMatchers(HttpMethod.POST, "/api/agenda").hasAuthority("CRIAR_COMPROMISSO")
                        .anyRequest().permitAll());

        return http.build();
    }
}
