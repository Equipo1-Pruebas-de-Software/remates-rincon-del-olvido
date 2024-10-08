import React from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';
import Catalogo from './Catalogo';
import Login from './Login';
import Header from './Header';
import Perfil from './Perfil';
import ProductoDetalle from './Detalleproducto';
import Register from './Register';

function Rutas() {
  const location = useLocation(); //Para obtener ruta actual

  return (
    <>
      {/* Navegacion entre pags, modificar despues para login y register*/}
      <Header isLogin={location.pathname === '/login' || location.pathname === '/register'}/>
      <Routes>
        <Route path="/" element={<Catalogo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/register" element={<Register />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} />
      </Routes>
    </>
  );
}

export default Rutas;