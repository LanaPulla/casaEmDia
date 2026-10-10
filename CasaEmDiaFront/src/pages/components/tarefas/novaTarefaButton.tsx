import { useState } from "react";

const OPCOES_RECORRENCIA = ['Diária', 'Semanal', 'Mensal'] as const;
const OPCOES_STATUS = ['Concluída', 'Em Andamento', 'Pendente'] as const;
const OPCOES_PRIORIDADE = ['Baixa', 'Media', 'Alta'] as const;

type Recorrencia = typeof OPCOES_RECORRENCIA[number];
type Status = typeof OPCOES_STATUS[number];
type Prioridade = typeof OPCOES_PRIORIDADE[number];


export default function NovaTarefaButton() {
    const [modal, setModal] = useState(false);
    const [recorrencia, setRecorrencia] = useState<Recorrencia>('Diária');
    const [prioridade, setPrioridade] = useState<Prioridade>('Alta');
    const [status, setStatus] = useState<Status>('Pendente');

    return (
        <div>
            <button 
                className="botao-modal-tarefa" 
                onClick={() => setModal(!modal)}>
                
            </button>
            {modal && (
                <div className="modal-nova-tarefa">
                    <div className="container-modal">
                        <h1 className="titulo-modal">
                            Nova Tarefa
                        </h1>

                        <div className="campos-modal">
                            <form>
                                <label>
                                    Título: 
                                    <input type="text" name="titulo"/>
                                </label>
                                
                                <input type="checkbox" name="responsavel">Responsável: </input>
                                
                                
                                <div>
                                    {OPCOES_PRIORIDADE.map((opcao) => (
                                            <label key={opcao} style={{ display: 'block' }}>
                                            <input
                                                type="radio"
                                                name="prioridade"
                                                value={opcao}
                                                checked={prioridade === opcao}
                                                onChange={(e) => setPrioridade(e.target.value as Prioridade)}
                                            />
                                            {opcao}
                                        </label>
                                    ))}
                                </div>
                                
                                <div>
                                    {OPCOES_RECORRENCIA.map((opcao) => (
                                        <label key={opcao} style={{ display: 'block' }}>
                                        <input
                                            type="radio"
                                            name="recorrencia"
                                            value={opcao}
                                            checked={recorrencia === opcao}
                                            onChange={(e) => setRecorrencia(e.target.value as Recorrencia)}
                                        />
                                        {opcao}
                                        </label>
                                    ))}
                                </div>

                                <div>
                                    {OPCOES_STATUS.map((opcao) => (
                                        <label key={opcao} style={{ display: 'block' }}>
                                        <input
                                            type="radio"
                                            name="status"
                                            value={opcao}
                                            checked={status === opcao}
                                            onChange={(e) => setStatus(e.target.value as Status)}
                                        />
                                        {opcao}
                                        </label>
                                    ))}
                                </div>

                                <input type="text" name="descricao">Descricção:</input>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

}