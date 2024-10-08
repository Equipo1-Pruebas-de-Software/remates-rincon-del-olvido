import React from 'react';
import './header.css';
import { Link, useLocation } from 'react-router-dom';

const Header = ({isLogin}) => {
    const location = useLocation();
    if (isLogin) return null; //Verifica si estamos en la pag de Login
    return (
        /*
        <div className="header">
            <button className="header-button">Inicio</button>
            <button className="header-button">Perfil</button>
            <button className="header-button">Cerrar Sesión</button>
        </div>
        */
        <div className="header">
        <nav>
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Inicio</Link>
            <Link to="/perfil" className={location.pathname === '/perfil' ? 'active' : ''}>Perfil</Link>
        </nav>
        <nav className='nav-right'>
            <Link to="/login">Cerrar sesión</Link>
        </nav>
      </div>
    );
};

export default Header;
