import React, { useEffect, useState } from 'react';

interface Usuario {
  id: number;
  nome: string;
}

interface Servico {
  id: number;
  nomeServico: string;
}

interface Avaliacao {
  id: number;
  usuarioId: number;
  servicoId: number;
  comentario: string;
  nota: number;
}

// Defina a URL base da sua API do Render.com aqui
const API_BASE_URL = 'https://sistema-de-cuidado-para-gatos.onrender.com';

function AvaliacaoPage() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [servicoId, setServicoId] = useState<number | null>(null);
  const [comentario, setComentario] = useState('');
  const [nota, setNota] = useState<number>(1);
  const [editandoAvaliacao, setEditandoAvaliacao] = useState<Avaliacao | null>(null);

  useEffect(() => {
    fetchAvaliacoes();
    fetchUsuarios();
    fetchServicos();
  }, []);

  const fetchAvaliacoes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/avaliacoes/listar`); // URL ATUALIZADA
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAvaliacoes(data);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/usuarios/listar`); // URL ATUALIZADA
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error('Erro ao buscar usuários para avaliação:', error);
    }
  };

  const fetchServicos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/servicos/listar`); // URL ATUALIZADA
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setServicos(data);
    } catch (error) {
      console.error('Erro ao buscar serviços para avaliação:', error);
    }
  };

  const adicionarAvaliacao = async () => {
    if (usuarioId && servicoId && comentario && nota >= 1 && nota <= 10) {
      const novaAvaliacao = { usuarioId, servicoId, comentario, nota };
      try {
        const response = await fetch(`${API_BASE_URL}/avaliacoes/cadastrar`, { // URL ATUALIZADA
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(novaAvaliacao),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setUsuarioId(null);
        setServicoId(null);
        setComentario('');
        setNota(1);
        fetchAvaliacoes();
      } catch (error) {
        console.error('Erro ao adicionar avaliação:', error);
        alert('Erro ao adicionar avaliação. Verifique o console.');
      }
    } else {
      alert('Preencha todos os campos corretamente.');
    }
  };

  const iniciarEdicao = (avaliacao: Avaliacao) => {
    setEditandoAvaliacao(avaliacao);
  };

  const cancelarEdicao = () => {
    setEditandoAvaliacao(null);
  };

  const atualizarAvaliacao = async () => {
    if (editandoAvaliacao && editandoAvaliacao.nota >= 1 && editandoAvaliacao.nota <= 10) {
      try {
        const response = await fetch(`${API_BASE_URL}/avaliacoes/atualizar/${editandoAvaliacao.id}`, { // URL ATUALIZADA
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editandoAvaliacao),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setEditandoAvaliacao(null);
        fetchAvaliacoes();
      } catch (error) {
        console.error('Erro ao atualizar avaliação:', error);
        alert('Erro ao atualizar avaliação. Verifique o console.');
      }
    } else {
      alert('Preencha todos os campos corretamente.');
    }
  };

  const deletarAvaliacao = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/avaliacoes/deletar/${id}`, { // URL ATUALIZADA
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchAvaliacoes();
    } catch (error) {
      console.error('Erro ao deletar avaliação:', error);
      alert('Erro ao deletar avaliação. Verifique o console.');
    }
  };

  return (
    <div>
      <h2 className="titulo-usuarios">Avaliações</h2>
      <ul className="lista-avaliacoes">
        {avaliacoes.map((av) => (
          <li key={av.id} className="avaliacao-item">
            {editandoAvaliacao && editandoAvaliacao.id === av.id ? (
              <div className="avaliacao-edicao">
                <select
                  value={editandoAvaliacao.usuarioId}
                  onChange={(e) =>
                    setEditandoAvaliacao({
                      ...editandoAvaliacao,
                      usuarioId: parseInt(e.target.value),
                    })
                  }
                >
                  <option value="">Selecione um usuário</option>
                  {usuarios.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nome}
                    </option>
                  ))}
                </select>
                <select
                  value={editandoAvaliacao.servicoId}
                  onChange={(e) =>
                    setEditandoAvaliacao({
                      ...editandoAvaliacao,
                      servicoId: parseInt(e.target.value),
                    })
                  }
                >
                  <option value="">Selecione um serviço</option>
                  {servicos.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nomeServico}
                    </option>
                  ))}
                </select>
                <textarea
                  value={editandoAvaliacao.comentario}
                  onChange={(e) =>
                    setEditandoAvaliacao({ ...editandoAvaliacao, comentario: e.target.value })
                  }
                />
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={editandoAvaliacao.nota}
                  onChange={(e) =>
                    setEditandoAvaliacao({ ...editandoAvaliacao, nota: parseInt(e.target.value) })
                  }
                />
                <button onClick={atualizarAvaliacao}>Salvar</button>
                <button onClick={cancelarEdicao}>Cancelar</button>
              </div>
            ) : (
              <div className="avaliacao-info">
                <strong>
                  Usuário {usuarios.find((u) => u.id === av.usuarioId)?.nome || av.usuarioId}
                </strong>{' '}
                avaliou o serviço{' '}
                {servicos.find((s) => s.id === av.servicoId)?.nomeServico || av.servicoId} com nota{' '}
                {av.nota}
                <p>Comentário: {av.comentario}</p>
                <div className="avaliacao-actions">
                  <button onClick={() => iniciarEdicao(av)}>Editar</button>
                  <button onClick={() => deletarAvaliacao(av.id)}>Excluir</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      <h3 className="avalie-aqui">Adicionar Avaliação</h3>
      <div className="form-adicionar">
        <select value={usuarioId || ''} onChange={(e) => setUsuarioId(parseInt(e.target.value))}>
          <option value="">Selecione um usuário</option>
          {usuarios.map((u) => (
            <option key={u.id} value={u.id}>
              {u.nome}
            </option>
          ))}
        </select>
        <select value={servicoId || ''} onChange={(e) => setServicoId(parseInt(e.target.value))}>
          <option value="">Selecione um serviço</option>
          {servicos.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nomeServico}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Comentário"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        />
        <input
          type="number"
          min="1"
          max="10"
          placeholder="Nota"
          value={nota}
          onChange={(e) => setNota(parseInt(e.target.value))}
        />
        <button onClick={adicionarAvaliacao}>Adicionar</button>
      </div>
    </div>
  );
}

export default AvaliacaoPage;