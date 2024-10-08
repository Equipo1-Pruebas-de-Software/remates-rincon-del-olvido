import React from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';
import Catalogo from './Catalogo';
import Header from './Header';
import ProductoDetalle from './Detalleproducto';

function Rutas() {
  const location = useLocation(); //Para obtener ruta actual

  return (
    <>
      {/* Navegacion entre pags, modificar despues para login y register*/}
      <Header isLogin={location.pathname === '/login' || location.pathname === '/register'}/>
      <Routes>
        <Route path="/" element={<Catalogo />} />
        <Route path="/producto/:id" element={<ProductoDetalle />} />
      </Routes>
    </>
  );
}

export default Rutas;