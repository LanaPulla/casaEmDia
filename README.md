# Casa Em Dia 🏡

## Sobre
 
O **Sistema Casa Em Dia** tem como objetivo auxiliar famílias na organização das atividades do dia a dia por meio de uma plataforma integrada. O sistema permite o gerenciamento de finanças domésticas, tarefas, listas de compras e compromissos importantes, facilitando a comunicação e a divisão de responsabilidades entre os membros da família.

---
 
## Tecnologias
 
### Back-end
- **Java 17** com **Spring Boot**
### Front-end
- **React** com **Vite** e **Bootstrap**
### Banco de Dados
- **Supabase** (PostgreSQL gerenciado na nuvem)
---
 
## Pré-requisitos
 
Antes de começar, certifique-se de ter instalado:
 
- **JDK 17** — descompactado em `C:\` e configurado como variável de ambiente:
```
  JAVA_HOME = C:\Program Files\Java\jdk-17
```
  Adicione também ao `PATH`:
```
  %JAVA_HOME%\bin
```
- **Node.js** (versão LTS recomendada) — [nodejs.org](https://nodejs.org)
- **Git** — [git-scm.com](https://git-scm.com)
### Extensões recomendadas para VS Code
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
3. Copie a **URL de conexão** e as **credenciais** disponíveis em *Settings > Database*.
### Variáveis de Ambiente
 
#### Back-end
 
Na pasta `backend/`, crie um arquivo `application.properties` ou `application.yml` (se ainda não existir) com as seguintes variáveis:
 
```properties
# application.properties
 
spring.datasource.url=jdbc:postgresql://<HOST_SUPABASE>:5432/<NOME_DO_BANCO>
spring.datasource.username=<SEU_USUARIO>
spring.datasource.password=<SUA_SENHA>
 
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```
 
> ⚠️ **Nunca versione** o arquivo com credenciais reais. Adicione-o ao `.gitignore`.
 
#### Front-end
 
Na pasta `frontend/`, crie um arquivo `.env`:
 
```env
VITE_API_URL=http://localhost:8080
```
 
---
 
## Como executar
 
### Front-end
 
```bash
# Acesse a pasta do front-end
cd frontend
 
# Instale as dependências
npm install
 
# Inicie o servidor de desenvolvimento
npm run dev
```
 
A aplicação estará disponível em: `http://localhost:5173`
 
### Back-end
 
1. Confirme que o banco Supabase está **ativo** (status "Production" no painel).
2. Abra o projeto `backend/` no **VS Code**.
3. Use o painel do **Spring Boot Dashboard** (fornecido pela extensão) para iniciar a aplicação, clicando no botão ▶ ao lado do projeto.
   - Alternativamente, é possível rodar pela IDE **IntelliJ IDEA**.
O servidor estará disponível em: `http://localhost:8080`
 
---
 
## Como testar
 
> *(Seção a ser preenchida conforme os testes forem implementados no projeto.)*

---
 
## Como fazer build
 
### Front-end
 
```bash
cd frontend
npm run build
```
 
Os arquivos de produção serão gerados na pasta `frontend/dist/`.
 
### Back-end
 
```bash
cd backend
./mvnw clean package
```
 
O `.jar` executável será gerado em `backend/target/`.
 
---
 
## Estrutura do Projeto
 
```
casaEmDia/
├── backend/                  # API REST em Spring Boot
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/         # Código-fonte Java
│   │   │   └── resources/    # application.properties, etc.
│   │   └── test/             # Testes unitários e de integração
│   └── pom.xml
│
├── frontend/                 # Aplicação React
│   ├── public/
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── pages/            # Páginas da aplicação
│   │   ├── services/         # Chamadas à API
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
└── README.md
```
 
---
 
## Arquitetura
 
O sistema segue uma arquitetura **cliente-servidor** desacoplada:
 
```
┌─────────────────┐        HTTP/REST        ┌──────────────────┐
│   Front-end     │  ──────────────────────▶ │   Back-end       │
│   React + Vite  │                          │  Spring Boot     │
│  (porta 5173)   │ ◀──────────────────────  │  (porta 8080)    │
└─────────────────┘        JSON              └────────┬─────────┘
                                                      │
                                                      │ JDBC / JPA
                                                      ▼
                                             ┌──────────────────┐
                                             │    Supabase      │
                                             │  (PostgreSQL)    │
                                             └──────────────────┘
```
 
- O **front-end** (React) é responsável pela interface do usuário e consome a API REST.
- O **back-end** (Spring Boot) expõe os endpoints REST, aplica as regras de negócio e persiste os dados.
- O **banco de dados** (Supabase/PostgreSQL) é gerenciado na nuvem e acessado pelo back-end via JPA/Hibernate.
---
 
## Funcionalidades
 
- [] Cadastro e login de usuários
- [] Criação e gerenciamento de famílias
- [] Controle de receitas e despesas
- [] Histórico financeiro
- [] Cadastro e gerenciamento de tarefas domésticas (com status: Pendente / Em andamento / Concluída)
- [] Lista de compras com marcação de itens
- [] Agenda de compromissos familiares
---
 
## Equipe
 
Desenvolvido por:
 
| Nome | GitHub |
|------|--------|
| Maria Alice Silveira | mariaaliceASS |
| Lana Pulla | LanaPulla |
| Amanda Dutra | oi-nanda |
| Camila Liquer | LiquerCami |
