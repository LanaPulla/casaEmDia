import { useMemo, useState } from 'react';

import type { EventoAgenda } from '../../../types/agenda';
import '../../agenda/agendaFamilia.css';
import '../tarefas/cardResumos.css';
import './resumoAgenda.css';

interface ResumoAgendaProps {
  eventos: EventoAgenda[];
}

const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function formatarDataIso(d: Date): string {
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function normalizarHora(hora?: string | null): string {
  if (!hora) return '';
  return hora.length >= 5 ? hora.slice(0, 5) : hora;
}

/**
 * Resumo da agenda (somente visualização): calendário do mês atual,
 * totais e lista de eventos. Clicar num dia filtra a lista por aquele dia.
 */
export default function ResumoAgenda({ eventos }: ResumoAgendaProps) {
  const hoje = new Date();
  const dataHojeIso = formatarDataIso(hoje);
  const [diaFocado, setDiaFocado] = useState<string | null>(null);

  const diasParaExibir = useMemo(() => {
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();
    const listaDias: Date[] = [];
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);

    for (let i = primeiroDia.getDay(); i > 0; i--) listaDias.push(new Date(ano, mes, 1 - i));
    for (let d = 1; d <= ultimoDia.getDate(); d++) listaDias.push(new Date(ano, mes, d));
    const restantes = 42 - listaDias.length;
    for (let j = 1; j <= restantes; j++) listaDias.push(new Date(ano, mes + 1, j));

    return listaDias;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataHojeIso]);

  const qtdPorDia = useMemo(() => {
    const mapa = new Map<string, number>();
    eventos.forEach((ev) => {
      if (ev.dataEvento) mapa.set(ev.dataEvento, (mapa.get(ev.dataEvento) ?? 0) + 1);
    });
    return mapa;
  }, [eventos]);

  const totalHoje = qtdPorDia.get(dataHojeIso) ?? 0;

  const eventosFiltrados = useMemo(() => {
    return eventos
      .filter((evento) => {
        if (!evento.dataEvento) return false;
        if (diaFocado) return evento.dataEvento === diaFocado;
        const data = new Date(evento.dataEvento + 'T00:00:00');
        return data.getMonth() === hoje.getMonth() && data.getFullYear() === hoje.getFullYear();
      })
      .sort((a, b) =>
        `${a.dataEvento} ${a.horarioInicio ?? ''}`.localeCompare(`${b.dataEvento} ${b.horarioInicio ?? ''}`),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventos, diaFocado, dataHojeIso]);

  const tituloMesAno = hoje.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="resumo-telaIntira">
      <h3 className="resumo-titulo">Resumo da agenda</h3>

      <div className="painel-conteudo agenda-lado-a-lado resumo-agenda-conteudo">
        {/* Calendário */}
        <div className="agenda-coluna-calendario">
          <div className="calendario-wrapper">
            <div className="calendario-header-dias">
              {diasDaSemana.map((dia) => (
                <div key={dia} className="dia-semana-label">{dia}</div>
              ))}
            </div>

            <div className="calendario-grid mensal">
              {diasParaExibir.map((diaObj) => {
                const dataIso = formatarDataIso(diaObj);
                const eMesAtual = diaObj.getMonth() === hoje.getMonth();
                const eHoje = dataHojeIso === dataIso;
                const eSelecionado = diaFocado === dataIso;
                const qtdEventos = qtdPorDia.get(dataIso) ?? 0;

                return (
                  <div
                    key={dataIso}
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

        {/* Totais + lista */}
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
                <>Eventos de: <span style={{ textTransform: 'capitalize' }}>{tituloMesAno}</span></>
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
  );
}
