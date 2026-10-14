import { useState } from 'react';
import './home.css';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddIcon from '@mui/icons-material/Add';

// Importações dos seus componentes e tipos
// IMPORTANTE: Ajuste os caminhos (../) dependendo da sua estrutura de pastas!
import type { TarefaProps } from '../../types/tarefas'; 
import CardResumo from '../components/tarefas/cardResumos';

export function Home() {
  const dataAtual = new Date();
  
  // Lógica para o cabeçalho de boas-vindas
  const diaSemana = dataAtual.toLocaleDateString('pt-BR', { weekday: 'long' });
  const dia = dataAtual.getDate();
  const mes = dataAtual.toLocaleDateString('pt-BR', { month: 'long' });
  const diaSemanaFormatado = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);
  const mesFormatado = mes.charAt(0).toUpperCase() + mes.slice(1);
  const dataFormatada = `Hoje, ${diaSemanaFormatado}, ${dia} de ${mesFormatado}`;

  const nomeUsuario = localStorage.getItem('nomeUsuario') || 'Família';

  // --- LÓGICA DO MOCK ---
  // Geramos a data de hoje no formato YYYY-MM-DD para bater com o filtro do CardResumo
  const anoMock = dataAtual.getFullYear();
  const mesMock = String(dataAtual.getMonth() + 1).padStart(2, "0");
  const diaMock = String(dataAtual.getDate()).padStart(2, "0");
  const dataFiltroMock = `${anoMock}-${mesMock}-${diaMock}`;

  // Criamos os dados mockados baseados na sua interface TarefaProps
  const tarefasMockadas: TarefaProps[] = [
    {
      id: 1,
      titulo: "Lavar a louça do almoço",
      responsavel: { id: 1, nome: "João", email: "joao@email.com", criado_em: "2026-01-01" },
      prioridade: "Alta",
      recorrencia: "Diária",
      status: "Concluída",
      observacao: "Usar detergente neutro",
      data: dataFiltroMock, // Hoje
    },
    {
      id: 2,
      titulo: "Varrer a casa",
      responsavel: { id: 2, nome: "Maria", email: "maria@email.com", criado_em: "2026-01-01" },
      prioridade: "Média",
      recorrencia: "Nenhuma",
      status: "Em Andamento",
      observacao: "",
      data: dataFiltroMock, // Hoje
    },
    {
      id: 3,
      titulo: "Tirar o lixo",
      responsavel: { id: 1, nome: "João", email: "joao@email.com", criado_em: "2026-01-01" },
      prioridade: "Baixa",
      recorrencia: "Diária",
      status: "Pendente",
      observacao: "Lixo reciclável",
      data: dataFiltroMock, // Hoje
    },
    {
      id: 4,
      titulo: "Fazer o jantar",
      responsavel: { id: 2, nome: "Maria", email: "maria@email.com", criado_em: "2026-01-01" },
      prioridade: "Alta",
      recorrencia: "Diária",
      status: "Pendente",
      observacao: "Descongelar o frango",
      data: dataFiltroMock, // Hoje
    }
  ];

  // Passamos o array mockado como valor inicial do estado
  const [tarefas, setTarefas] = useState<TarefaProps[]>(tarefasMockadas);
  // ------------------------

  return (
    <div className="home-container">
      
      {/* PAINEL PRINCIPAL */}
      <div className="painel-conteudo">
        <div className="banner-agenda">
          <div className="banner-info">
            <span className="rotina-tag">
              <CalendarMonthIcon fontSize="small" /> {dataFormatada}
            </span>
            <h2>Bem-Vindo {nomeUsuario}! 🌿</h2>
            <p>
              A harmonia da casa começa na cooperação de todos. Vamos deixar tudo em dia e com leveza hoje!
            </p>
          </div>
        </div>
      </div>
      
        {/* CARD DE RESUMOS */}
        <div className='w-100'>
           <CardResumo telaInteira={true} dataSelecionada={dataAtual} tarefas={tarefas} />
        </div>

    </div>
  );
}