# Tratamento de Erros (Backend + Front)

Este documento descreve o tratamento de erros padronizado do CasaEmDia: como o backend
responde quando algo dá errado e como o front exibe essa informação para o usuário.

> **Fora do escopo:** o módulo de **Agenda** não foi alterado, porque ainda está em
> implementação. Mesmo assim, o tratador global (descrito abaixo) já captura os erros das
> rotas `/api/agenda` automaticamente.

---

## 1. Visão geral

**Antes:**
- Cada exceção definia o status com `@ResponseStatus`, e o corpo da resposta era o padrão
  do Spring, sem uma mensagem legível.
- `RecursoNaoEncontradoException` não tinha status e virava **500**.
- `TarefaServiceImpl` usava `ResponseStatusException` direto.
- O front ignorava o corpo da resposta e escolhia a mensagem pelo código HTTP, com textos
  fixos repetidos em cada tela.

**Agora:**
- Todo erro da API volta no **mesmo formato JSON**, com uma `mensagem` em português.
- O front lê essa `mensagem` e a exibe em um **`alert`**.

```
[Controller/Service] --lança exceção--> [GlobalExceptionHandler] --JSON--> [Front: lancarSeErro] --> alert(mensagem)
```

---

## 2. Formato da resposta de erro

Todo erro retornado pela API segue o record `ErroResposta`:

```json
{
  "timestamp": "2026-11-12T19:40:00.123",
  "status": 400,
  "erro": "Bad Request",
  "mensagem": "Confira os dados informados:\n- O título da tarefa é obrigatório\n- O responsável é obrigatório",
  "caminho": "/tarefas",
  "campos": {
    "titulo": "O título da tarefa é obrigatório",
    "responsavelId": "O responsável é obrigatório"
  }
}
```

| Campo       | Descrição                                                          |
|-------------|--------------------------------------------------------------------|
| `timestamp` | Data/hora do erro                                                  |
| `status`    | Código HTTP                                                        |
| `erro`      | Nome do status HTTP                                                |
| `mensagem`  | **Texto exibido ao usuário** no front                              |
| `caminho`   | Rota chamada                                                       |
| `campos`    | (opcional) Erro de cada campo, só em erros de validação            |

---

## 3. Backend (`CasaEmDiaAPI`)

### 3.1 Arquivos novos — pacote `exception`

| Arquivo                       | O que faz                                                                                  |
|-------------------------------|--------------------------------------------------------------------------------------------|
| `ApiException.java`           | Classe base abstrata das exceções de negócio. Cada subclasse informa o seu `HttpStatus`.  |
| `ErroResposta.java`           | Record com o formato padrão da resposta de erro (seção 2).                                 |
| `GlobalExceptionHandler.java` | `@RestControllerAdvice` que captura as exceções de **todas** as rotas e monta a `ErroResposta`. |

### 3.2 Exceções existentes (agora herdam de `ApiException`)

| Exceção                         | Status | Quando é usada                                 |
|---------------------------------|--------|------------------------------------------------|
| `CustomException`               | 400    | Regra de negócio violada                       |
| `CredenciaisInvalidasException` | 401    | E-mail ou senha incorretos no login            |
| `NaoAutenticadoException`       | 401    | Sem sessão ativa                               |
| `AcessoNegadoException`         | 403    | Usuário logado, mas sem permissão              |
| `RecursoNaoEncontradoException` | 404    | Registro não existe (**antes retornava 500**)  |
| `EmailJaCadastradoException`    | 409    | E-mail já usado                                |

Para criar uma exceção nova, basta herdar de `ApiException`:

```java
public class MinhaException extends ApiException {
    public MinhaException(String mensagem) {
        super(HttpStatus.UNPROCESSABLE_ENTITY, mensagem);
    }
}
```

### 3.3 O que o `GlobalExceptionHandler` trata

