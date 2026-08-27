# Diagrama de Casos de Uso

*Sistema de Gerenciamento Familiar*

## Atores

- **Usuário**: membro da família (papel base).
- **Administrador**: herda as ações de Usuário e possui permissões adicionais de gestão.

## Casos de uso do Usuário

- Atualizar status das tarefas *(inclui Fazer login)*
- Marcar item como comprado *(inclui Fazer login)*
- Consultar movimentações financeiras *(inclui Fazer login)*
- Fazer login

## Casos de uso do Administrador

- Gerenciar família
- Cadastrar compromissos
- Cadastrar tarefas domésticas
- Cadastrar receitas e despesas
- Criar listas de compras
- Cadastrar usuário

> O Administrador também tem acesso a todos os casos de uso do Usuário (relação de herança entre os atores).

## Representação (texto)

```
                 Sistema de Gerenciamento Familiar
 Usuário ──▶ Atualizar status das tarefas ──<<include>>──▶ Fazer login
         ──▶ Marcar item como comprado     ──<<include>>──▶ Fazer login
         ──▶ Consultar movimentações financeiras ─<<include>>─▶ Fazer login

 Administrador (herda de Usuário) ──▶ Gerenciar família
                                   ──▶ Cadastrar compromissos
                                   ──▶ Cadastrar tarefas domésticas
                                   ──▶ Cadastrar receitas e despesas
                                   ──▶ Criar listas de compras
                                   ──▶ Cadastrar usuário
```
