import "./tarefas.css";
import { useEffect, useState } from "react";
import CalendarioTarefa from "../components/tarefas/calendario";
import CardResumo from "../components/tarefas/cardResumos";
import NovaTarefaButton from "../components/tarefas/novaTarefaButton";
import ListaTarefas from "../components/tarefas/listaTarefas";
import { listarMembrosFamilia } from "../../services/familia/familia";
import type { TarefaProps, UsuarioProps } from "../../types/tarefas";

export default function Tarefas() {
    const [dataSelecionada, setDataSelecionada] = useState(new Date());
    const [tarefas, setTarefas] = useState<TarefaProps[]>([]);
    const [usuarios, setUsuarios] = useState<UsuarioProps[]>([]);
    const [carregandoUsuarios, setCarregandoUsuarios] = useState(true);
    const [erroUsuarios, setErroUsuarios] = useState("");
    const [versao, setVersao] = useState(0);

    useEffect(() => {
        async function carregarMembros() {
            try {
                setErroUsuarios("");
                setUsuarios(await listarMembrosFamilia());
            } catch (error) {
                console.error(error);
                setErroUsuarios("Não foi possível carregar os membros da família.");
            } finally {
                setCarregandoUsuarios(false);
            }
        }

        void carregarMembros();
    }, []);

    function mudarDia(delta: number) {
        const novaData = new Date(dataSelecionada);
        novaData.setDate(novaData.getDate() + delta);
        setDataSelecionada(novaData);
    }

    return (
        <main>
            <section className="tarefas-principal">
                <div className="tarefas-topo">
                    <div>
                        <h1 className="tarefas-titulo">Tarefas</h1>
                        <h2 className="tarefas-subtitulo">Gerencie as tarefas da família!</h2>
                    </div>
                    {!carregandoUsuarios && usuarios.length > 0 && (
                        <NovaTarefaButton
                            usuarios={usuarios}
                            onCriada={() => setVersao((v) => v + 1)}
                        />
                    )}
                </div>

                {carregandoUsuarios && <p>Carregando membros da família...</p>}
                {erroUsuarios && (
                    <p className="text-danger" role="alert">{erroUsuarios}</p>
                )}
                {!carregandoUsuarios && !erroUsuarios && usuarios.length === 0 && (
                    <p>Cadastre ao menos um membro para criar tarefas.</p>
                )}

                <div className="tarefas-painel">
                    <CalendarioTarefa
                        dataSelecionada={dataSelecionada}
                        setDataSelecionada={setDataSelecionada}
                    />
                    <CardResumo
                        dataSelecionada={dataSelecionada}
                        tarefas={tarefas}
                    />
                </div>

                <div className="tarefas-lista-area">
                    <div className="tarefas-dia-nav">
                        <button
                            type="button"
                            onClick={() => mudarDia(-1)}
                            className="tarefas-botao-dia"
                            aria-label="Dia anterior"
                        >
                            ‹
                        </button>

                        <h2 className="tarefas-dia-titulo">
                            {dataSelecionada.toLocaleDateString("pt-BR", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </h2>

                        <button
                            type="button"
                            onClick={() => mudarDia(1)}
                            className="tarefas-botao-dia"
                            aria-label="Próximo dia"
                        >
                            ›
                        </button>
                    </div>

                    <ListaTarefas
                        key={versao}
                        dataSelecionada={dataSelecionada}
                        usuarios={usuarios}
                        tarefas={tarefas}
                        setTarefas={setTarefas}
                    />
                </div>
            </section>
        </main>
    );
}