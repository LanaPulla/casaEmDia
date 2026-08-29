import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/login/login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Rotas Públicas (Sem layout) */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        
        {/* Futuramente, você fará o mesmo para os outros perfis:
          <Route path="/admin" element={<AdminLayout />}> ... </Route>
          <Route path="/responsavel" element={<ResponsavelLayout />}> ... </Route>
        */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;