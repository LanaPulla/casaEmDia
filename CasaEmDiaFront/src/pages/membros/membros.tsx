import { useCallback, useEffect, useState, type FormEvent } from 'react';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import './membros.css';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

type Membro = {
  id: number;
  nome: string;
  email: string;
  perfil: { nome: PerfilFamilia };
};

const PERFIS_FAMILIA = {
  Membro: 'MEMBRO_CASA',
  Administrador: 'ADMINISTRADOR_CASA',
} as const;

type PerfilFamilia = typeof PERFIS_FAMILIA[keyof typeof PERFIS_FAMILIA];

type Familia = {
  id: number;
  nome: string;
  membros: Membro[];
};

function mensagemParaStatus(status: number) {
  if (status === 400) return 'Confira os dados, o perfil escolhido e as regras para alteração.';
  if (status === 401) return 'Sua sessão expirou. Entre novamente para gerenciar sua família.';
  if (status === 403) return 'Você não tem permissão para gerenciar os membros desta família.';
  if (status === 409) return 'Este e-mail já está cadastrado.';
  return 'Não foi possível concluir a solicitação. Tente novamente.';
}

export function Membros() {
  const [familia, setFamilia] = useState<Familia | null>(null);
  const [perfisEditados, setPerfisEditados] = useState<Record<number, PerfilFamilia>>({});
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senhaInicial, setSenhaInicial] = useState('');
  const [perfil, setPerfil] = useState<PerfilFamilia>(PERFIS_FAMILIA.Membro);
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [trocaSenhaNecessaria, setTrocaSenhaNecessaria] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  // Estado para armazenar a string do perfil logado
  const [perfilUsuario, setPerfilUsuario] = useState<string | null>(null);

  const carregarFamilia = useCallback(async () => {
    setCarregando(true);
    setErro('');
    setTrocaSenhaNecessaria(false);

    // Obtém o valor do localStorage
    let perfilSalvo = localStorage.getItem('perfilUsuario');
    
    // Tratamento para caso tenha sido salvo como objeto JSON no localStorage
    if (perfilSalvo && perfilSalvo.startsWith('{')) {
      try {
        const parsed = JSON.parse(perfilSalvo);
        perfilSalvo = parsed.nome ?? parsed;
      } catch {
        // Manteve valor original caso falhe o parse
      }
    }

    setPerfilUsuario(perfilSalvo);

    try {
      const response = await fetch(`${API_URL}/api/familia`, {
        credentials: 'include',
      });
      if (response.status === 403) {
        setTrocaSenhaNecessaria(true);
        return;
      }
      if (!response.ok) {
        throw new Error(mensagemParaStatus(response.status));
      }
      const dados: Familia = await response.json();
      setFamilia(dados);
      setPerfisEditados(Object.fromEntries(
        dados.membros.map((membro) => [membro.id, membro.perfil.nome])
      ));
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível carregar os membros.');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void carregarFamilia();
  }, [carregarFamilia]);

  async function trocarSenha(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro('');
    setSucesso('');
    setEnviando(true);

    try {
      const response = await fetch(`${API_URL}/api/usuario/trocar-senha`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senhaAtual, novaSenha }),
      });
      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('Confira a senha atual e escolha uma nova senha diferente, com 8 a 72 caracteres.');
        }
        throw new Error(mensagemParaStatus(response.status));
      }

      setSenhaAtual('');
      setNovaSenha('');
      setSucesso('Senha atualizada. Carregando os membros da família...');
      await carregarFamilia();
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível trocar a senha.');
    } finally {
      setEnviando(false);
    }
  }

  async function adicionarMembro(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro('');
    setSucesso('');
    setEnviando(true);

    try {
      const response = await fetch(`${API_URL}/api/familia/membros`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome,
          email,
          senhaInicial,
          perfil,
        }),
      });
      if (!response.ok) {
        throw new Error(mensagemParaStatus(response.status));
      }

      const novoMembro: Membro = await response.json();
      setFamilia((atual) =>
        atual ? { ...atual, membros: [...atual.membros, novoMembro] } : atual
      );
      setPerfisEditados((atual) => ({ ...atual, [novoMembro.id]: novoMembro.perfil.nome }));
      setNome('');
      setEmail('');
      setSenhaInicial('');
      setPerfil(PERFIS_FAMILIA.Membro);
      setSucesso('Membro adicionado à família.');
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível adicionar o membro.');
    } finally {
      setEnviando(false);
    }
  }

  async function atualizarPerfil(membro: Membro) {
    setErro('');
    setSucesso('');
    setEnviando(true);

    try {
      const response = await fetch(`${API_URL}/api/familia/membros/${membro.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: membro.nome,
          perfil: perfisEditados[membro.id] ?? membro.perfil.nome,
        }),
      });
      if (!response.ok) {
        throw new Error(mensagemParaStatus(response.status));
      }

      const membroAtualizado: Membro = await response.json();
      setFamilia((atual) => atual
        ? {
            ...atual,
            membros: atual.membros.map((item) =>
              item.id === membroAtualizado.id ? membroAtualizado : item
            ),
          }
        : atual);
      setPerfisEditados((atual) => ({
        ...atual,
        [membroAtualizado.id]: membroAtualizado.perfil.nome,
      }));
      setSucesso(`Perfil de ${membroAtualizado.nome} atualizado. As permissões entram em vigor no próximo login.`);
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível atualizar o perfil.');
    } finally {
      setEnviando(false);
    }
  }

  // Regra de verificação de permissão: true se o usuário for membro da casa
  const ehMembroSemPermissao = perfilUsuario === PERFIS_FAMILIA.Membro;
  const podeGerenciarMembros = perfilUsuario === PERFIS_FAMILIA.Administrador;
  const usuarioId = Number(localStorage.getItem('usuarioId'));

  return (
    <section className="membros-page">
      <header className="membros-heading">
        <div className="membros-heading-icon" aria-hidden="true">
          <GroupIcon />
        </div>
        <div>
          <span className="membros-eyebrow">SUA CASA, EM EQUIPE</span>
          <h1>Membros da família</h1>
          <p>Convide quem mora com você para organizar a rotina da casa.</p>
        </div>
      </header>

      {trocaSenhaNecessaria && !carregando && (
        <section className="membros-card membros-password-card" aria-labelledby="trocar-senha-titulo">
          <div className="membros-card-heading">
            <div>
              <h2 id="trocar-senha-titulo">Atualize sua senha para continuar</h2>
              <p>Seu acesso foi criado com uma senha provisória. Troque-a para abrir a área da família.</p>
            </div>
          </div>
          <form className="membros-form" onSubmit={trocarSenha}>
            <label>
              Senha provisória atual
              <input
                type="password"
                autoComplete="current-password"
                value={senhaAtual}
                onChange={(event) => setSenhaAtual(event.target.value)}
                required
              />
            </label>
            <label>
              Nova senha
              <input
                type="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={72}
                value={novaSenha}
                onChange={(event) => setNovaSenha(event.target.value)}
                required
              />
              <small>Use entre 8 e 72 caracteres, diferente da senha provisória.</small>
            </label>
            {erro && <p className="membros-alert membros-alert-error" role="alert">{erro}</p>}
            {sucesso && <p className="membros-alert membros-alert-success" role="status">{sucesso}</p>}
            <button className="membros-submit" type="submit" disabled={enviando}>
              {enviando ? 'Atualizando...' : 'Trocar senha'}
            </button>
          </form>
        </section>
      )}

      {erro && !familia && !trocaSenhaNecessaria && !carregando && (
        <p className="membros-alert membros-alert-error" role="alert">{erro}</p>
      )}

      {!trocaSenhaNecessaria && (
        <div className="membros-grid">
          <section className="membros-card membros-list-card" aria-labelledby="lista-membros-titulo">
            <div className="membros-card-heading">
              <div>
                <h2 id="lista-membros-titulo">Quem faz parte</h2>
                <p>
                  {familia ? familia.nome : 'Integrantes da sua família'}
                  {familia && ` · ${familia.membros.length} ${familia.membros.length === 1 ? 'pessoa' : 'pessoas'}`}
                </p>
              </div>
              <span className="membros-count">{familia?.membros.length ?? '—'}</span>
            </div>

            {carregando && <p className="membros-feedback">Carregando membros...</p>}
            {!carregando && familia && familia.membros.length === 0 && (
              <div className="membros-empty">
                <GroupIcon />
                <p>Ainda não há outros membros cadastrados.</p>
                <span>Adicione alguém da família pelo formulário.</span>
              </div>
            )}
            {!carregando && familia && familia.membros.length > 0 && (
              <ul className="membros-list">
                {familia.membros.map((membro) => (
                  <li className="membro-item" key={membro.id}>
                    <span className="membro-avatar" aria-hidden="true">
                      {membro.nome.trim().charAt(0).toLocaleUpperCase()}
                    </span>
                    <span className="membro-detalhes">
                      <strong>{membro.nome}</strong>
                      <span>{membro.email}</span>
                    </span>
                    {podeGerenciarMembros && membro.id !== usuarioId && (
                      <span className="membro-acoes">
                        <select
                          aria-label={`Perfil de ${membro.nome}`}
                          value={perfisEditados[membro.id] ?? membro.perfil.nome}
                          onChange={(event) => setPerfisEditados((atual) => ({
                            ...atual,
                            [membro.id]: event.target.value as PerfilFamilia,
                          }))}
                          disabled={enviando || carregando}
                        >
                          <option value={PERFIS_FAMILIA.Membro}>Membro</option>
                          <option value={PERFIS_FAMILIA.Administrador}>Administrador</option>
                        </select>
                        <button
                          className="membros-submit"
                          type="button"
                          onClick={() => void atualizarPerfil(membro)}
                          disabled={enviando || carregando
                            || (perfisEditados[membro.id] ?? membro.perfil.nome) === membro.perfil.nome}
                        >
                          Salvar
                        </button>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {erro && familia && (
              <p className="membros-alert membros-alert-error" role="alert">{erro}</p>
            )}
            {sucesso && familia && (
              <p className="membros-alert membros-alert-success" role="status">{sucesso}</p>
            )}
          </section>

          <section className="membros-card membros-form-card" aria-labelledby="novo-membro-titulo">
            <div className="membros-card-heading">
              <div>
                <h2 id="novo-membro-titulo">Adicionar pessoa</h2>
                <p>Crie o acesso para um novo integrante.</p>
              </div>
              <PersonAddAlt1Icon className="membros-form-icon" aria-hidden="true" />
            </div>

            {/* Aviso opcional informando o motivo de estar bloqueado */}
            {ehMembroSemPermissao && (
              <p className="membros-alert membros-alert-error">
                Apenas administradores podem cadastrar novos membros.
              </p>
            )}

            <form className="membros-form" onSubmit={adicionarMembro}>
              {/* O fieldset com disabled desabilita todos os inputs e selects de uma vez */}
              <fieldset disabled={!podeGerenciarMembros || enviando || carregando} style={{ border: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <label>
                  Nome
                  <input
                    type="text"
                    autoComplete="name"
                    maxLength={120}
                    value={nome}
                    onChange={(event) => setNome(event.target.value)}
                    required
                  />
                </label>
                <label>
                  E-mail
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </label>
                <label>
                  Perfil
                  <select
                    value={perfil}
                    onChange={(event) => setPerfil(event.target.value as PerfilFamilia)}
                    required
                  >
                    <option value={PERFIS_FAMILIA.Membro}>Membro da família</option>
                    <option value={PERFIS_FAMILIA.Administrador}>Administrador da família</option>
                  </select>
                </label>
                <label>
                  Senha inicial
                  <input
                    type="password"
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={72}
                    value={senhaInicial}
                    onChange={(event) => setSenhaInicial(event.target.value)}
                    required
                  />
                  <small>Use entre 8 e 72 caracteres.</small>
                </label>
                <button
                  className="membros-submit"
                  type="submit"
                  disabled={!podeGerenciarMembros || enviando || carregando || !familia}
                >
                  <PersonAddAlt1Icon fontSize="small" />
                  {enviando ? 'Adicionando...' : 'Adicionar membro'}
                </button>
              </fieldset>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}