import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import "./login.css";
import CottageIcon from '@mui/icons-material/Cottage';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

type FormMode = 'login' | 'cadastro';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

type UsuarioResponse = {
  nome: string;
  familia: string | null;
  perfil?: {
    nome: string;
  };
};

type FamiliaResponse = {
  nome: string;
};

export function Login() {
  const navigate = useNavigate();
  
  // Estados integrados do segundo código
  const [mode, setMode] = useState<FormMode>('login');
  const [nomeFamilia, setNomeFamilia] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const camposObrigatoriosPreenchidos = mode === 'cadastro'
    ? Boolean(nomeFamilia.trim() && nome.trim() && email.trim() && senha.trim())
    : Boolean(email.trim() && senha.trim());
  const senhaValida = senha.length >= 8 && senha.length <= 72;

  // Função de envio do segundo código
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro('');
    setEnviando(true);

    try {
      const endpoint = mode === 'cadastro' ? '/api/familia' : '/api/usuario/login';
      const body = mode === 'cadastro'
        ? { nomeFamilia, nomeResponsavel: nome, email, senha, membros: [] }
        : { email, senha };
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        credentials: 'include',
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
        if (response.status >= 500) {
          throw new Error(`O servidor encontrou um erro (HTTP ${response.status}). Tente novamente mais tarde.`);
        }
        throw new Error(`A solicitação não foi aceita (HTTP ${response.status}). Confira os dados e tente novamente.`);
      }
      if (mode === 'cadastro') {
        const familia: FamiliaResponse = await response.json();
        localStorage.setItem('nomeUsuario', nome);
        localStorage.setItem('nomeFamilia', familia.nome);
        localStorage.setItem('perfilUsuario', 'ADMINISTRADOR_CASA');
      } else {
        const usuario: UsuarioResponse = await response.json();
        localStorage.setItem('nomeUsuario', usuario.nome);
        localStorage.setItem('nomeFamilia', usuario.familia ?? '');
        localStorage.setItem('perfilUsuario', usuario.perfil?.nome ?? '');
      }

      navigate('/home');
    } catch (error) {
      setErro(error instanceof TypeError
        ? 'Não foi possível conectar à API. Verifique se o servidor está ativo e tente novamente.'
        : error instanceof Error ? error.message : 'Ocorreu um erro inesperado.');
    } finally {
      setEnviando(false);
    }
  }

  // Função para alternar entre login e cadastro limpando os erros
  const toggleMode = (e: React.MouseEvent) => {
    e.preventDefault();
    setMode(mode === 'login' ? 'cadastro' : 'login');
    setErro('');
  };

  return (
    <div className='background'>
      <div className='login-container'>
        
        {/* Lado Esquerdo */}
        <div className='login-left'>
          <h1 className='titulo-casaEmDia'>CasaEmDia</h1>
          
          <div className='icon-wrapper'>
            <CottageIcon sx={{ fontSize: 140 }} />
          </div>
        </div>

        {/* Divisória Vertical */}
        <div className='divider'></div>

        {/* Lado Direito */}
        <div className='login-right'>
          <span className='step-indicator'>Organize a vida de sua casa</span>
          
          {/* Títulos dinâmicos dependendo do modo */}
          <h2>{mode === 'login' ? 'Bem-vindo de volta!' : 'Crie sua conta'}</h2>
          <p className='subtitle'>
            {mode === 'login' ? 'Entre para continuar' : 'Cadastre-se para ter acesso'}
          </p>

          <form className='d-flex flex-column gap-3 w-100 mt-4' onSubmit={handleSubmit}>

            {/* Campo Nome só aparece no modo cadastro */}
            {mode === 'cadastro' && (
              <>
                <div className='input-group'>
                  <label htmlFor="nomeFamilia">Nome da família</label>
                  <input
                    id="nomeFamilia"
                    type="text"
                    maxLength={120}
                    value={nomeFamilia}
                    onChange={(e) => setNomeFamilia(e.target.value)}
                    required
                  />
                </div>
                <div className='input-group'>
                  <label htmlFor="nome">Nome do responsável</label>
                  <input
                    id="nome"
                    type="text"
                    autoComplete="name"
                    maxLength={120}
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div className='input-group'>
              <label htmlFor="email">Email</label>
              <input 
                id="email"
                type="email" 
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} 
                required
              />
            </div>

            <div className='input-group'>
              <label htmlFor="senha">Senha</label>
              <div className='input-with-icon'>
                <input 
                  id="senha"
                  type="password" 
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  minLength={mode === 'cadastro' ? 8 : undefined}
                  maxLength={72}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)} 
                  required
                />
                {senha.length > 0 && (
                  senhaValida
                    ? <CheckCircleIcon className="password-strength-icon password-strength-valid" aria-label="Senha válida" />
                    : <ErrorIcon className="password-strength-icon password-strength-invalid" aria-label="Senha inválida" />
                )}
              </div>
              {senha.length > 0 && !senhaValida && (
                <small className="password-strength-message">Use entre 8 e 72 caracteres.</small>
              )}
            </div>

            {/* Mensagens de Erro / Sucesso */}
            {erro && <p className="text-danger mt-2 mb-0" style={{ fontSize: '14px' }}>{erro}</p>}

            <button
              className='btn-proximo mt-3'
              type="submit"
              disabled={enviando || !camposObrigatoriosPreenchidos || (mode === 'cadastro' && !senhaValida)}
            >
              {enviando ? 'Aguarde...' : (mode === 'login' ? 'Entrar' : 'Cadastrar')}
              <ArrowForwardIosIcon fontSize='small' />
            </button>
            
            <div className='text-center mt-3'>
              <a href="#" className='link-entrar' onClick={toggleMode}>
                {mode === 'login' ? 'Não tem conta? Criar' : 'Já tem conta? Entrar'}
              </a>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}