import React, { useEffect, useState } from 'react';

interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
}

const API_BASE_URL = 'https://sistema-de-cuidado-para-gatos.onrender.com';

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [editandoUsuario, setEditandoUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = () => {
    fetch(`${API_BASE_URL}/usuarios/listar`) 
      .then((res) => res.json())
      .then(setUsuarios)
      .catch((error) => console.error('Erro ao buscar usuários:', error)); 
  };

  const adicionarUsuario = () => {
    const novoUsuario = { nome, email, senha };
    fetch(`${API_BASE_URL}/usuarios/cadastrar`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoUsuario),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        setNome('');
        setEmail('');
        setSenha('');
        fetchUsuarios();
      })
      .catch((error) => console.error('Erro ao adicionar usuário:', error)); // Adicionado tratamento de erro
  };

  const iniciarEdicao = (usuario: Usuario) => {
    setEditandoUsuario({ ...usuario });
  };

  const cancelarEdicao = () => {
    setEditandoUsuario(null);
  };

  const atualizarUsuario = () => {
    if (!editandoUsuario) return;
    fetch(`${API_BASE_URL}/usuarios/atualizar/${editandoUsuario.id}`, { // URL ATUALIZADA
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editandoUsuario),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        setEditandoUsuario(null);
        fetchUsuarios();
      })
      .catch((error) => console.error('Erro ao atualizar usuário:', error)); // Adicionado tratamento de erro
  };

  const deletarUsuario = (id: number) => {
    fetch(`${API_BASE_URL}/usuarios/deletar/${id}`, { // URL ATUALIZADA
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        // Não retorna JSON em DELETE, só verifica o status
      })
      .then(() => {
        fetchUsuarios();
      })
      .catch((error) => console.error('Erro ao deletar usuário:', error)); // Adicionado tratamento de erro
  };

  return (
    <div>
      <h2 className="titulo-usuarios">Lista de Usuários</h2>
      <ul className="lista-itens">
        {usuarios.map((u) => (
          <li key={u.id}>
            {editandoUsuario?.id === u.id ? (
              <div className="form-edicao">
                <input
                  value={editandoUsuario.nome}
                  onChange={(e) =>
                    setEditandoUsuario({ ...editandoUsuario, nome: e.target.value })
                  }
                />
                <input
                  value={editandoUsuario.email}
                  onChange={(e) =>
                    setEditandoUsuario({ ...editandoUsuario, email: e.target.value })
                  }
                />
                <input
                  value={editandoUsuario.senha}
                  onChange={(e) =>
                    setEditandoUsuario({ ...editandoUsuario, senha: e.target.value })
                  }
                />
                <button onClick={atualizarUsuario}>Salvar</button>
                <button onClick={cancelarEdicao}>Cancelar</button>
              </div>
            ) : (
              <div className="usuario-info">
                <strong>{u.nome}</strong> - {u.email}
                <div className="usuario-actions">
                  <button onClick={() => iniciarEdicao(u)}>Editar</button>
                  <button onClick={() => deletarUsuario(u.id)}>Excluir</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      <h3 className="titulo-usuarios">Adicionar Usuário</h3>
      <div className="form-adicionar">
        <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
        <button onClick={adicionarUsuario}>Adicionar</button>
      </div>
    </div>
  );
}

export default UsuariosPage;