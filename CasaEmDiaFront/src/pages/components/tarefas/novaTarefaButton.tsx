import { useState, type FormEvent } from "react";
import type { UsuarioProps } from "../../../types/tarefas";
import { useNavigate } from "react-router-dom";

const OPCOES_RECORRENCIA = ['Nenhuma','Diária', 'Semanal', 'Mensal'] as const;
const OPCOES_STATUS = ['Concluída', 'Em Andamento', 'Pendente'] as const;
const OPCOES_PRIORIDADE = ['Baixa', 'Média', 'Alta'] as const;

type Recorrencia = typeof OPCOES_RECORRENCIA[number];
type Status = typeof OPCOES_STATUS[number];
type Prioridade = typeof OPCOES_PRIORIDADE[number];
type Props = { usuarios: UsuarioProps[] };

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export default function NovaTarefaButton({usuarios}: Props) {
    const navigate = useNavigate();

    const [modal, setModal] = useState(false);
    const [recorrencia, setRecorrencia] = useState<Recorrencia>('Diária');
    const [prioridade, setPrioridade] = useState<Prioridade>('Alta');
    const [status, setStatus] = useState<Status>('Pendente');
    const [titulo, setTitulo] = useState('');
    const [observacao, setObservacao] = useState('');
    const [enviando, setEnviando] = useState(true);
    const [sucesso, setSucesso] = useState('');

    const [responsavelId, setResponsavelId] = useState<number | ''>('');

    async function cadastrarTarefa(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSucesso('');
        setEnviando(true);
        
        try {
            const body = {titulo, responsavelId, prioridade, recorrencia, status, observacao };
            const response = await fetch(`${API_URL}/api/tarefas/criar`, {
                method:'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error('Não foi possível acessar a API. Tente novamente.');
            }

            setSucesso('Tarefa criada com sucesso! Confira ela e mais outras no menu incial.');
            navigate('/home');
        } catch (error) {
            // setErro(error instanceof Error ? error.message : 'Ocorreu um erro inesperado.');
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div>
            <button 
                className="btn btn-lg btn-success" 
                onClick={() => setModal(!modal)}>
                    + Nova Tarefa
                
            </button>
            {modal && (
    <div
        style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1050,
                overflowY: 'auto',
            }}
            onClick={() => setModal(false)}
        >
            <div
                className="bg-white rounded-4 shadow p-4"
                style={{ width: '100%', maxWidth: '36rem', maxHeight: '90vh', overflowY: 'auto' }}
                onClick={(e) => e.stopPropagation()}
            >
                    <h1 className="titulo-modal fs-4 fw-bold mb-4">
                        Nova Tarefa
                    </h1>

                            <div className="campos-modal">
                                <form className="d-flex flex-column gap-3" onSubmit={cadastrarTarefa}>
                                    <div>
                                        <label>
                                            Título: 
                                            <input 
                                            className="form-control" 
                                            type="text" 
                                            name="titulo"
                                            onChange={(e) => setTitulo(e.target.value)}
                                            required/>
                                        </label>
                                    </div>

                                    <div>
                                        <label>
                                            Responsável:
                                            <select
                                                className="form-select"
                                                name="responsavel"
                                                value={responsavelId}
                                                onChange={(e) =>
                                                    setResponsavelId(e.target.value === '' ? '' : Number(e.target.value))
                                                }
                                                required
                                            >
                                                <option value="">Selecione um responsável</option>
                                                {usuarios.map((usuario) => (
                                                    <option key={usuario.id} value={usuario.id}>
                                                        {usuario.nome}
                                                    </option>
                                                ))}
                                            </select>
                                        </label> 
                                    </div>
                                    
                                    <fieldset>
                                        <legend className="form-label fs-6">Prioridade: </legend>
                                        {OPCOES_PRIORIDADE.map((opcao) => (
                                            <div key={opcao} className="form-check form-check-inline">
                                                <input
                                                    type="radio"
                                                    name="prioridade"
                                                    id={`prioridade-${opcao}`}
                                                    value={opcao}
                                                    checked={prioridade === opcao}
                                                    onChange={(e) => setPrioridade(e.target.value as Prioridade)}
                                                />
                                                <label className="form-check-label" htmlFor={`prioridade-${opcao}`}>
                                                    {opcao}
                                                </label>
                                            </div>
                                        ))}
                                    </fieldset>                                
                                    
                                    <fieldset>
                                        <legend className="form-label fs-6">Recorrência: </legend>
                                        {OPCOES_RECORRENCIA.map((opcao) => (
                                            <div  key={opcao} className="form-check form-check-inline">
                                                <input
                                                    type="radio"
                                                    name="recorrencia"
                                                    value={opcao}
                                                    checked={recorrencia === opcao}
                                                    onChange={(e) => setRecorrencia(e.target.value as Recorrencia)}
                                                />
                                                <label className="form-check-label" htmlFor={`recorrencia-${opcao}`}>
                                                    {opcao}
                                                </label>
                                            </div>
                                        ))}
                                    </fieldset>

                                    <fieldset>
                                        <legend className="form-label fs-6">Status: </legend>
                                        {OPCOES_STATUS.map((opcao) => (
                                            <div key={opcao} className="form-check form-check-inline">
                                                <input
                                                    type="radio"
                                                    name="status"
                                                    value={opcao}
                                                    checked={status === opcao}
                                                    onChange={(e) => setStatus(e.target.value as Status)}
                                                />
                                                <label className="form-check-label" htmlFor={`status-${opcao}`}>
                                                    {opcao}
                                                </label>
                                            </div>
                                        ))}
                                    </fieldset>

                                    <label>
                                        Observação:
                                        <textarea 
                                            className="form-control" 
                                            name="observacao"
                                            onChange={(e) => setObservacao(e.target.value)}/>
                                    </label>
                                    
                                    <div className="d-flex justify-content-end gap-2">
                                        <button className="btn btn-secondary" 
                                        type="button" 
                                        onClick={() => setModal(false)}
                                        >
                                            Fechar
                                        </button>

                                        {sucesso && <p className="text-success mt-2 mb-0" style={{ fontSize: '14px' }}>{sucesso}</p>}

                                        <button 
                                            className="btn btn-success" 
                                            type="submit" 
                                            >
                                            Criar
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                </div>
            )}
        </div>
    );

}