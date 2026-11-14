import React, { useState, useMemo, useEffect } from 'react';
import type { EventoAgenda } from '../../types/agenda.ts';
import { agendaService } from '../../services/agenda/agendaService.ts';
import './agendaFamilia.css';

type ModoVisualizacao = 'semanal' | 'mensal';

export const AgendaFamiliaPage: React.FC = () => {
  const [eventos, setEventos] = useState<EventoAgenda[]>([]);
  const [modo, setModo] = useState<ModoVisualizacao>('mensal');
  const [dataSelecionada, setDataSelecionada] = useState<Date>(new Date());
  const [diaFocado, setDiaFocado] = useState<string | null>(null);

  // Modal (Criar / Editar)
  const [modalAberto, setModalAberto] = useState<boolean>(false);
  const [eventoEditando, setEventoEditando] = useState<EventoAgenda | null>(null);

  // Form State
  const [formTitulo, setFormTitulo] = useState('');
  const [formDescricao, setFormDescricao] = useState('');
  const [formDataEvento, setFormDataEvento] = useState('');
  const [formHorarioInicio, setFormHorarioInicio] = useState('');
  const [formHorarioFim, setFormHorarioFim] = useState('');
  const [formLocal, setFormLocal] = useState('');
  const [formCategoria, setFormCategoria] = useState<EventoAgenda['categoria']>('FAMILIA');
  const formularioEventoValido = Boolean(formTitulo.trim() && formDataEvento);

  const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  useEffect(() => {
    carregarEventos();
  }, []);

  const carregarEventos = async () => {
    try {
      const dados = await agendaService.listarTodos();
      setEventos(Array.isArray(dados) ? dados : []);
    } catch (err) {
      console.error('Falha ao carregar a agenda:', err);
    }
  };

  const formatarDataIso = (d: Date): string => {
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
  };

  const normalizarHora = (hora?: string | null): string => {
    if (!hora) return '';
    return hora.length >= 5 ? hora.slice(0, 5) : hora;
  };

  const dataHojeIso = formatarDataIso(new Date());

  const navegarPeriodo = (direcao: 'anterior' | 'proximo') => {
    const novaData = new Date(dataSelecionada);
    if (modo === 'mensal') {
      novaData.setMonth(novaData.getMonth() + (direcao === 'anterior' ? -1 : 1));
    } else {
      novaData.setDate(novaData.getDate() + (direcao === 'anterior' ? -7 : 7));
    }
    setDataSelecionada(novaData);
    setDiaFocado(null);
  };

  const diasParaExibir = useMemo(() => {
    const ano = dataSelecionada.getFullYear();
    const mes = dataSelecionada.getMonth();
    const listaDias: Date[] = [];

    if (modo === 'mensal') {
      const primeiroDia = new Date(ano, mes, 1);
      const ultimoDia = new Date(ano, mes + 1, 0);
      const diaSemanaInicial = primeiroDia.getDay();

      for (let i = diaSemanaInicial; i > 0; i--) listaDias.push(new Date(ano, mes, 1 - i));
      for (let d = 1; d <= ultimoDia.getDate(); d++) listaDias.push(new Date(ano, mes, d));
      const restantes = 42 - listaDias.length;
      for (let j = 1; j <= restantes; j++) listaDias.push(new Date(ano, mes + 1, j));
    } else {
      const diaSemanaAtual = dataSelecionada.getDay();
      const primeiroDiaSemana = new Date(dataSelecionada);
      primeiroDiaSemana.setDate(dataSelecionada.getDate() - diaSemanaAtual);

      for (let i = 0; i < 7; i++) {
        const d = new Date(primeiroDiaSemana);
        d.setDate(primeiroDiaSemana.getDate() + i);
        listaDias.push(d);
      }
    }

    return listaDias;
  }, [dataSelecionada, modo]);

  const totalHoje = useMemo(() => {
    return eventos.filter((ev) => ev.dataEvento === dataHojeIso).length;
  }, [eventos, dataHojeIso]);

  const eventosFiltrados = useMemo(() => {
    return eventos.filter((evento) => {
      if (!evento.dataEvento) return false;

      if (diaFocado) {
        return evento.dataEvento === diaFocado;
      }

      const dataCompromisso = new Date(evento.dataEvento + 'T00:00:00');
      let dentroDoPeriodo = false;

      if (modo === 'semanal') {
        const inicioSemana = new Date(diasParaExibir[0]);
        inicioSemana.setHours(0, 0, 0, 0);
        const fimSemana = new Date(diasParaExibir[diasParaExibir.length - 1]);
        fimSemana.setHours(23, 59, 59, 999);
        dentroDoPeriodo = dataCompromisso >= inicioSemana && dataCompromisso <= fimSemana;
      } else {
        dentroDoPeriodo =
          dataCompromisso.getMonth() === dataSelecionada.getMonth() &&
          dataCompromisso.getFullYear() === dataSelecionada.getFullYear();
      }

      return dentroDoPeriodo;
    });
  }, [eventos, modo, dataSelecionada, diaFocado, diasParaExibir]);

  const tituloMesAno = dataSelecionada.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  // Ações do Modal com integração REST
  const abrirModalNovo = () => {
    setEventoEditando(null);
    setFormTitulo('');
    setFormDescricao('');
    setFormDataEvento(diaFocado || dataHojeIso);
    setFormHorarioInicio('09:00');
    setFormHorarioFim('10:00');
    setFormLocal('');
    setFormCategoria('FAMILIA');
    setModalAberto(true);
  };

  const abrirModalEdicao = (evento: EventoAgenda) => {
    setEventoEditando(evento);
    setFormTitulo(evento.titulo);
    setFormDescricao(evento.descricao || '');
    setFormDataEvento(evento.dataEvento);
    setFormHorarioInicio(normalizarHora(evento.horarioInicio));
    setFormHorarioFim(normalizarHora(evento.horarioFim));
    setFormLocal(evento.local || '');
    setFormCategoria(evento.categoria || 'FAMILIA');
    setModalAberto(true);
  };

  const salvarEvento = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitulo.trim() || !formDataEvento) return;

    const payload: Omit<EventoAgenda, 'id'> = {
      titulo: formTitulo.trim(),
      descricao: formDescricao.trim() || null,
      dataEvento: formDataEvento,
      horarioInicio: formHorarioInicio ? normalizarHora(formHorarioInicio) : null,
      horarioFim: formHorarioFim ? normalizarHora(formHorarioFim) : null,
      local: formLocal.trim() || null,
      categoria: formCategoria,
    };

    try {
      if (eventoEditando) {
        await agendaService.atualizar(eventoEditando.id, payload);
      } else {
        await agendaService.criar(payload);
      }
      await carregarEventos();
      setModalAberto(false);
    } catch (err) {
      console.error('Erro ao salvar evento:', err);
      alert('Erro ao salvar no banco. Pressione F12 e veja a aba Network/Rede.');
    }
  };

  const deletarEvento = async (id: number) => {
    if (window.confirm('Deseja excluir este evento da agenda?')) {
      try {
        await agendaService.deletar(id);
        await carregarEventos();
      } catch (err) {
        console.error('Erro ao excluir evento:', err);
        alert('Erro ao excluir evento no banco de dados.');
      }
    }
  };

  return (
    <>
      <div className="painel-tarefa agenda-painel">
        <div className="tarefa-container">

          {/* Header de Ações */}
          <div className="agenda-header-actions">
            <div className="btn-group-periodo">
              <button className={`btn-filtro ${modo === 'semanal' ? 'ativo' : ''}`} onClick={() => setModo('semanal')}>
                Semanal
              </button>
              <button className={`btn-filtro ${modo === 'mensal' ? 'ativo' : ''}`} onClick={() => setModo('mensal')}>
                Mensal
              </button>
            </div>

            <div className="navegacao-data">
              <button className="btn-nav" onClick={() => navegarPeriodo('anterior')}>&lt;</button>
              <button className="btn-hoje" onClick={() => { setDataSelecionada(new Date()); setDiaFocado(null); }}>Hoje</button>
              <span className="label-mes-ano">{tituloMesAno}</span>
              <button className="btn-nav" onClick={() => navegarPeriodo('proximo')}>&gt;</button>
            </div>

            <div className="acoes-header-direita">
              <button className="btn-novo-evento" onClick={abrirModalNovo}>
                + Novo Evento
              </button>
            </div>
          </div>

          {/* Conteúdo Principal Lado a Lado */}
          <div className="painel-conteudo agenda-lado-a-lado">

            {/* Lado Esquerdo: Calendário */}
            <div className="agenda-coluna-calendario">
              <div className="calendario-wrapper">
                <div className="calendario-header-dias">
                  {diasDaSemana.map((dia) => (
                    <div key={dia} className="dia-semana-label">{dia}</div>
                  ))}
                </div>

                <div className={`calendario-grid ${modo}`}>
                  {diasParaExibir.map((diaObj, index) => {
                    const dataIso = formatarDataIso(diaObj);
                    const eMesAtual = diaObj.getMonth() === dataSelecionada.getMonth();
                    const eHoje = dataHojeIso === dataIso;
                    const eSelecionado = diaFocado === dataIso;
                    const qtdEventos = eventos.filter((ev) => ev.dataEvento === dataIso).length;

                    return (
                      <div
                        key={index}
                        className={`dia-celula ${!eMesAtual ? 'fora-do-mes' : ''} ${eHoje ? 'dia-hoje' : ''} ${eSelecionado ? 'dia-selecionado' : ''}`}
                        onClick={() => setDiaFocado(diaFocado === dataIso ? null : dataIso)}
                      >
                        <span className="numero-dia">{diaObj.getDate()}</span>
                        {qtdEventos > 0 && (
                          <div className="indicador-eventos">
                            <span className="ponto-evento"></span>
                            <small>{qtdEventos} {qtdEventos === 1 ? 'evento' : 'eventos'}</small>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Lado Direito: Resumo + Lista */}
            <div className="coluna-tarefas agenda-lista-container">
              <div className="agenda-resumo-cards-grid">
                <div className="card-resumo-item destaque-hoje">
                  <div className="resumo-info">
                    <span className="resumo-titulo">Compromissos Hoje</span>
                    <strong className="resumo-valor">{totalHoje}</strong>
                  </div>
                </div>

                <div className="card-resumo-item destaque-periodo">
                  <div className="resumo-info">
                    <span className="resumo-titulo">Total no Período</span>
                    <strong className="resumo-valor">{eventosFiltrados.length}</strong>
                  </div>
                </div>
              </div>

              <div className="agenda-resumo-card">
                <h3>
                  {diaFocado ? (
                    <>Eventos do dia: <span>{diaFocado}</span></>
                  ) : (
                    <>Eventos de: <span style={{ textTransform: 'capitalize' }}>{tituloMesAno} ({modo})</span></>
                  )}
                </h3>
              </div>

              <div className="agenda-grid">
                {eventosFiltrados.length === 0 ? (
                  <div className="agenda-vazia">Nenhum evento agendado para esta seleção.</div>
                ) : (
                  eventosFiltrados.map((evento) => (
                    <div key={evento.id} className="card-agenda">
                      <div className="card-agenda-header">
                        <span className="badge-categoria">{evento.categoria || 'EVENTO'}</span>
                        <div className="acoes-card-evento">
                          <button className="btn-card-acao" onClick={() => abrirModalEdicao(evento)}>Editar</button>
                          <button className="btn-card-acao" onClick={() => deletarEvento(evento.id)}>Excluir</button>
                        </div>
                      </div>
                      <h4>{evento.titulo}</h4>
                      {evento.descricao && <p>{evento.descricao}</p>}
                      <div className="card-agenda-detalhes">
                        <span>Data: {evento.dataEvento}</span>
                        {evento.horarioInicio && (
                          <span>
                            Horário: {normalizarHora(evento.horarioInicio)}{' '}
                            {evento.horarioFim ? `- ${normalizarHora(evento.horarioFim)}` : ''}
                          </span>
                        )}
                        {evento.local && <span>Local: {evento.local}</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Modal Criar/Editar */}
      {modalAberto && (
        <div className="modal-overlay" onClick={() => setModalAberto(false)}>
          <div className="modal-conteudo" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{eventoEditando ? 'Editar Evento' : 'Novo Evento'}</h3>
              <button className="btn-fechar-modal" onClick={() => setModalAberto(false)}>&times;</button>
            </div>
            <form onSubmit={salvarEvento} className="form-evento">
              <div className="form-group">
                <label>Título *</label>
                <input type="text" required value={formTitulo} onChange={(e) => setFormTitulo(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Descrição</label>
                <textarea rows={2} value={formDescricao} onChange={(e) => setFormDescricao(e.target.value)} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Data *</label>
                  <input type="date" required value={formDataEvento} onChange={(e) => setFormDataEvento(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Categoria</label>
                  <select value={formCategoria} onChange={(e) => setFormCategoria(e.target.value as EventoAgenda['categoria'])}>
                    <option value="FAMILIA">Família</option>
                    <option value="CONSULTA">Consulta</option>
                    <option value="ESCOLA">Escola</option>
                    <option value="LAZER">Lazer</option>
                    <option value="OUTROS">Outros</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Início</label>
                  <input type="time" value={formHorarioInicio} onChange={(e) => setFormHorarioInicio(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Fim</label>
                  <input type="time" value={formHorarioFim} onChange={(e) => setFormHorarioFim(e.target.value)} />
                </div>
              </div>
              <div className="form-group">
                <label>Local</label>
                <input type="text" value={formLocal} onChange={(e) => setFormLocal(e.target.value)} />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancelar" onClick={() => setModalAberto(false)}>Cancelar</button>
                <button type="submit" className="btn-salvar" disabled={!formularioEventoValido}>Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AgendaFamiliaPage;