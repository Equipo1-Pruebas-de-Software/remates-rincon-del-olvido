import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Header from './header/Header';
import { BASE_URL } from '../services/constants';
import axios from 'axios';
import toast from 'react-hot-toast';

const Layout = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const response = await axios.post(`${BASE_URL}/auth`, {}, { withCredentials: true });
        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          toast.error('Sesión expirada, por favor inicia sesión nuevamente');
          navigate('/');
        }
      } catch (error) {
        toast.error('Sesión expirada, por favor inicia sesión nuevamente');
        navigate('/');
      }
    };

    authenticate();
  }, [navigate]);

  return (
    <>
      <Header />
      {isAuthenticated ? <Outlet /> : 'Cargando...'}
    </>
  );
};

export default Layout;