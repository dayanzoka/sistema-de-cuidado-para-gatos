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

// Defina a URL base da sua API do Render.com aqui
const API_BASE_URL = 'https://sistema-de-cuidado-para-gatos.onrender.com';

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
    try {
      const response = await fetch(`${API_BASE_URL}/agendamentos/listar`); // URL ATUALIZADA
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAgendamentos(data);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
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
      console.error('Erro ao buscar usuários para agendamento:', error);
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
      console.error('Erro ao buscar serviços para agendamento:', error);
    }
  };

  const adicionarAgendamento = async () => {
    if (usuarioId && servicoId && dataHora) {
      const novoAgendamento = { dataHora, usuarioId, servicoId };
      try {
        const response = await fetch(`${API_BASE_URL}/agendamentos/cadastrar`, { // URL ATUALIZADA
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(novoAgendamento),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setDataHora('');
        setUsuarioId(null);
        setServicoId(null);
        fetchAgendamentos();
      } catch (error) {
        console.error('Erro ao adicionar agendamento:', error);
        alert('Erro ao adicionar agendamento. Verifique o console.');
      }
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
      try {
        const response = await fetch(`${API_BASE_URL}/agendamentos/atualizar/${editandoAgendamento.id}`, { // URL ATUALIZADA
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editandoAgendamento),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setEditandoAgendamento(null);
        fetchAgendamentos();
      } catch (error) {
        console.error('Erro ao atualizar agendamento:', error);
        alert('Erro ao atualizar agendamento. Verifique o console.');
      }
    } else {
      alert('Preencha todos os campos.');
    }
  };

  const deletarAgendamento = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/agendamentos/deletar/${id}`, { // URL ATUALIZADA
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      fetchAgendamentos();
    } catch (error) {
      console.error('Erro ao deletar agendamento:', error);
      alert('Erro ao deletar agendamento. Verifique o console.');
    }
  };

  return (
    <div>
      <h2 className="titulo-usuarios">Agendamentos</h2>
      <ul className="lista-agendamentos">
        {agendamentos.map((ag) => (
          <li key={ag.id} className="agendamento-item">
            {editandoAgendamento && editandoAgendamento.id === ag.id ? (
              <div className="agendamento-edicao">
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
                    setEditandoAgendamento({
                      ...editandoAgendamento,
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
                  value={editandoAgendamento.servicoId}
                  onChange={(e) =>
                    setEditandoAgendamento({
                      ...editandoAgendamento,
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
                <button onClick={atualizarAgendamento}>Salvar</button>
                <button onClick={cancelarEdicao}>Cancelar</button>
              </div>
            ) : (
              <div className="agendamento-info">
                {new Date(ag.dataHora).toLocaleString()} - Usuário{' '}
                {usuarios.find((u) => u.id === ag.usuarioId)?.nome || ag.usuarioId} - Serviço{' '}
                {servicos.find((s) => s.id === ag.servicoId)?.nomeServico || ag.servicoId}
                <div className="agendamento-actions">
                  <button onClick={() => iniciarEdicao(ag)}>Editar</button>
                  <button onClick={() => deletarAgendamento(ag.id)}>Excluir</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      <h3 className="titulo-usuarios">Adicionar Agendamento</h3>
      <div className="form-adicionar">
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
    </div>
  );
}

export default AgendamentosPage;