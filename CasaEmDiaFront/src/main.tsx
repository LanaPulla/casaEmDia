import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './global.scss';
import { AccessAlarm, ThreeDRotation } from '@mui/icons-material';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
