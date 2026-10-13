import { useState } from 'react';
import './navBar.css';
import { useNavigate } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import CalendarViewDayOutlinedIcon from '@mui/icons-material/CalendarViewDayOutlined';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import LogoutIcon from '@mui/icons-material/Logout';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export function NavBar() {
    const [navBarEscondida, setNavBarEscondida] = useState(true);
    const [encerrandoSessao, setEncerrandoSessao] = useState(false);
    const [erroLogout, setErroLogout] = useState('');
    const navigate = useNavigate();

    function abreFechaNavbar() {
        setNavBarEscondida(!navBarEscondida);
    }

    async function sair() {
        if (encerrandoSessao) return;

        setErroLogout('');
        setEncerrandoSessao(true);
        try {
            const response = await fetch(`${API_URL}/api/usuario/logout`, {
                method: 'POST',
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error(`Não foi possível encerrar a sessão (HTTP ${response.status}).`);
            }
            navigate('/login', { replace: true });
        } catch (error) {
            setErroLogout(error instanceof TypeError
                ? 'Não foi possível conectar à API para encerrar a sessão.'
                : error instanceof Error ? error.message : 'Não foi possível encerrar a sessão.');
        } finally {
            setEncerrandoSessao(false);
        }
    }

    return (
        <>
            {navBarEscondida ? (
                <div className='nav-bar-prof-escondida d-flex flex-column align-items-center py-3 px-2'>
                    <div className='d-flex flex-column justify-content-center align-items-center gap-3 w-100'>
                        <div onClick={() => navigate('/home')} className='d-flex justify-content-center menu-item align-items-center'>
                            <FamilyRestroomIcon />
                        </div>
                        <div onClick={() => navigate('/membros')} className='d-flex justify-content-center menu-item align-items-center' title='Membros da família'>
                            <GroupAddIcon />
                        </div>
                        <div onClick={() => navigate('/tarefas')} className='d-flex justify-content-center menu-item align-items-center'> 
                            <FactCheckIcon />
                        </div>
                        <div onClick={() => navigate('/agenda')} className='d-flex justify-content-center menu-item align-items-center'> 
                            <CalendarMonthIcon />
                        </div>
                    </div>

                    <div className='d-flex flex-column align-items-center justify-content-center mt-auto w-100 gap-2'>
                        <div
                            className='d-flex justify-content-center menu-item align-items-center btn-sair-icon'
                            onClick={sair}
                            title={encerrandoSessao ? 'Saindo...' : 'Sair'}
                            aria-label={encerrandoSessao ? 'Encerrando sessão' : 'Sair'}
                            aria-disabled={encerrandoSessao}
                            role='button'
                            tabIndex={encerrandoSessao ? -1 : 0}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    void sair();
                                }
                            }}
                        >
                            <LogoutIcon />
                        </div>
                        <div className='d-flex justify-content-center menu-item align-items-center' onClick={abreFechaNavbar}>
                            <CalendarViewDayOutlinedIcon />
                        </div>
                    </div>
                    {erroLogout && <p className='nav-logout-error' role='alert'>{erroLogout}</p>}
                </div>
            ) : (
                <div className='nav-bar-prof d-flex flex-column py-3 px-3'>
                    <div className='gap-3 d-flex flex-column w-100'>
                        <div className='gap-2 d-flex align-items-center menu-item' onClick={() => navigate('/home')}>
                            <FamilyRestroomIcon />
                            <p className='m-0'>Home</p>
                        </div>
                        <div className='gap-2 d-flex align-items-center menu-item' onClick={() => navigate('/membros')}>
                            <GroupAddIcon />
                            <p className='m-0'>Membros</p>
                        </div>
                        <div className='gap-2 d-flex align-items-center menu-item' onClick={() => navigate('/painel-tarefas')}>
                            <FactCheckIcon />
                            <p className='m-0'>Tarefas</p>
                        </div>
                        <div className='gap-2 d-flex align-items-center menu-item' onClick={() => navigate('/painel-agenda')}>
                            <CalendarMonthIcon />
                            <p className='m-0'>Agenda</p>
                        </div>
                    </div>

                    <div className='gap-2 flex-column d-flex mt-auto w-100'>
                        <div
                            className='gap-2 d-flex align-items-center menu-item btn-sair-texto'
                            onClick={sair}
                            aria-disabled={encerrandoSessao}
                            role='button'
                            tabIndex={encerrandoSessao ? -1 : 0}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                    event.preventDefault();
                                    void sair();
                                }
                            }}
                        >
                            <LogoutIcon />
                            <p className='m-0'>{encerrandoSessao ? 'Saindo...' : 'Sair'}</p>
                        </div>
                        <div className='gap-2 d-flex align-items-center menu-item' onClick={abreFechaNavbar}>
                            <CalendarViewDayOutlinedIcon />
                            <p className='m-0'>Fechar</p>
                        </div>
                    </div>
                    {erroLogout && <p className='nav-logout-error' role='alert'>{erroLogout}</p>}
                </div>
            )}
        </>
    );
}