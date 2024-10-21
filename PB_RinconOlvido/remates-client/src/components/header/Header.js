import { React, useState, useEffect } from 'react';
import './header.css';
import { Link, useLocation } from 'react-router-dom';
import { BASE_URL } from '../../services/constants';
import axios from 'axios';

const Header = () => {
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/auth`, { withCredentials: true });
                if (response.data.status === 'success') {
                    const { user_role } = response.data.data;
                    if (user_role === 'admin') {
                        setIsAdmin(true);
                    }
                }
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };
    
        fetchUserRole();
    }, []);

    const location = useLocation();
    return (
        <div className="header">
            <h2 className="nav_title">El Rincon del Olvido</h2>
            <nav className="nav-left">
                <Link to="/catalogo" className={location.pathname === '/catalogo' ? 'active' : ''}>Catálogo</Link>
                {!isAdmin && (
                    <Link to="/perfil" className={location.pathname === '/perfil' ? 'active' : ''}>Perfil</Link>
                )}
            </nav>
            <nav className="nav-right">
                <Link to="/">Cerrar sesión</Link>
            </nav>
        </div>
    );
};

export default Header;