| Situação                                                     | Status | Exemplo de mensagem                                                        |
|--------------------------------------------------------------|--------|----------------------------------------------------------------------------|
| Exceções de negócio (`ApiException`)                         | o da exceção | "E-mail já cadastrado: x@y.com"                                      |
| Validação `@Valid` (`MethodArgumentNotValidException`)       | 400    | Lista as mensagens de cada campo, por exemplo "O título da tarefa é obrigatório" |
| Validação de parâmetros / entidade (`HandlerMethodValidationException`, `ConstraintViolationException`) | 400 | Mensagens das constraints                     |
| JSON inválido / corpo ausente (`HttpMessageNotReadableException`) | 400 | "O corpo da requisição é obrigatório."                                |
| Enum com valor inválido                                      | 400    | "Valor inválido para o campo 'prioridade'. Valores aceitos: Baixa, Média, Alta." |
| Data/hora em formato errado                                  | 400    | "... Use o formato yyyy-MM-dd para datas e HH:mm para horários."          |
| Tipo errado na URL (ex.: `/tarefas/abc`)                     | 400    | "O parâmetro 'id' recebeu um valor inválido: 'abc'."                      |
| Parâmetro obrigatório ausente                                | 400    | "O parâmetro obrigatório 'x' não foi informado."                          |
| `@PreAuthorize` sem login                                    | 401    | "Você precisa fazer login para continuar."                                |
| `@PreAuthorize` sem permissão                                | 403    | "Você não tem permissão para realizar esta ação."                         |
| Rota inexistente                                             | 404    | "Endereço não encontrado: /api/xyz"                                       |
| Método HTTP não suportado                                    | 405    | "O método PATCH não é suportado neste endereço."                          |
| Content-Type diferente de JSON                               | 415    | "Formato de dados não suportado. Envie os dados em JSON..."               |
| Violação de integridade no banco (duplicado, FK, NOT NULL)   | 409    | "A operação não pôde ser concluída porque viola uma regra dos dados..."   |
| Banco indisponível                                           | 503    | "Não foi possível conectar ao banco de dados. Tente novamente em instantes." |
| Outros erros de banco                                        | 500    | "Ocorreu um erro ao acessar o banco de dados..."                          |
| `ResponseStatusException` / outros `ErrorResponseException`  | o da exceção | O `reason` informado                                                |
| Qualquer outro erro inesperado                               | 500    | "Ocorreu um erro interno inesperado. Tente novamente mais tarde."         |

Erros 500 e 503 são registrados no log com o stack trace completo. Ao usuário só aparece
uma mensagem genérica, sem detalhes internos.

> A leitura do campo com problema no JSON usa reflexão. Assim, ela funciona tanto com
> Jackson 2 quanto com Jackson 3 (padrão do Spring Boot 4).

### 3.4 Outros ajustes

- **`TarefaServiceImpl`:** `ResponseStatusException` foi trocado por:
  - `RecursoNaoEncontradoException("Tarefa não encontrada")`, que retorna 404;
  - `CustomException("Responsável não encontrado")`, que retorna 400.
- **`TarefaRequest`:** as validações ganharam mensagens em português, por exemplo
  "O título da tarefa é obrigatório" e "A observação deve ter no máximo 500 caracteres".

---

## 4. Front (`CasaEmDiaFront`)

### 4.1 Arquivo novo: `src/services/api/erroApi.ts`

| Exportação                        | O que faz                                                                                       |
|-----------------------------------|-------------------------------------------------------------------------------------------------|
| `lancarSeErro(response, padrao)`  | Se a resposta não for 2xx, lê a `mensagem` do backend e lança um `ErroHttp`. Se o corpo não trouxer mensagem, usa `padrao` (ou uma mensagem própria para 401, 403 e 5xx). |
| `exibirErro(error, padrao)`       | Registra o erro no console, mostra a mensagem em `alert` e a retorna.                           |
| `mensagemDeErro(error, padrao)`   | Converte qualquer erro em um texto amigável, sem exibir.                                        |
| `ErroHttp`                        | Classe de erro com `status` e `campos`. Antes ficava em `services/tarefas`, que continua reexportando a classe. |

Quando a API está desligada (falha de rede), a mensagem exibida é:
"Não foi possível conectar ao servidor. Verifique se a API está em execução e tente novamente."

Erros de código (bugs) **não** são mostrados crus ao usuário: aparece a mensagem padrão, e
o detalhe fica no console.

### 4.2 Como usar

```ts
import { lancarSeErro, exibirErro } from "../api/erroApi";

try {
  const response = await fetch(`${API_URL}/tarefas`, { method: "POST", ... });
  await lancarSeErro(response, "Não foi possível criar a tarefa.");
  // sucesso...
} catch (error) {
  exibirErro(error, "Não foi possível criar a tarefa.");
}
```

