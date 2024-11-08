import React from 'react';
import {Route, Routes} from 'react-router-dom';
import Catalogo from './pages/catalogo/Catalogo';
import Login from './pages/login/Login';
import LoginAdmin from './pages/loginAdmin/LoginAdmin';
import Perfil from './pages/perfil/Perfil';
import ProductoDetalle from './pages/detalle-producto/Detalleproducto';
import Register from './pages/register/Register';
import Layout from './components/ProtectedLayout';
import { Toaster } from 'react-hot-toast';

function Rutas() {

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/loginAdmin" element={<LoginAdmin />} />
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