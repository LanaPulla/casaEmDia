import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/login/login';
import Tarefas  from './pages/tarefas/tarefas';
import { Home } from './pages/home/home';
import { LayoutNavHeader } from './pages/components/layoutNavHeader/layoutNavHeader';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<Login />} />
        <Route path="/tarefas" element={<Tarefas />} />
        {/* Futuramente, você fará o mesmo para os outros perfis:
          <Route path="/admin" element={<AdminLayout />}> ... </Route>
          <Route path="/responsavel" element={<ResponsavelLayout />}> ... </Route>
        */}
        
        {/* Rotas Privadas (Com o Header/Layout) */}
        <Route element={<LayoutNavHeader />}>
          <Route path="/home" element={<Home />} />
          <Route path="/painel-tarefas" element={<div>Página de Tarefas</div>} />
          <Route path="/painel-agenda" element={<div>Página de Agenda</div>} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;