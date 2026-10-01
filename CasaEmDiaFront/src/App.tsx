import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/login/login';
import { Home } from './pages/home/home';
import { LayoutNavHeader } from './pages/components/layoutNavHeader/layoutNavHeader';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
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