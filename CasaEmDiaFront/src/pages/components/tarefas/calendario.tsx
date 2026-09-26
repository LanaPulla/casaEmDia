"use client";

const tamanho = 1.3;

interface CalendarioTarefaProps {
  dataSelecionada: Date;
  setDataSelecionada: (data: Date) => void;
}

const cores = {
  fundo: "#faf9f6",
  destaque: "#3F5E52",
  hover: "#DFEBE4",
};

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

  const dias = Array.from(
    { length: quantidadeDias },
    (_, index) => index + 1
  );

  function selecionarDia(dia: number) {
    const novaData = new Date(ano, mes, dia);
    setDataSelecionada(novaData);
  }

  function mesAnterior() {
    const novaData = new Date(ano, mes - 1, 1);
    setDataSelecionada(novaData);
  }

  function proximoMes() {
    const novaData = new Date(ano, mes + 1, 1);
    setDataSelecionada(novaData);
  }

  return (
    <div
      className="rounded-4 shadow-sm p-3"
      style={{
        backgroundColor: cores.fundo,
        width: "25rem",
        maxWidth: "100%",
        fontSize: "1.125rem",
      }}
    >
      {/* Cabeçalho */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <button
          type="button"
          onClick={mesAnterior}
          className="btn btn-sm rounded-circle border-0 fs-4 lh-1"
          style={{ color: cores.destaque }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = cores.hover)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          ‹
        </button>

        <h2
          className="fw-semibold text-capitalize m-0 fs-5"
          style={{ color: cores.destaque }}
        >
          {nomeMes} {ano}
        </h2>

        <button
          type="button"
          onClick={proximoMes}
          className="btn btn-sm rounded-circle border-0 fs-4 lh-1"
          style={{ color: cores.destaque }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = cores.hover)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "transparent")
          }
        >
          ›
        </button>
      </div>

      {/* Dias da semana */}
      <div className="row row-cols-7 g-0 text-center mb-2">
        {["D", "S", "T", "Q", "Q", "S", "S"].map((letra, index) => (
          <div key={index} className="col fw-semibold small text-secondary">
            {letra}
          </div>
        ))}
      </div>

      {/* Dias do mês */}
      <div className="row row-cols-7 g-1">
        {Array.from({ length: primeiroDia }).map((_, index) => (
          <div key={`vazio-${index}`} className="col" />
        ))}

        {dias.map((dia) => {
          const selecionado =
            dataSelecionada.getDate() === dia &&
            dataSelecionada.getMonth() === mes &&
            dataSelecionada.getFullYear() === ano;

          return (
            <div key={dia} className="col d-flex justify-content-center">
              <button
                type="button"
                onClick={() => selecionarDia(dia)}
                className="btn btn-sm rounded-circle p-0 border-0"
                style={{
                  width: "2rem",
                  height: "2rem",
                  backgroundColor: selecionado ? cores.destaque : "transparent",
                  color: selecionado ? "#fff" : "#495057",
                }}
                onMouseEnter={(e) => {
                  if (!selecionado)
                    e.currentTarget.style.backgroundColor = cores.hover;
                }}
                onMouseLeave={(e) => {
                  if (!selecionado)
                    e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {dia}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}