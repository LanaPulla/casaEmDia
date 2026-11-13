import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import "./login.css";
import CottageIcon from '@mui/icons-material/Cottage';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { exibirErro, lancarSeErro } from '../../services/api/erroApi';
import { LegendaObrigatorio, RotuloObrigatorio } from '../components/campoObrigatorio/campoObrigatorio';

type FormMode = 'login' | 'cadastro';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export function Login() {
  const navigate = useNavigate();
  
  // Estados integrados do segundo código
  const [mode, setMode] = useState<FormMode>('login');
  const [nomeFamilia, setNomeFamilia] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [enviando, setEnviando] = useState(false);

  // Função de envio do segundo código
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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

      await lancarSeErro(response, mode === 'cadastro'
        ? 'Não foi possível criar a conta.'
        : 'Não foi possível entrar.');
      const userData = await response.json(); 

      // Salva o nome do usuário no localStorage do navegador para usar na tela do home como bem-vindo
      localStorage.setItem('nomeUsuario', userData.nome);
      localStorage.setItem('nomeFamilia', userData.familia);
      localStorage.setItem('perfilUsuario', userData.perfil.nome);


      navigate('/home');
    } catch (error) {
      exibirErro(error, 'Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  // Função para alternar entre login e cadastro limpando os erros
  const toggleMode = (e: React.MouseEvent) => {
    e.preventDefault();
    setMode(mode === 'login' ? 'cadastro' : 'login');
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
            <LegendaObrigatorio />

            {/* Campo Nome só aparece no modo cadastro */}
            {mode === 'cadastro' && (
              <>
                <div className='input-group'>
                  <label htmlFor="nomeFamilia"><RotuloObrigatorio>Nome da família</RotuloObrigatorio></label>
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
                  <label htmlFor="nome"><RotuloObrigatorio>Nome do responsável</RotuloObrigatorio></label>
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
              <label htmlFor="email"><RotuloObrigatorio>Email</RotuloObrigatorio></label>
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
              <label htmlFor="senha"><RotuloObrigatorio>Senha</RotuloObrigatorio></label>
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