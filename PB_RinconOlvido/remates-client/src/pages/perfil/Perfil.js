import React, {useState} from 'react';
import './perfil.css';
import AgregarMedioPago from '../mediosPago/AgregarMedioPago';
import CambiarFotoPerfil from './CambiarFotoPerfil';


const Perfil = () => {
    //Aqui deberia cargarse los datos del usuario que ingreso
    const [fotoUsuario, setFotoUsuario] = useState('https://via.placeholder.com/150');
    const [mostrarPopup, setMostrarPopup] = useState(false);
    const [mostrarCambiarFoto, setMostrarCambiarFoto] = useState(false);

    const usuario = {
        nombre: 'Juan',
        apellido: 'Harry',
        correo: 'juanxd@gmail.com',
        foto: fotoUsuario // aqui la foto funciona con url
    };

    //Por este lado deberian cargarse las tarjetas que posee el usuario desde una llamada del backend
    const [mediosPago, setMediosPago] = useState([
        { numero: '**** **** **** 9256' },
        { numero: '**** **** **** 5562' },
        { numero: '**** **** **** 8584' },
        { numero: '**** **** **** 7654' }
    ]);

    const agregarMedioPago = (nuevaTarjeta) => {
        setMediosPago((prev) => [...prev, { numero: nuevaTarjeta.numeroTarjeta }]);
    };

    const actualizarFotoPerfil = (nuevaFotoUrl) => {
        setFotoUsuario(nuevaFotoUrl); // Aquí se actualiza la foto
    };

    return (
        <div className="perfil-container">
            <div className="perfil-card">

                <div className="foto-container" onClick={() => setMostrarCambiarFoto(true)}>
                    <img src={usuario.foto} alt={`${usuario.nombre} ${usuario.apellido}`} className="foto-usuario" />
                    <img src="https://cdn-icons-png.flaticon.com/512/1159/1159970.png" alt="Editar foto" className="icono-lapiz-img" />
                </div>

                <h2>{usuario.nombre} {usuario.apellido}</h2>
                <p><strong>Correo:</strong> {usuario.correo}</p>

                <div className="medios-pago">
                    <h3>Medios de Pago</h3>
                    <ul>
                        {/* AQUI MUESTRA LAS 4 PRIMERAS TARJETAS (ASUMO QUE SE PROGRAMARA QUE NOI PUEDE AGREGAR MAS DE 4) */}
                        {mediosPago.slice(0, 4).map((pago, index) => (
                            <li key={index}>
                                <span className="icono-tarjeta">💳</span> {pago.numero}
                            </li>
                        ))}
                    </ul>
                    <button onClick={() => setMostrarPopup(true)} className="agregar-medio-pago">
                        Agregar Medio de Pago
                    </button>
                </div>
            </div>

            {mostrarPopup && (
                <AgregarMedioPago
                    onClose={() => setMostrarPopup(false)}
                    onAgregar={agregarMedioPago}
                />
            )}

            {mostrarCambiarFoto && (
                <CambiarFotoPerfil
                    onClose={() => setMostrarCambiarFoto(false)}
                    onActualizarFoto={actualizarFotoPerfil}
                />
            )}

        </div>
    );
};

export default Perfil;
