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
    const response = await fetch('http://localhost:5221/avaliacoes/listar');
    const data = await response.json();
    setAvaliacoes(data);
  };

  const fetchUsuarios = async () => {
    const response = await fetch('http://localhost:5221/usuarios/listar');
    const data = await response.json();
    setUsuarios(data);
  };

  const fetchServicos = async () => {
    const response = await fetch('http://localhost:5221/servicos/listar');
    const data = await response.json();
    setServicos(data);
  };

  const adicionarAvaliacao = async () => {
    if (usuarioId && servicoId && comentario && nota >= 1 && nota <= 10) {
      const novaAvaliacao = { usuarioId, servicoId, comentario, nota };
      await fetch('http://localhost:5221/avaliacoes/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaAvaliacao),
      });
      setUsuarioId(null);
      setServicoId(null);
      setComentario('');
      setNota(1);
      fetchAvaliacoes();
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
      await fetch(`http://localhost:5221/avaliacoes/atualizar/${editandoAvaliacao.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editandoAvaliacao),
      });
      setEditandoAvaliacao(null);
      fetchAvaliacoes();
    } else {
      alert('Preencha todos os campos corretamente.');
    }
  };

  const deletarAvaliacao = async (id: number) => {
    await fetch(`http://localhost:5221/avaliacoes/deletar/${id}`, {
      method: 'DELETE',
    });
    fetchAvaliacoes();
  };

  return (
    <div>
      <h2>Avaliações</h2>
      <ul>
        {avaliacoes.map((av) => (
          <li key={av.id}>
            {editandoAvaliacao && editandoAvaliacao.id === av.id ? (
              <div>
                <select
                  value={editandoAvaliacao.usuarioId}
                  onChange={(e) =>
                    setEditandoAvaliacao({ ...editandoAvaliacao, usuarioId: parseInt(e.target.value) })
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
                    setEditandoAvaliacao({ ...editandoAvaliacao, servicoId: parseInt(e.target.value) })
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
              <div>
                Usuário {usuarios.find((u) => u.id === av.usuarioId)?.nome || av.usuarioId} avaliou o serviço {servicos.find((s) => s.id === av.servicoId)?.nomeServico || av.servicoId} com nota {av.nota}
                <br />
                Comentário: {av.comentario}
                <button onClick={() => iniciarEdicao(av)}>Editar</button>
                <button onClick={() => deletarAvaliacao(av.id)}>Excluir</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <h3>Adicionar Avaliação</h3>
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
  );
}

export default AvaliacaoPage;
