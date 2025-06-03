 // App.tsx
import React from 'react';
import './App.css'; 
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

import UsuariosPage from './UsuariosPage';
import ServicosPage from './ServicosPage';
import AgendamentosPage from './AgendamentosPage';
import AvaliacaoPage from './AvaliacaoPage';

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

function MainLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="App">
      {isHome ? (
        <div className="header-wrapper">
          <Header />
        </div>
      ) : (
        <Header />
      )}

      {!isHome && (
        <div className="container">
          <Routes>
            <Route path="/usuarios" element={<UsuariosPage />} />
            <Route path="/servicos" element={<ServicosPage />} />
            <Route path="/agendamentos" element={<AgendamentosPage />} />
            <Route path="/avaliacoes" element={<AvaliacaoPage />} />
          </Routes>
        </div>
      )}

      {isHome && <Home />}

      <footer>
        <p>&copy; {new Date().getFullYear()} serviços para gatos </p>
      </footer>
    </div>
  );
}

function Header() {
  return (
    <header>
      <h1> SERVIÇOS PARA GATOS</h1>
      <nav>
        <Link to="/" className="button">HOME</Link>
        <Link to="/usuarios" className="button">USUÁRIOS</Link>
        <Link to="/servicos" className="button">SERVIÇOS</Link>
        <Link to="/agendamentos" className="button">AGENDAMENTOS</Link>
        <Link to="/avaliacoes" className="button">AVALIAÇÕES</Link>
      </nav>
    </header>
  );
}

function Home() {
  return (
    <div className="home">
    </div>
  );
}

export default App;

