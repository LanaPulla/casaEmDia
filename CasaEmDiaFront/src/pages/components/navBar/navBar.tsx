import { useState } from 'react';
import './navBar.css';
import { useNavigate } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import CalendarViewDayOutlinedIcon from '@mui/icons-material/CalendarViewDayOutlined';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import LogoutIcon from '@mui/icons-material/Logout';

export function NavBar() {
    const [navBarEscondida, setNavBarEscondida] = useState(true);
    const navigate = useNavigate();

    function abreFechaNavbar() {
        setNavBarEscondida(!navBarEscondida);
    }

    return (
        <>
            {navBarEscondida ? (
                <div className='nav-bar-prof-escondida d-flex flex-column align-items-center py-3 px-2'>
                    <div className='d-flex flex-column justify-content-center align-items-center gap-3 w-100'>
                        <div onClick={() => navigate('/home')} className='d-flex justify-content-center menu-item align-items-center'>
                            <FamilyRestroomIcon />
                        </div>
                        <div onClick={() => navigate('/tarefas')} className='d-flex justify-content-center menu-item align-items-center'> 
                            <FactCheckIcon />
                        </div>
                        <div onClick={() => navigate('/agenda')} className='d-flex justify-content-center menu-item align-items-center'> 
                            <CalendarMonthIcon />
                        </div>
                    </div>

                    <div className='d-flex flex-column align-items-center justify-content-center mt-auto w-100 gap-2'>
                        <div className='d-flex justify-content-center menu-item align-items-center btn-sair-icon' onClick={() => navigate('/login')}>
                            <LogoutIcon />
                        </div>
                        <div className='d-flex justify-content-center menu-item align-items-center' onClick={abreFechaNavbar}>
                            <CalendarViewDayOutlinedIcon />
                        </div>
                    </div>
                </div>
            ) : (
                <div className='nav-bar-prof d-flex flex-column py-3 px-3'>
                    <div className='gap-3 d-flex flex-column w-100'>
                        <div className='gap-2 d-flex align-items-center menu-item' onClick={() => navigate('/home')}>
                            <FamilyRestroomIcon />
                            <p className='m-0'>Home</p>
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
                        <div className='gap-2 d-flex align-items-center menu-item btn-sair-texto' onClick={() => navigate('/login')}>
                            <LogoutIcon />
                            <p className='m-0'>Sair</p>
                        </div>
                        <div className='gap-2 d-flex align-items-center menu-item' onClick={abreFechaNavbar}>
                            <CalendarViewDayOutlinedIcon />
                            <p className='m-0'>Fechar</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}