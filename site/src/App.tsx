import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import UsuariosPage from './UsuariosPage';
import ServicosPage from './ServicosPage';
import AgendamentosPage from './AgendamentosPage';
import AvaliacaoPage from './AvaliacaoPage';

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> |{' '}
        <Link to="/usuarios">Usuários</Link> |{' '}
        <Link to="/servicos">Serviços</Link> |{' '}
        <Link to="/agendamentos">Agendamentos</Link> |{' '}
        <Link to="/avaliacoes">Avaliações</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/usuarios" element={<UsuariosPage />} />
        <Route path="/servicos" element={<ServicosPage />} />
        <Route path="/agendamentos" element={<AgendamentosPage />} />
        <Route path="/avaliacoes" element={<AvaliacaoPage />} />
      </Routes>
    </Router>
  );
}

function Home() {
  return <h1>Bem-vindo ao Serviços para Gatos!</h1>;
}

export default App;
