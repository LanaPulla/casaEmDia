-- 1. INSERIR AS PERMISSÕES (Baseado nos Casos de Uso do PDF)
INSERT INTO permissoes (id, nome, descricao) VALUES
(1, 'GERENCIAR_FAMILIA', 'Permite criar a família, adicionar e remover membros'),
(2, 'CRIAR_TAREFA', 'Permite gerenciar e criar novas tarefas domésticas'),
(3, 'ATUALIZAR_STATUS_TAREFA', 'Permite atualizar o andamento das atividades'),
(6, 'CRIAR_COMPROMISSO', 'Permite cadastrar compromissos na agenda familiar'),
(7, 'VER_AGENDA', 'Permite visualizar a agenda e compromissos'),

-- 2. INSERIR OS PERFIS (Roles)
INSERT INTO perfis (id, nome) VALUES
(1, 'DEV'),
(2, 'ADMINISTRADOR_CASA'),
(3, 'MEMBRO_CASA');

-- 3. ASSOCIAR PERMISSÕES AOS PERFIS (Tabela de ligação ManyToMany)

-- PERFIL: DEV (ID 1) -> Tem acesso a absolutamente tudo (IDs 1 a 9)
INSERT INTO perfil_permissoes (perfil_id, permissao_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9);

-- PERFIL: ADMINISTRADOR_CASA (ID 2) -> Faz a gestão completa da casa
INSERT INTO perfil_permissoes (perfil_id, permissao_id) VALUES
(2, 1), -- GERENCIAR_FAMILIA
(2, 2), -- CRIAR_TAREFA
(2, 3), -- ATUALIZAR_STATUS_TAREFA
(2, 6), -- CRIAR_COMPROMISSO
(2, 7), -- VER_AGENDA

-- PERFIL: MEMBRO_CASA (ID 3) -> Foco em atualizar tarefas, ver agenda e marcar compras
INSERT INTO perfil_permissoes (perfil_id, permissao_id) VALUES
(3, 3), -- ATUALIZAR_STATUS_TAREFA (Apenas atualiza, não cria tarefa)
(3, 2), -- CRIAR_TAREFA