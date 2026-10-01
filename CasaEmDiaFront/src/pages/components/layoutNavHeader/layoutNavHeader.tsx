import { Outlet } from 'react-router-dom';
import { NavBar } from '../navBar/navBar';
import { Header } from '../header/header';
import './layoutNavHeader.css';

export function LayoutNavHeader() {
  return (
    <div className="layout-wrapper">
      <Header />

      <div className="layout-body">
        <NavBar />

        <main className="layout-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}