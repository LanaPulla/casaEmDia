-- 1. Inserir as permissoes. Os nomes sao unicos para permitir reexecutar este script.
INSERT INTO permissoes (nome, descricao) VALUES
('GERENCIAR_FAMILIA', 'Permite criar a familia, adicionar e remover membros'),
('CRIAR_TAREFA', 'Permite gerenciar e criar novas tarefas domesticas'),
('ATUALIZAR_STATUS_TAREFA', 'Permite atualizar o andamento das atividades'),
('DELETAR_TAREFA', 'Permite remover tarefas domesticas'),
('CRIAR_COMPROMISSO', 'Permite cadastrar compromissos na agenda familiar'),
('VER_AGENDA', 'Permite visualizar a agenda e compromissos')
ON CONFLICT (nome) DO NOTHING;

-- 2. Inserir os perfis (roles).
INSERT INTO perfis (nome) VALUES
('DEV'),
('ADMINISTRADOR_CASA'),
('MEMBRO_CASA')
ON CONFLICT (nome) DO NOTHING;

-- 3. Associar permissoes aos perfis (tabela de ligacao ManyToMany).

-- DEV tem acesso a todas as permissoes cadastradas neste script.
INSERT INTO perfil_permissoes (perfil_id, permissao_id)
SELECT perfil.id, permissao.id
FROM perfis perfil
CROSS JOIN permissoes permissao
WHERE perfil.nome = 'DEV'
ON CONFLICT DO NOTHING;

-- ADMINISTRADOR_CASA faz a gestao completa da casa.
INSERT INTO perfil_permissoes (perfil_id, permissao_id)
SELECT perfil.id, permissao.id
FROM perfis perfil
JOIN permissoes permissao ON permissao.nome IN (
    'GERENCIAR_FAMILIA',
    'CRIAR_TAREFA',
    'ATUALIZAR_STATUS_TAREFA',
    'DELETAR_TAREFA',
    'CRIAR_COMPROMISSO',
    'VER_AGENDA'
)
WHERE perfil.nome = 'ADMINISTRADOR_CASA'
ON CONFLICT DO NOTHING;

-- MEMBRO_CASA pode criar tarefas e atualizar o andamento delas.
INSERT INTO perfil_permissoes (perfil_id, permissao_id)
SELECT perfil.id, permissao.id
FROM perfis perfil
JOIN permissoes permissao ON permissao.nome IN (
    'ATUALIZAR_STATUS_TAREFA',
    'CRIAR_TAREFA'
)
WHERE perfil.nome = 'MEMBRO_CASA'
ON CONFLICT DO NOTHING;
