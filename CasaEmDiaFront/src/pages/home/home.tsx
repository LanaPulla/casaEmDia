import './home.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddIcon from '@mui/icons-material/Add';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';

export function Home() {
  return (
    <div className="home-container">
      {/* CARD LATERAL DA FAMÍLIA */}
      <aside className="familia-card">
        <div className="familia-header">
          <div>
            <h3 className="familia-nome">Família Silva</h3>
          </div>
        </div>

        <button className="btn-adicionar-tarefa">
          <AddIcon fontSize="small" /> Adicionar Tarefa
        </button>

        <ul className="lista-resumo">
          <li className="item-resumo ativo">
            <CheckCircleIcon fontSize="small" /> Tarefas de Hoje (4)
          </li>
          <li className="item-resumo">
            <CalendarMonthIcon fontSize="small" /> Compromissos (2)
          </li>
        </ul>
      </aside>

      {/* CONTEÚDO PRINCIPAL (PAINEL DADOS FAKES) */}
      <section className="painel-conteudo">
        {/* BANNER SUPERIOR */}
        <div className="banner-agenda">
          <div className="banner-info">
            <span className="rotina-tag">
              <ShieldOutlinedIcon fontSize="small" /> ROTINA TRANQUILA • SETEMBRO 2026
            </span>
            <h2>Agenda da Família 🗓️</h2>
            <p>Todos os horários, caronas e compromissos do nosso lar em um só lugar.</p>
          </div>
          <button className="btn-novo-compromisso">
            <CalendarMonthIcon fontSize="small" /> + Novo Compromisso
          </button>
        </div>

        {/* FILTRO E CARDS DE CONTEÚDO */}
        <div className="secao-filtros">
          <h4>Filtrar por integrante da família:</h4>
          <div className="integrantes-lista">
            <span className="chip-integrante ativo">Todos</span>
            <span className="chip-integrante">Mãe (Ana)</span>
            <span className="chip-integrante">Pai (Carlos)</span>
            <span className="chip-integrante">Filho (Lucas)</span>
          </div>
        </div>

        {/* LISTA DE DADOS DUMMY PARA TESTAR SCROLL */}
        <div className="cards-grid">
          <div className="card-item">
            <span className="card-horario">08:00 - 09:00</span>
            <h5>Levar o Lucas à Escola</h5>
            <p>Responsável: Carlos (Pai)</p>
          </div>

          <div className="card-item">
            <span className="card-horario">10:30 - 11:30</span>
            <h5>Reunião do Condomínio</h5>
            <p>Responsável: Ana (Mãe)</p>
          </div>

          <div className="card-item">
            <span className="card-horario">14:00 - 15:00</span>
            <h5>Consulta Dentista - Lucas</h5>
            <p>Responsável: Ana (Mãe)</p>
          </div>

          <div className="card-item">
            <span className="card-horario">18:00 - 19:00</span>
            <h5>Supermercado (Feira da Semana)</h5>
            <p>Responsável: Família</p>
          </div>

          <div className="card-item">
            <span className="card-horario">20:00 - 21:00</span>
            <h5>Jantar em Família</h5>
            <p>Responsável: Todos</p>
          </div>
        </div>
      </section>
    </div>
  );
}