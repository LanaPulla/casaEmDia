import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/login/login';
import Tarefas  from './pages/tarefas/tarefas';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Rotas Públicas (Sem layout) */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/menu" element={<Login />} />
        <Route path="/tarefas" element={<Tarefas />} />
        {/* Futuramente, você fará o mesmo para os outros perfis:
          <Route path="/admin" element={<AdminLayout />}> ... </Route>
          <Route path="/responsavel" element={<ResponsavelLayout />}> ... </Route>
        */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;