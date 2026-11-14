import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Login } from './pages/login/login';
import Tarefas  from './pages/tarefas/tarefas';
import { Home } from './pages/home/home';
import { LayoutNavHeader } from './pages/components/layoutNavHeader/layoutNavHeader';
import { Membros } from './pages/membros/membros';
import { AgendaFamiliaPage } from './pages/agenda/agendaFamilia';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

function limparDadosLocais() {
  localStorage.removeItem('nomeUsuario');
  localStorage.removeItem('nomeFamilia');
  localStorage.removeItem('perfilUsuario');
}

function ProtectedRoute() {
  const navigate = useNavigate();
  const [verificandoSessao, setVerificandoSessao] = useState(true);

  useEffect(() => {
    let ativo = true;

    fetch(`${API_URL}/api/usuario/me`, { credentials: 'include' })
      .then(async (response) => {
        if (response.status === 404) {
          const sessaoLegada = await fetch(`${API_URL}/api/familia`, {
            credentials: 'include',
          });

          if (sessaoLegada.ok || sessaoLegada.status === 403) {
            return null;
          }
        }

        if (!response.ok) {
          throw new Error('Sessão inválida');
        }

        return response.json();
      })
      .then((usuario) => {
        if (!ativo) return;

        if (usuario) {
          localStorage.setItem('nomeUsuario', usuario.nome);
          localStorage.setItem('nomeFamilia', usuario.familia ?? '');
          localStorage.setItem('perfilUsuario', usuario.perfil?.nome ?? '');
        }

        setVerificandoSessao(false);
      })
      .catch(() => {
        if (ativo) {
          limparDadosLocais();
          navigate('/login', { replace: true });
        }
      });

    return () => {
      ativo = false;
    };
  }, [navigate]);

  if (verificandoSessao) {
    return <p>Verificando sessão...</p>;
  }

  return <Outlet />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />        
        {/* Rotas Privadas (Com o Header/Layout) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<LayoutNavHeader />}>
            <Route path="/home" element={<Home />} />
            <Route path="/tarefas" element={<Tarefas />} />
            <Route path="/membros" element={<Membros />} />
            <Route path="/agenda" element={<AgendaFamiliaPage />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;