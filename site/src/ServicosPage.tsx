import React, { useEffect, useState } from 'react';

interface Servico {
  id: number;
  nomeServico: string;
  descricao: string;
  localizacao: string;
}

// Defina a URL base da sua API do Render.com aqui
const API_BASE_URL = 'https://sistema-de-cuidado-para-gatos.onrender.com';

function ServicosPage() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [nomeServico, setNomeServico] = useState('');
  const [descricao, setDescricao] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [editandoServico, setEditandoServico] = useState<Servico | null>(null);

  useEffect(() => {
    fetchServicos();
  }, []);

  const fetchServicos = () => {
    fetch(`${API_BASE_URL}/servicos/listar`) // URL ATUALIZADA
      .then((res) => res.json())
      .then(setServicos)
      .catch((error) => console.error('Erro ao buscar serviços:', error)); // Adicionado tratamento de erro
  };

  const adicionarServico = () => {
    const novoServico = { nomeServico, descricao, localizacao };
    fetch(`${API_BASE_URL}/servicos/cadastrar`, { // URL ATUALIZADA
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoServico),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(() => {
        setNomeServico('');
        setDescricao('');
        setLocalizacao('');
        fetchServicos();
      })
      .catch((error) => console.error('Erro ao adicionar serviço:', error)); // Adicionado tratamento de erro
  };

  const iniciarEdicao = (servico: Servico) => {
    setEditandoServico({ ...servico });
  };

  const cancelarEdicao = () => {
    setEditandoServico(null);
  };

  const atualizarServico = () => {
    if (editandoServico) {
      fetch(`${API_BASE_URL}/servicos/atualizar/${editandoServico.id}`, { // URL ATUALIZADA
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editandoServico),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(() => {
          setEditandoServico(null);
          fetchServicos();
        })
        .catch((error) => console.error('Erro ao atualizar serviço:', error)); // Adicionado tratamento de erro
    }
  };

  const deletarServico = (id: number) => {
    fetch(`${API_BASE_URL}/servicos/deletar/${id}`, { // URL ATUALIZADA
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        // Não retorna JSON em DELETE, só verifica o status
      })
      .then(() => {
        fetchServicos();
      })
      .catch((error) => console.error('Erro ao deletar serviço:', error)); // Adicionado tratamento de erro
  };

  return (
    <div>
      <h2 className="titulo-usuarios">Serviços</h2>
      <ul className="lista-servicos">
        {servicos.map((s) => (
          <li key={s.id} className="servico-item">
            {editandoServico && editandoServico.id === s.id ? (
              <div className="servico-edicao">
                <input
                  value={editandoServico.nomeServico}
                  onChange={(e) =>
                    setEditandoServico({ ...editandoServico, nomeServico: e.target.value })
                  }
                />
                <input
                  value={editandoServico.descricao}
                  onChange={(e) =>
                    setEditandoServico({ ...editandoServico, descricao: e.target.value })
                  }
                />
                <input
                  value={editandoServico.localizacao}
                  onChange={(e) =>
                    setEditandoServico({ ...editandoServico, localizacao: e.target.value })
                  }
                />
                <button onClick={atualizarServico}>Salvar</button>
                <button onClick={cancelarEdicao}>Cancelar</button>
              </div>
            ) : (
              <div className="servico-info">
                <strong>{s.nomeServico}</strong> - {s.localizacao}
                <div className="servico-actions">
                  <button onClick={() => iniciarEdicao(s)}>Editar</button>
                  <button onClick={() => deletarServico(s.id)}>Excluir</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      <h3 className="titulo-usuarios">Adicionar Serviço</h3>
      <div className="form-adicionar">
        <input
          placeholder="Nome do Serviço"
          value={nomeServico}
          onChange={(e) => setNomeServico(e.target.value)}
        />
        <input
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <input
          placeholder="Localização"
          value={localizacao}
          onChange={(e) => setLocalizacao(e.target.value)}
        />
        <button onClick={adicionarServico}>Adicionar</button>
      </div>
    </div>
  );
}

export default ServicosPage;