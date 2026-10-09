import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import "./login.css";
import CottageIcon from '@mui/icons-material/Cottage';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

type FormMode = 'login' | 'cadastro';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export function Login() {
  const navigate = useNavigate();
  
  // Estados integrados do segundo código
  const [mode, setMode] = useState<FormMode>('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Função de envio do segundo código
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

  // Função para alternar entre login e cadastro limpando os erros
  const toggleMode = (e: React.MouseEvent) => {
    e.preventDefault();
    setMode(mode === 'login' ? 'cadastro' : 'login');
    setErro('');
    setSucesso('');
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
              <div className='input-group'>
                <label htmlFor="nome">Nome</label>
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
              </div>
            </div>

            {/* Mensagens de Erro / Sucesso */}
            {erro && <p className="text-danger mt-2 mb-0" style={{ fontSize: '14px' }}>{erro}</p>}
            {sucesso && <p className="text-success mt-2 mb-0" style={{ fontSize: '14px' }}>{sucesso}</p>}

            <button className='btn-proximo mt-3' type="submit" disabled={enviando}>
              {enviando ? 'Aguarde...' : (mode === 'login' ? 'Entrar' : 'Criar conta')}
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