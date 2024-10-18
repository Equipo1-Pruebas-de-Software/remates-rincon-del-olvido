import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Catalogo from './pages/catalogo/Catalogo';
import Login from './pages/login/Login';
import Perfil from './Perfil';
import ProductoDetalle from './pages/detalle-producto/Detalleproducto';
import Register from './Register';
import Layout from './components/ProtectedLayout';
import { Toaster } from 'react-hot-toast';

function Rutas() {

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Layout />}>
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/producto/:id" element={<ProductoDetalle />} />
          <Route path="/perfil" element={<Perfil />} />
        </Route>
      </Routes>
    </>
  );
}

export default Rutas;