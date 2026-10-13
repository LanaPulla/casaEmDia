"use client";

import "./calendario.css";

interface CalendarioTarefaProps {
  dataSelecionada: Date;
  setDataSelecionada: (data: Date) => void;
}

const diasSemana = [
  { letra: "D", nome: "Domingo" },
  { letra: "S", nome: "Segunda" },
  { letra: "T", nome: "Terça" },
  { letra: "Q", nome: "Quarta" },
  { letra: "Q", nome: "Quinta" },
  { letra: "S", nome: "Sexta" },
  { letra: "S", nome: "Sábado" },
];

export default function CalendarioTarefa({
  dataSelecionada,
  setDataSelecionada,
}: CalendarioTarefaProps) {
  const mes = dataSelecionada.getMonth();
  const ano = dataSelecionada.getFullYear();

  const quantidadeDias = new Date(ano, mes + 1, 0).getDate();
  const primeiroDia = new Date(ano, mes, 1).getDay();

  const nomeMes = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
  }).format(new Date(ano, mes, 1));

  const dias = Array.from({ length: quantidadeDias }, (_, i) => i + 1);

  const hoje = new Date();
  const ehHoje = (dia: number) =>
    hoje.getDate() === dia &&
    hoje.getMonth() === mes &&
    hoje.getFullYear() === ano;

  function selecionarDia(dia: number) {
    setDataSelecionada(new Date(ano, mes, dia));
  }

  function mesAnterior() {
    setDataSelecionada(new Date(ano, mes - 1, 1));
  }

  function proximoMes() {
    setDataSelecionada(new Date(ano, mes + 1, 1));
  }

  function irParaHoje() {
    setDataSelecionada(new Date());
  }

  return (
    <div className="calendario">

      <div className="cabecalho">
        <button
          type="button"
          onClick={mesAnterior}
          className="botaoNav"
          aria-label="Mês anterior"
        >
          ‹
        </button>

        <h2 className="titulo">
          {nomeMes} {ano}
        </h2>

        <button
          type="button"
          onClick={proximoMes}
          className="botaoNav"
          aria-label="Próximo mês"
        >
          ›
        </button>
      </div>

      <div className="semana">
        {diasSemana.map((d, index) => (
          <div key={index} className="diaSemana" title={d.nome}>
            {d.letra}
          </div>
        ))}
      </div>


      <div className="grade">
        {Array.from({ length: primeiroDia }).map((_, index) => (
          <div key={`vazio-${index}`} />
        ))}

        {dias.map((dia) => {
          const selecionado =
            dataSelecionada.getDate() === dia &&
            dataSelecionada.getMonth() === mes &&
            dataSelecionada.getFullYear() === ano;

          const classes = [
            "dia",
            ehHoje(dia) ? "hoje" : "",
            selecionado ? "selecionado" : "",
          ].join(" ");

          return (
            <button
              key={dia}
              type="button"
              onClick={() => selecionarDia(dia)}
              className={classes}
              aria-pressed={selecionado}
            >
              {dia}
            </button>
          );
        })}
      </div>


      <div className="rodape">
        <button type="button" onClick={irParaHoje} className="botaoHoje">
          Hoje
        </button>
      </div>
    </div>
  );
}