import { useNavigate, useLocation } from 'react-router-dom';
import CottageIcon from '@mui/icons-material/Cottage';
import './header.css';

export function Header() {
    const navigate = useNavigate();
    const location = useLocation(); 

    return (
        <header className="header-container d-flex align-items-center justify-content-between px-4 py-3 bg-white">
            <div className="header-logo d-flex align-items-center gap-2" onClick={() => navigate('/home')} style={{cursor: 'pointer'}}>
                <div className="icone-casa">
                    <CottageIcon />
                </div>
                <h1 className="m-0 titulo-header">CasaEmDia</h1>
            </div>

            <div className="header-actions d-flex align-items-center gap-3">
                <div className="avatar-usuario">
                    Família Tal
                </div>
            </div>
        </header>
    );
}