### 4.3 Arquivos alterados

| Arquivo                                             | Mudança                                                                 |
|-----------------------------------------------------|-------------------------------------------------------------------------|
| `services/tarefas/tarefas.tsx`                      | Usa `lancarSeErro`; `ErroHttp` foi movido para `erroApi`, com reexportação |
| `services/familia/familia.ts`                       | Usa `lancarSeErro`                                                      |
| `pages/login/login.tsx`                             | Tirou os `if` por status; a mensagem vem do backend e aparece em `alert` |
| `pages/membros/membros.tsx`                         | Tirou `mensagemParaStatus`; erros dos formulários aparecem em `alert`   |
| `pages/tarefas/tarefas.tsx`                         | Erro ao carregar membros aparece em `alert`                             |
| `pages/components/tarefas/listaTarefas.tsx`         | Erros de carregar, concluir e excluir aparecem em `alert`               |
| `pages/components/tarefas/novaTarefaButton.tsx`     | Erro ao criar aparece em `alert`                                        |
| `pages/components/tarefas/editarTarefaButton.tsx`   | Erro ao salvar aparece em `alert` (validações locais continuam no formulário) |
| `pages/components/navBar/navBar.tsx`                | Erro de logout aparece em `alert`                                       |

Mensagens que continuam na tela, além do alert:
- validações locais do formulário de edição de tarefa, como "Seleciona um responsável.";
- o aviso de falha ao carregar membros em `membros.tsx` e `tarefas.tsx`, porque ele controla
  o que é exibido na página.

---

## 5. Como testar

1. **Login inválido:** e-mail ou senha errados mostram o alert "E-mail ou senha inválidos".
2. **Cadastro com e-mail repetido:** mostra o alert "E-mail já cadastrado: ...".
3. **Senha curta no cadastro:** mostra o alert "A senha deve ter entre 8 e 72 caracteres".
4. **Excluir tarefa como membro sem permissão:** mostra o alert "Você não tem permissão para
   realizar esta ação.".
5. **API desligada:** qualquer ação mostra o alert de falha de conexão.
6. **Via Postman:** `POST /tarefas` com `{}` retorna 400 e a lista de campos obrigatórios em
   `campos`.

---

## 6. Observações

- A branch não altera nenhum arquivo do módulo de **Agenda**.
- O backend da `main` hoje **não compila por um problema anterior a esta branch**:
  - `EventoAgendaServiceImpl` usa `req.membroId()` e `.membro(...)`, mas esses campos não
    existem em `EventoAgendaRequest` nem em `EventoAgenda`;
  - isso deve ser resolvido por quem está implementando a Agenda.

---

## 7. Indicação visual de campos obrigatórios

Os formulários do front mostram com um **asterisco vermelho (*)** os campos que o backend
exige. No topo de cada formulário aparece a legenda "* Campo obrigatório".

Componente novo: `src/pages/components/campoObrigatorio/campoObrigatorio.tsx`
- `<RotuloObrigatorio>Nome</RotuloObrigatorio>`: mostra o texto do rótulo seguido do `*`.
- `<LegendaObrigatorio />`: mostra a legenda.

| Formulário                  | Campos obrigatórios (*)                                 | Opcionais          |
|-----------------------------|---------------------------------------------------------|--------------------|
| Cadastro (login.tsx)        | Nome da família, Nome do responsável, Email, Senha      | —                  |
| Login (login.tsx)           | Email, Senha                                            | —                  |
| Trocar senha (membros.tsx)  | Senha provisória atual, Nova senha                      | —                  |
| Adicionar membro (membros.tsx) | Nome, E-mail, Perfil, Senha inicial                  | —                  |
| Nova tarefa                 | Título, Responsável                                     | Data, Observação   |
| Editar tarefa               | Título, Responsável                                     | Observação         |

Observações:
- **Prioridade, Recorrência e Status** são obrigatórios no backend. Eles não levam `*`
  porque o formulário já vem com um valor selecionado.
- **Data da tarefa** é opcional. O atributo `required` foi removido do campo, e quando ela
  fica vazia o front envia `null` e o backend usa a data de hoje.
- O formulário da **Agenda** não foi alterado (módulo em implementação).
