import { useEffect, useState } from 'react';
import './home.css';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import type { TarefaProps } from '../../types/tarefas';
import CardResumo from '../components/tarefas/cardResumos';
import { listarTarefas } from '../../services/tarefas/tarefas';

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
  const [tarefas, setTarefas] = useState<TarefaProps[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarTarefas() {
      try {
        setErro('');
        setTarefas(await listarTarefas());
      } catch (error) {
        console.error(error);
        setErro('Não foi possível carregar as tarefas.');
      } finally {
        setCarregando(false);
      }
    }

    void carregarTarefas();
  }, []);

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
           {carregando && <p>Carregando tarefas...</p>}
           {erro && <p className="text-danger" role="alert">{erro}</p>}
           {!carregando && !erro && (
             <CardResumo telaInteira={true} dataSelecionada={dataAtual} tarefas={tarefas} />
           )}
        </div>

    </div>
  );
}