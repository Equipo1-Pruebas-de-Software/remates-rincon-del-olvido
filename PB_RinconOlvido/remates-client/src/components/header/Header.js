import React from 'react';
import './header.css';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();
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
            <Link to="/catalogo" className={location.pathname === '/' ? 'active' : ''}>Catálogo</Link>
            <Link to="/perfil" className={location.pathname === '/perfil' ? 'active' : ''}>Perfil</Link>
        </nav>
        <nav className='nav-right'>
            <Link to="/">Cerrar sesión</Link>
        </nav>
      </div>
    );
};

export default Header;
