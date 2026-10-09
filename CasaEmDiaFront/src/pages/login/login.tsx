import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import "./login.css";

type FormMode = 'login' | 'cadastro';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<FormMode>('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro('');
    setSucesso('');
    setEnviando(true);

    try {
      const endpoint = mode === 'cadastro' ? 'cadastro' : 'login';
      const body = mode === 'cadastro' ? { nome, email, senha } : { email, senha };
      const response = await fetch(`${API_URL}/api/usuario/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.status === 401) {
        throw new Error('E-mail ou senha inválidos.');
      }
      if (response.status === 409) {
        throw new Error('Este e-mail já está cadastrado.');
      }
      if (response.status === 400) {
        throw new Error('Confira os dados. A senha deve ter entre 8 e 72 caracteres.');
      }
      if (!response.ok) {
        throw new Error('Não foi possível acessar a API. Tente novamente.');
      }

      if (mode === 'cadastro') {
        setMode('login');
        setSenha('');
        setSucesso('Conta criada. Entre com seu e-mail e senha.');
        return;
      }

      navigate('/home');
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Ocorreu um erro inesperado.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="login-page">
      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-brand">
          <span className="login-brand-mark" aria-hidden="true">CE</span>
          <div>
            <p>CASA EM DIA</p>
            <h1 id="login-title">Organize a vida da casa.</h1>
          </div>
        </div>

        <div className="login-tabs" role="group" aria-label="Acesso à conta">
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            aria-pressed={mode === 'login'}
            onClick={() => { setMode('login'); setErro(''); setSucesso(''); }}
          >
            Entrar
          </button>
          <button
            type="button"
            className={mode === 'cadastro' ? 'active' : ''}
            aria-pressed={mode === 'cadastro'}
            onClick={() => { setMode('cadastro'); setErro(''); setSucesso(''); }}
          >
            Criar conta
          </button>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <h2>{mode === 'login' ? 'Bem-vinda de volta' : 'Crie sua conta'}</h2>
          <p className="login-subtitle">
            {mode === 'login' ? 'Entre para continuar.' : 'Cadastre-se para testar o acesso.'}
          </p>

          {mode === 'cadastro' && (
            <div className="login-field">
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                type="text"
                autoComplete="name"
                maxLength={120}
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                required
              />
            </div>
          )}

          <div className="login-field">
            <label htmlFor="email">E-mail</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="senha">Senha</label>
            <input
              id="senha"
              type="password"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength={mode === 'cadastro' ? 8 : undefined}
              maxLength={72}
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              required
            />
          </div>

          {erro && <p className="login-message error" role="alert">{erro}</p>}
          {sucesso && <p className="login-message success" role="status">{sucesso}</p>}

          <button className="login-submit" type="submit" disabled={enviando}>
            {enviando ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>
      </section>
    </main>
  );
}