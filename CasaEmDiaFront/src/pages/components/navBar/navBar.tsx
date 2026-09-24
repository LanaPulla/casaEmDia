import { useState } from 'react';
import './navBarProf.css';
import { useNavigate } from 'react-router-dom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import Groups2OutlinedIcon from '@mui/icons-material/Groups2Outlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import DatasetOutlinedIcon from '@mui/icons-material/DatasetOutlined';
import ChromeReaderModeOutlinedIcon from '@mui/icons-material/ChromeReaderModeOutlined';
import CalendarViewDayOutlinedIcon from '@mui/icons-material/CalendarViewDayOutlined';

export function NavBarProf() {

    const [navBarEscondida, setNavBarEscondida] = useState(false);

    const navigate = useNavigate();

    function abreFechaNavbar() {
        setNavBarEscondida(!navBarEscondida);
    }

    return (

        <>
            {navBarEscondida ? (
                <div className='nav-bar-prof-escondida d-flex flex-column align-items-center pb-4'>
                    
                    <div className='img-nav-bar-escondida d-flex justify-content-center align-items-center mb-4'>
                       {/* <img src='/login/logo-removebg-sem-nome.PNG' alt='EduConnect' />                    */}
                    </div>

                    <div className='d-flex flex-column justify-content-center align-items-center gap-3 w-100'> 
                        <div onClick={() => navigate('prof/painel')} className='d-flex justify-content-center menu-item align-items-center'> 
                            <DatasetOutlinedIcon />
                        </div>
                        <div onClick={() => navigate('/prof/turmas')} className='d-flex justify-content-center menu-item align-items-center'> 
                            <Groups2OutlinedIcon />
                        </div>
                        <div onClick={() => navigate('/prof')} className='d-flex justify-content-center menu-item align-items-center'> 
                            <ArticleOutlinedIcon />
                        </div>
                        <div onClick={() => navigate('/prof')} className='d-flex justify-content-center menu-item align-items-center'>
                            <CalendarMonthIcon />
                        </div>
                        <div onClick={() => navigate('/prof')} className='d-flex justify-content-center menu-item align-items-center'>
                            <ChromeReaderModeOutlinedIcon />
                        </div>
                        <div onClick={() => navigate('/prof')} className='d-flex justify-content-center menu-item align-items-center'>
                            <FamilyRestroomIcon />
                        </div>
                    </div>

                    <div className='d-flex flex-wrap align-items-center justify-content-center mt-auto w-100'>
                        
                        <div className='gap-3 d-flex align-items-center justify-content-center menu-item ' onClick={abreFechaNavbar}>
                        <CalendarViewDayOutlinedIcon />
                        </div>
                        
                    </div>
                    
                </div>
            ) : (
                <div className='nav-bar-prof d-flex flex-column pb-4'>
                    <div className='logo-nav-bar d-flex flex-wrap justify-content-center align-items-center gap-2'>
                        {/* <img src='/login/logo-removebg-sem-nome.PNG' alt='EduConnect' /> */}
                        <p className='m-0'>EduConnect</p>
                    </div>

                    <div className='nav-bar-rotas m-3 gap-3 d-flex flex-column'>
                        <div onClick={() => navigate('/prof/painel')} className='gap-1 d-flex flex-wrap align-items-center menu-item'>
                            <DatasetOutlinedIcon />
                            <p className='m-0'>Painel</p>
                        </div>
                        <div className='gap-1 d-flex flex-wrap align-items-center menu-item'>
                            <Groups2OutlinedIcon />
                            <p className='m-0' onClick={() => navigate('/prof')}>Turmas</p>
                        </div>
                        <div className='gap-1 d-flex flex-wrap align-items-center menu-item'>
                            <ArticleOutlinedIcon />
                            <p className='m-0' onClick={() => navigate('/prof')}>Avisos</p>
                        </div>
                        <div className='gap-1 d-flex flex-wrap align-items-center menu-item'>
                            <CalendarMonthIcon />
                            <p className='m-0' onClick={() => navigate('/prof')}>Calendário</p>
                        </div>
                        <div className='gap-1 d-flex flex-wrap align-items-center menu-item '>
                            <ChromeReaderModeOutlinedIcon />
                            <p className='m-0' onClick={() => navigate('/prof')}>Notas</p>
                        </div>
                        <div className='gap-1 d-flex flex-wrap align-items-center menu-item'>
                            <FamilyRestroomIcon />
                            <p className='m-0' onClick={() => navigate('/prof')}>Mensagens</p>
                        </div>
                    </div>

                    <div className='ml-3 mr-3 gap-1 d-flex flex-wrap align-items-center mt-auto'>

                        <div className='menu-item d-flex gap-1 flex-wrap' onClick={abreFechaNavbar}>
                            <CalendarViewDayOutlinedIcon />
                            <p className='m-0'>Fechar</p>
                        </div>
                    </div>
                    
                </div>

            )}
        </>
    );
}