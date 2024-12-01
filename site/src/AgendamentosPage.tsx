import React, { useEffect, useState } from 'react';

interface Usuario {
  id: number;
  nome: string;
}

interface Servico {
  id: number;
  nomeServico: string;
}

interface Agendamento {
  id: number;
  dataHora: string;
  usuarioId: number;
  servicoId: number;
}

function AgendamentosPage() {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [dataHora, setDataHora] = useState('');
  const [usuarioId, setUsuarioId] = useState<number | null>(null);
  const [servicoId, setServicoId] = useState<number | null>(null);
  const [editandoAgendamento, setEditandoAgendamento] = useState<Agendamento | null>(null);

  useEffect(() => {
    fetchAgendamentos();
    fetchUsuarios();
    fetchServicos();
  }, []);

  const fetchAgendamentos = async () => {
    const response = await fetch('http://localhost:5221/agendamentos/listar');
    const data = await response.json();
    setAgendamentos(data);
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

  const adicionarAgendamento = async () => {
    if (usuarioId && servicoId && dataHora) {
      const novoAgendamento = { dataHora, usuarioId, servicoId };
      await fetch('http://localhost:5221/agendamentos/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoAgendamento),
      });
      setDataHora('');
      setUsuarioId(null);
      setServicoId(null);
      fetchAgendamentos();
    } else {
      alert('Preencha todos os campos.');
    }
  };

  const iniciarEdicao = (agendamento: Agendamento) => {
    setEditandoAgendamento(agendamento);
  };

  const cancelarEdicao = () => {
    setEditandoAgendamento(null);
  };

  const atualizarAgendamento = async () => {
    if (editandoAgendamento && editandoAgendamento.dataHora) {
      await fetch(`http://localhost:5221/agendamentos/atualizar/${editandoAgendamento.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editandoAgendamento),
      });
      setEditandoAgendamento(null);
      fetchAgendamentos();
    } else {
      alert('Preencha todos os campos.');
    }
  };

  const deletarAgendamento = async (id: number) => {
    await fetch(`http://localhost:5221/agendamentos/deletar/${id}`, {
      method: 'DELETE',
    });
    fetchAgendamentos();
  };

  return (
    <div>
      <h2>Agendamentos</h2>
      <ul>
        {agendamentos.map((ag) => (
          <li key={ag.id}>
            {editandoAgendamento && editandoAgendamento.id === ag.id ? (
              <div>
                <input
                  type="datetime-local"
                  value={editandoAgendamento.dataHora}
                  onChange={(e) =>
                    setEditandoAgendamento({ ...editandoAgendamento, dataHora: e.target.value })
                  }
                />
                <select
                  value={editandoAgendamento.usuarioId}
                  onChange={(e) =>
                    setEditandoAgendamento({ ...editandoAgendamento, usuarioId: parseInt(e.target.value) })
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
                  value={editandoAgendamento.servicoId}
                  onChange={(e) =>
                    setEditandoAgendamento({ ...editandoAgendamento, servicoId: parseInt(e.target.value) })
                  }
                >
                  <option value="">Selecione um serviço</option>
                  {servicos.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nomeServico}
                    </option>
                  ))}
                </select>
                <button onClick={atualizarAgendamento}>Salvar</button>
                <button onClick={cancelarEdicao}>Cancelar</button>
              </div>
            ) : (
              <div>
                {new Date(ag.dataHora).toLocaleString()} - Usuário {usuarios.find((u) => u.id === ag.usuarioId)?.nome || ag.usuarioId} - Serviço {servicos.find((s) => s.id === ag.servicoId)?.nomeServico || ag.servicoId}
                <button onClick={() => iniciarEdicao(ag)}>Editar</button>
                <button onClick={() => deletarAgendamento(ag.id)}>Excluir</button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <h3>Adicionar Agendamento</h3>
      <input
        type="datetime-local"
        value={dataHora}
        onChange={(e) => setDataHora(e.target.value)}
      />
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
      <button onClick={adicionarAgendamento}>Adicionar</button>
    </div>
  );
}

export default AgendamentosPage;
