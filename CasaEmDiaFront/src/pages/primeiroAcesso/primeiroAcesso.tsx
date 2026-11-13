import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import LockResetIcon from '@mui/icons-material/LockReset';
import './primeiroAcesso.css';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export function PrimeiroAcesso() {
  const navigate = useNavigate();
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  if (localStorage.getItem('senhaProvisoria') !== 'true') {
    return <Navigate to="/home" replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro('');
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
          throw new Error('Confira a senha provisória e escolha uma senha diferente, com 8 a 72 caracteres.');
        }
        if (response.status === 401) {
          throw new Error('Sua sessão expirou. Entre novamente para continuar.');
        }
        throw new Error(`Não foi possível atualizar sua senha (HTTP ${response.status}). Tente novamente.`);
      }

      localStorage.removeItem('senhaProvisoria');
      navigate('/home', { replace: true });
    } catch (error) {
      setErro(error instanceof TypeError
        ? 'Não foi possível conectar à API. Verifique se o servidor está ativo e tente novamente.'
        : error instanceof Error ? error.message : 'Ocorreu um erro inesperado.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="primeiro-acesso-page">
      <section className="primeiro-acesso-card" aria-labelledby="primeiro-acesso-titulo">
        <div className="primeiro-acesso-icon" aria-hidden="true">
          <LockResetIcon />
        </div>
        <span className="primeiro-acesso-eyebrow">PRIMEIRO ACESSO</span>
        <h1 id="primeiro-acesso-titulo">Defina sua senha</h1>
        <p className="primeiro-acesso-intro">
          Antes de começar a organizar sua casa, troque a senha provisória por uma senha pessoal.
        </p>

        <form className="primeiro-acesso-form" onSubmit={handleSubmit}>
          <label htmlFor="senha-atual">Senha provisória</label>
          <input
            id="senha-atual"
            type="password"
            autoComplete="current-password"
            value={senhaAtual}
            onChange={(event) => setSenhaAtual(event.target.value)}
            required
          />

          <label htmlFor="nova-senha">Nova senha</label>
          <input
            id="nova-senha"
            type="password"
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
            value={novaSenha}
            onChange={(event) => setNovaSenha(event.target.value)}
            required
          />
          <small>Use entre 8 e 72 caracteres e escolha uma senha diferente da provisória.</small>

          {erro && <p className="primeiro-acesso-error" role="alert">{erro}</p>}

          <button type="submit" disabled={enviando}>
            {enviando ? 'Atualizando...' : 'Salvar nova senha'}
          </button>
        </form>
      </section>
    </main>
  );
}
