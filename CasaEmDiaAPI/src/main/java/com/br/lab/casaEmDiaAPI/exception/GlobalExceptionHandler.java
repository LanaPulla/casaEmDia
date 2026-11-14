package com.br.lab.casaEmDiaAPI.exception;

import java.lang.reflect.Method;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.CannotCreateTransactionException;
import org.springframework.validation.FieldError;
import org.springframework.web.ErrorResponseException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;

/**
 * Tratamento centralizado de erros da API.
 * Toda falha vira um {@link ErroResposta} com uma "mensagem" legível em português,
 * que o front exibe para o usuário.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // ---------------------------------------------------------------- negócio

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ErroResposta> tratarApi(ApiException ex, HttpServletRequest req) {
        return resposta(ex.getStatus(), ex.getMessage(), req);
    }

    @ExceptionHandler(ErrorResponseException.class)
    public ResponseEntity<ErroResposta> tratarErrorResponse(ErrorResponseException ex, HttpServletRequest req) {
        String mensagem = ex.getBody().getDetail();
        if (ex instanceof org.springframework.web.server.ResponseStatusException rse && rse.getReason() != null) {
            mensagem = rse.getReason();
        }
        return resposta(ex.getStatusCode(), mensagemOuPadrao(mensagem, "Não foi possível concluir a solicitação."), req);
    }

    // ------------------------------------------------------------- validação

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroResposta> tratarValidacao(MethodArgumentNotValidException ex, HttpServletRequest req) {
        Map<String, String> campos = new LinkedHashMap<>();
        for (FieldError erro : ex.getBindingResult().getFieldErrors()) {
            campos.putIfAbsent(erro.getField(),
                    mensagemOuPadrao(erro.getDefaultMessage(), "Valor inválido"));
        }
        ex.getBindingResult().getGlobalErrors().forEach(erro ->
                campos.putIfAbsent(erro.getObjectName(), mensagemOuPadrao(erro.getDefaultMessage(), "Dados inválidos")));

        return resposta(HttpStatus.BAD_REQUEST, montarMensagemValidacao(campos.values()), req, campos);
    }

    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<ErroResposta> tratarValidacaoMetodo(HandlerMethodValidationException ex, HttpServletRequest req) {
        List<String> mensagens = ex.getAllErrors().stream()
                .map(erro -> mensagemOuPadrao(erro.getDefaultMessage(), "Valor inválido"))
                .distinct()
                .toList();
        return resposta(HttpStatus.BAD_REQUEST, montarMensagemValidacao(mensagens), req);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErroResposta> tratarConstraint(ConstraintViolationException ex, HttpServletRequest req) {
        Map<String, String> campos = new LinkedHashMap<>();
        ex.getConstraintViolations().forEach(v ->
                campos.putIfAbsent(String.valueOf(v.getPropertyPath()), v.getMessage()));
        return resposta(HttpStatus.BAD_REQUEST, montarMensagemValidacao(campos.values()), req, campos);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErroResposta> tratarCorpoInvalido(HttpMessageNotReadableException ex, HttpServletRequest req) {
        return resposta(HttpStatus.BAD_REQUEST, mensagemCorpoInvalido(ex), req);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErroResposta> tratarTipoParametro(MethodArgumentTypeMismatchException ex, HttpServletRequest req) {
        String mensagem = "O parâmetro '" + ex.getName() + "' recebeu um valor inválido: '" + ex.getValue() + "'.";
        return resposta(HttpStatus.BAD_REQUEST, mensagem, req);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErroResposta> tratarParametroAusente(MissingServletRequestParameterException ex, HttpServletRequest req) {
        return resposta(HttpStatus.BAD_REQUEST,
                "O parâmetro obrigatório '" + ex.getParameterName() + "' não foi informado.", req);
    }

    // ----------------------------------------------------------------- HTTP

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErroResposta> tratarMetodo(HttpRequestMethodNotSupportedException ex, HttpServletRequest req) {
        return resposta(HttpStatus.METHOD_NOT_ALLOWED,
                "O método " + ex.getMethod() + " não é suportado neste endereço.", req);
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ErroResposta> tratarMediaType(HttpMediaTypeNotSupportedException ex, HttpServletRequest req) {
        return resposta(HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                "Formato de dados não suportado. Envie os dados em JSON (Content-Type: application/json).", req);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErroResposta> tratarRotaInexistente(NoResourceFoundException ex, HttpServletRequest req) {
        return resposta(HttpStatus.NOT_FOUND, "Endereço não encontrado: " + req.getRequestURI(), req);
    }

    // ------------------------------------------------------------ segurança

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErroResposta> tratarAcessoNegado(AccessDeniedException ex, HttpServletRequest req) {
        if (!usuarioAutenticado()) {
            return resposta(HttpStatus.UNAUTHORIZED, "Você precisa fazer login para continuar.", req);
        }
        return resposta(HttpStatus.FORBIDDEN, "Você não tem permissão para realizar esta ação.", req);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErroResposta> tratarAutenticacao(AuthenticationException ex, HttpServletRequest req) {
        return resposta(HttpStatus.UNAUTHORIZED, "Você precisa fazer login para continuar.", req);
    }

    // ------------------------------------------------------------- banco

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErroResposta> tratarIntegridade(DataIntegrityViolationException ex, HttpServletRequest req) {
        log.warn("Violação de integridade em {} {}: {}", req.getMethod(), req.getRequestURI(),
                ex.getMostSpecificCause().getMessage());
        return resposta(HttpStatus.CONFLICT,
                "A operação não pôde ser concluída porque viola uma regra dos dados "
                        + "(registro duplicado, campo obrigatório vazio ou vínculo com outros registros).", req);
    }

    @ExceptionHandler({ CannotCreateTransactionException.class, DataAccessResourceFailureException.class })
    public ResponseEntity<ErroResposta> tratarBancoIndisponivel(Exception ex, HttpServletRequest req) {
        log.error("Banco de dados indisponível em {} {}", req.getMethod(), req.getRequestURI(), ex);
        return resposta(HttpStatus.SERVICE_UNAVAILABLE,
                "Não foi possível conectar ao banco de dados. Tente novamente em instantes.", req);
    }

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ErroResposta> tratarBanco(DataAccessException ex, HttpServletRequest req) {
        log.error("Erro de acesso a dados em {} {}", req.getMethod(), req.getRequestURI(), ex);
        return resposta(HttpStatus.INTERNAL_SERVER_ERROR,
                "Ocorreu um erro ao acessar o banco de dados. Tente novamente mais tarde.", req);
    }

    // ------------------------------------------------------------ genérico

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErroResposta> tratarInesperado(Exception ex, HttpServletRequest req) {
        log.error("Erro inesperado em {} {}", req.getMethod(), req.getRequestURI(), ex);
        return resposta(HttpStatus.INTERNAL_SERVER_ERROR,
                "Ocorreu um erro interno inesperado. Tente novamente mais tarde.", req);
    }

    // ============================================================ auxiliares

    private ResponseEntity<ErroResposta> resposta(HttpStatusCode status, String mensagem, HttpServletRequest req) {
        return resposta(status, mensagem, req, null);
    }

    private ResponseEntity<ErroResposta> resposta(HttpStatusCode status, String mensagem, HttpServletRequest req,
                                                  Map<String, String> campos) {
        HttpStatus conhecido = HttpStatus.resolve(status.value());
        String erro = conhecido != null ? conhecido.getReasonPhrase() : String.valueOf(status.value());
        return ResponseEntity.status(status)
                .body(ErroResposta.de(status.value(), erro, mensagem, req.getRequestURI(), campos));
    }

    private static String montarMensagemValidacao(java.util.Collection<String> mensagens) {
        if (mensagens.isEmpty()) {
            return "Dados inválidos. Confira os campos e tente novamente.";
        }
        if (mensagens.size() == 1) {
            return mensagens.iterator().next();
        }
        return "Confira os dados informados:\n- " + String.join("\n- ", mensagens);
    }

    private static String mensagemOuPadrao(String mensagem, String padrao) {
        return mensagem == null || mensagem.isBlank() ? padrao : mensagem;
    }

    private static boolean usuarioAutenticado() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.isAuthenticated() && !(auth instanceof AnonymousAuthenticationToken);
    }

    /** Traduz erros de leitura do JSON (JSON malformado, enum inválido, data em formato errado...). */
    private static String mensagemCorpoInvalido(HttpMessageNotReadableException ex) {
        String original = ex.getMessage() == null ? "" : ex.getMessage();
        if (original.startsWith("Required request body is missing")) {
            return "O corpo da requisição é obrigatório.";
        }

        String campo = caminhoDoCampo(ex);
        if (campo == null) {
            return "Não foi possível ler os dados enviados. Verifique se o JSON está correto.";
        }

        StringBuilder mensagem = new StringBuilder("Valor inválido para o campo '").append(campo).append("'.");
        Class<?> tipo = tipoAlvo(ex);
        if (tipo != null && tipo.isEnum()) {
            mensagem.append(" Valores aceitos: ").append(valoresAceitos(tipo)).append('.');
        } else if (contemCausa(ex, DateTimeParseException.class) || (tipo != null && tipo.getName().startsWith("java.time"))) {
            mensagem.append(" Use o formato yyyy-MM-dd para datas e HH:mm para horários.");
        } else if (tipo != null && Number.class.isAssignableFrom(tipo)) {
            mensagem.append(" Informe um número.");
        }
        return mensagem.toString();
    }

    /**
     * Lê o caminho do campo da exceção do Jackson via reflexão, funcionando tanto com Jackson 2
     * (com.fasterxml) quanto com Jackson 3 (tools.jackson), usado pelo Spring Boot 4.
     */
    private static String caminhoDoCampo(Throwable ex) {
        for (Throwable t = ex; t != null; t = t.getCause() == t ? null : t.getCause()) {
            Object caminho = invocar(t, "getPath");
            if (caminho instanceof List<?> referencias && !referencias.isEmpty()) {
                StringBuilder sb = new StringBuilder();
                for (Object ref : referencias) {
                    Object nome = invocar(ref, "getPropertyName");
                    if (nome == null) {
                        nome = invocar(ref, "getFieldName");
                    }
                    if (nome != null) {
                        if (sb.length() > 0) sb.append('.');
                        sb.append(nome);
                    } else if (invocar(ref, "getIndex") instanceof Integer indice && indice >= 0) {
                        sb.append('[').append(indice).append(']');
                    }
                }
                if (sb.length() > 0) {
                    return sb.toString();
                }
            }
        }
        return null;
    }

    private static Class<?> tipoAlvo(Throwable ex) {
        for (Throwable t = ex; t != null; t = t.getCause() == t ? null : t.getCause()) {
            if (invocar(t, "getTargetType") instanceof Class<?> tipo) {
                return tipo;
            }
        }
        return null;
    }

    private static boolean contemCausa(Throwable ex, Class<? extends Throwable> tipo) {
        for (Throwable t = ex; t != null; t = t.getCause() == t ? null : t.getCause()) {
            if (tipo.isInstance(t)) return true;
        }
        return false;
    }

    private static String valoresAceitos(Class<?> tipoEnum) {
        Method label = null;
        try {
            label = tipoEnum.getMethod("getLabel");
        } catch (NoSuchMethodException ignorado) {
            // enum sem rótulo: usa o nome da constante
        }
        final Method rotulo = label;
        return Arrays.stream(tipoEnum.getEnumConstants())
                .map(constante -> {
                    if (rotulo != null) {
                        try {
                            return String.valueOf(rotulo.invoke(constante));
                        } catch (ReflectiveOperationException ignorado) {
                            // cai para o nome
                        }
                    }
                    return ((Enum<?>) constante).name();
                })
                .collect(Collectors.joining(", "));
    }

    private static Object invocar(Object alvo, String metodo) {
        try {
            Method m = alvo.getClass().getMethod(metodo);
            try {
                m.setAccessible(true);
            } catch (RuntimeException ignorado) {
                // método público: segue sem setAccessible
            }
            return m.invoke(alvo);
        } catch (ReflectiveOperationException | RuntimeException e) {
            return null;
        }
    }
}
