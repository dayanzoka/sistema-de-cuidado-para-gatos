// App.tsx
import React from 'react';
import './App.css'; 
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import UsuariosPage from './UsuariosPage';
import ServicosPage from './ServicosPage';
import AgendamentosPage from './AgendamentosPage';
import AvaliacaoPage from './AvaliacaoPage';

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <h1>Serviços para Gatos</h1>
          <nav>
            <Link to="/" className="button">Home</Link>
            <Link to="/usuarios" className="button">Usuários</Link>
            <Link to="/servicos" className="button">Serviços</Link>
            <Link to="/agendamentos" className="button">Agendamentos</Link>
            <Link to="/avaliacoes" className="button">Avaliações</Link>
          </nav>
        </header>
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/usuarios" element={<UsuariosPage />} />
            <Route path="/servicos" element={<ServicosPage />} />
            <Route path="/agendamentos" element={<AgendamentosPage />} />
            <Route path="/avaliacoes" element={<AvaliacaoPage />} />
          </Routes>
        </div>
        <footer>
          <p>&copy; {new Date().getFullYear()} Serviços para Gatos</p>
        </footer>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div className="home">
      <h1>Bem-vindo ao Serviços para Gatos!</h1>
      <p>Escolha uma das opções acima para navegar.</p>
    </div>
  );
}

export default App;
