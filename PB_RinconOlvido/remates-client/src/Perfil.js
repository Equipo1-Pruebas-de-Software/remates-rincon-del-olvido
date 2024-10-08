import React from 'react';
import './perfil.css'; // Importa el CSS para los estilos

const Perfil = () => {
    //Aqui deberia cargarse los datos del usuario que ingreso
    const usuario = {
        nombre: 'Juan',
        apellido: 'Harry',
        telefono: '123456789',
        correo: 'juanxd@gmail.com',
        foto: 'https://via.placeholder.com/150' // aqui la foto funciona con url
    };

    return (
        <div className="perfil-container">
            <div className="perfil-card">
                <img src={usuario.foto} alt={`${usuario.nombre} ${usuario.apellido}`} className="foto-usuario" />
                <h2>{usuario.nombre} {usuario.apellido}</h2>
                <p><strong>Teléfono:</strong> {usuario.telefono}</p>
                <p><strong>Correo:</strong> {usuario.correo}</p>
            </div>
        </div>
    );
};

export default Perfil;
