import { useCallback, useEffect, useState, type FormEvent } from 'react';
import GroupIcon from '@mui/icons-material/Group';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import './membros.css';
import { exibirErro, lancarSeErro } from '../../services/api/erroApi';
import { LegendaObrigatorio, RotuloObrigatorio } from '../components/campoObrigatorio/campoObrigatorio';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

type Membro = {
  id: number;
  nome: string;
  email: string;
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

export function Membros() {
  const [familia, setFamilia] = useState<Familia | null>(null);
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
  const trocaSenhaValida = Boolean(senhaAtual.trim() && novaSenha.trim());
  const novoMembroValido = Boolean(nome.trim() && email.trim() && senhaInicial.trim() && perfil);

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
      await lancarSeErro(response, 'Não foi possível carregar os membros.');
      const dados: Familia = await response.json();
      setFamilia(dados);
    } catch (error) {
      setErro(exibirErro(error, 'Não foi possível carregar os membros.'));
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
      await lancarSeErro(response, 'Não foi possível trocar a senha.');

      setSenhaAtual('');
      setNovaSenha('');
      setSucesso('Senha atualizada. Carregando os membros da família...');
      await carregarFamilia();
    } catch (error) {
      exibirErro(error, 'Não foi possível trocar a senha.');
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
      await lancarSeErro(response, 'Não foi possível adicionar o membro.');

      const novoMembro: Membro = await response.json();
      setFamilia((atual) =>
        atual ? { ...atual, membros: [...atual.membros, novoMembro] } : atual
      );
      setNome('');
      setEmail('');
      setSenhaInicial('');
      setPerfil(PERFIS_FAMILIA.Membro);
      setSucesso('Membro adicionado à família.');
    } catch (error) {
      exibirErro(error, 'Não foi possível adicionar o membro.');
    } finally {
      setEnviando(false);
    }
  }

  // Regra de verificação de permissão: true se o usuário for membro da casa
  const ehMembroSemPermissao = perfilUsuario === PERFIS_FAMILIA.Membro;

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
            <LegendaObrigatorio />
            <label>
              <RotuloObrigatorio>Senha provisória atual</RotuloObrigatorio>
              <input
                type="password"
                autoComplete="current-password"
                value={senhaAtual}
                onChange={(event) => setSenhaAtual(event.target.value)}
                required
              />
            </label>
            <label>
              <RotuloObrigatorio>Nova senha</RotuloObrigatorio>
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
            {sucesso && <p className="membros-alert membros-alert-success" role="status">{sucesso}</p>}
            <button className="membros-submit" type="submit" disabled={enviando || !trocaSenhaValida}>
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
                  </li>
                ))}
              </ul>
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
              <fieldset disabled={ehMembroSemPermissao || enviando || carregando} style={{ border: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <LegendaObrigatorio />
                <label>
                  <RotuloObrigatorio>Nome</RotuloObrigatorio>
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
                  <RotuloObrigatorio>E-mail</RotuloObrigatorio>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </label>
                <label>
                  <RotuloObrigatorio>Perfil</RotuloObrigatorio>
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
                  <RotuloObrigatorio>Senha inicial</RotuloObrigatorio>
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
                {sucesso && (
                  <p className="membros-alert membros-alert-success" role="status">{sucesso}</p>
                )}

                <button
                  className="membros-submit"
                  type="submit"
                  disabled={ehMembroSemPermissao || enviando || carregando || !familia || !novoMembroValido}
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