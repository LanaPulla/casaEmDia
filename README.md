# Casa Em Dia 🏡

## Sobre

O **Sistema Casa Em Dia** tem como objetivo auxiliar famílias na organização das atividades do dia a dia por meio de uma plataforma integrada. Hoje o sistema permite cadastrar a família e seus membros, dividir as **tarefas domésticas** entre eles e manter uma **agenda de compromissos** compartilhada, com permissões diferentes para administradores e membros da casa.

## Tecnologias

### Back-end

- **Java 17** com **Spring Boot**

### Front-end

- **React** com **Vite** e **Bootstrap**

### Banco de Dados

- **Supabase** (PostgreSQL gerenciado na nuvem), acessado via JPA/Hibernate

---

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **JDK 17** — configurado como variável de ambiente:
  ```
  JAVA_HOME = C:\Program Files\Java\jdk-17
  ```
  Adicione também ao `PATH`:
  ```
  %JAVA_HOME%\bin
  ```
- **Node.js** (versão LTS recomendada) — [nodejs.org](https://nodejs.org)
- **Git** — [git-scm.com](https://git-scm.com)

### Extensões para VS Code

- [Extension Pack for Java](https://marketplace.visualstudio.com/items?itemName=vscjava.vscode-java-pack)
- [Spring Boot Extension Pack](https://marketplace.visualstudio.com/items?itemName=vmware.vscode-boot-dev-pack)

---

## Instalação

Clone o repositório:

```bash
git clone https://github.com/LanaPulla/casaEmDia.git
cd casaEmDia
```

---

## Configuração

### Banco de Dados (Supabase)

1. Acesse [supabase.com](https://supabase.com) e faça login no projeto.
2. Verifique se o banco está **ativo** — deve aparecer com o indicador **"Production"** ao lado do branch `main`.
3. Copie a **URL de conexão** (Session Pooler) e as **credenciais** disponíveis em _Settings > Database_.

### Back-end

### Supabase - já configurado com o banco

> ⚠️ **Não mude** as credenciais reais do banco.

### Front-end

Na pasta `CasaEmDiaFront/`, o arquivo `.env` define o endereço da API:

```env
VITE_API_URL=http://localhost:8080
```

Se a variável não for definida, o front usa `http://localhost:8080` por padrão.

---

## Como executar

### Back-end

1. Confirme que o banco Supabase está **ativo** (status "Production" no painel).
2. Rode pelo terminal:

   ```bash
   cd CasaEmDiaAPI
   ./mvnw spring-boot:run      # Linux/macOS/Git Bash
   mvnw.cmd spring-boot:run    # Windows (cmd/PowerShell)
   ```

   - Alternativamente, abra a pasta `CasaEmDiaAPI/` no **VS Code** e use o **Spring Boot Dashboard** (botão ▶), ou rode pela **IntelliJ IDEA**.

O servidor estará disponível em: `http://localhost:8080`

### Front-end

```bash
cd CasaEmDiaFront
npm install
npm run dev
```

A aplicação estará disponível em: `http://localhost:5173`

## Como rodar os testes

### Back-end

```bash
cd CasaEmDiaAPI
./mvnw test
```

Testes existentes em `CasaEmDiaAPI/src/test`:

| Teste                                       | O que cobre                                                  |
| ------------------------------------------- | ------------------------------------------------------------ |
| `FamiliaServiceTest`                        | Cadastro de família, membros e regras de administração       |
| `UsuarioServiceTest`                        | Login e troca de senha                                       |
| `SessaoUsuarioServiceTest`                  | Controle da sessão do usuário logado                         |
| `controller/PermissaoAcessoIntegrationTest` | Acesso aos endpoints conforme as permissões do perfil        |
| `ApplicationTests`                          | Carregamento do contexto Spring (precisa do banco acessível) |

### Perfis e permissões

Definidos no [`data.sql`](CasaEmDiaAPI/src/main/resources/data.sql):

| Permissão                                                  | ADMINISTRADOR_CASA | MEMBRO_CASA | DEV |
| ---------------------------------------------------------- | :----------------: | :---------: | :-: |
| `GERENCIAR_FAMILIA` — editar a família e gerenciar membros |         ✅         |             | ✅  |
| `CRIAR_TAREFA`                                             |         ✅         |     ✅      | ✅  |
| `ATUALIZAR_STATUS_TAREFA`                                  |         ✅         |     ✅      | ✅  |
| `DELETAR_TAREFA`                                           |         ✅         |             | ✅  |
| `VER_AGENDA`                                               |         ✅         |     ✅      | ✅  |
| `CRIAR_COMPROMISSO`                                        |         ✅         |     ✅      | ✅  |
| `DELETAR_EVENTO`                                           |         ✅         |             | ✅  |

No front, os botões de exclusão só aparecem para `ADMINISTRADOR_CASA` e `DEV` (`src/util/permissoes.ts`).

---

## Funcionalidades

- [x] Cadastro de família com criação do usuário administrador
- [x] Login e logout com sessão
- [x] Primeiro acesso com troca obrigatória da senha provisória
- [x] Gerenciamento de membros (adicionar, editar, desativar e redefinir senha)
- [x] Perfis com permissões (Administrador da Casa, Membro da Casa)
- [x] Tarefas domésticas com responsável, prioridade (Baixa / Média / Alta), observação e data
- [x] Status de tarefas: Pendente / Em andamento / Concluída / Cancelada / Atrasada
- [x] Tarefas recorrentes: diária (30 dias), semanal (4 semanas) e mensal (3 meses)
- [x] Agenda familiar com data, horário de início e fim, local e categoria (Família, Consulta, Escola, Lazer, Outros)
- [x] Página inicial com resumo das tarefas e da agenda
- [ ] Controle de receitas e despesas
- [ ] Histórico financeiro
- [ ] Lista de compras com marcação de itens

---

## Equipe

Desenvolvido por:

| Nome                 | GitHub        |
| -------------------- | ------------- |
| Maria Alice Silveira | mariaaliceASS |
| Lana Pulla           | LanaPulla     |
| Amanda Dutra         | oi-nanda      |
| Camila Liquer        | LiquerCami    |
