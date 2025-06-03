import React, { useEffect, useState } from 'react';

interface Servico {
  id: number;
  nomeServico: string;
  descricao: string;
  localizacao: string;
}

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
    fetch('http://localhost:5221/servicos/listar')
      .then((res) => res.json())
      .then(setServicos);
  };

  const adicionarServico = () => {
    const novoServico = { nomeServico, descricao, localizacao };
    fetch('http://localhost:5221/servicos/cadastrar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoServico),
    }).then(() => {
      setNomeServico('');
      setDescricao('');
      setLocalizacao('');
      fetchServicos();
    });
  };

  const iniciarEdicao = (servico: Servico) => {
    setEditandoServico({ ...servico });
  };

  const cancelarEdicao = () => {
    setEditandoServico(null);
  };

  const atualizarServico = () => {
    if (editandoServico) {
      fetch(`http://localhost:5221/servicos/atualizar/${editandoServico.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editandoServico),
      }).then(() => {
        setEditandoServico(null);
        fetchServicos();
      });
    }
  };

  const deletarServico = (id: number) => {
    fetch(`http://localhost:5221/servicos/deletar/${id}`, {
      method: 'DELETE',
    }).then(() => {
      fetchServicos();
    });
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
