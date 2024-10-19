import React, { useState } from 'react';
import './agregarMedioPago.css';

const AgregarMedioPago = ({ onClose, onAgregar }) => {
    const [nombreTitular, setNombreTitular] = useState('');
    const [numeroTarjeta, setNumeroTarjeta] = useState('');
    const [fechaVencimiento, setFechaVencimiento] = useState('');
    const [cvv, setCvv] = useState('');

    const [mensajeExito, setMensajeExito] = useState(false);

    // Formatea el numero de tarjeta
    const handleNumeroTarjetaChange = (e) => {
        let valor = e.target.value.replace(/\D/g, ''); // Elimina lo que no sea un numero
        valor = valor.replace(/(.{4})/g, '$1 '); // Agrega un espacio cada 4 numeros
        setNumeroTarjeta(valor.trim()); // Elimina cualquier espacio al final
    };

    // Formatea fecha de vencimiento
    const handleFechaVencimientoChange = (e) => {
        let valor = e.target.value.replace(/\D/g, ''); // Elimina todo lo que no sea numero
        if (valor.length >= 3 && valor.length <= 4) {
            valor = valor.replace(/(\d{2})(\d{2})/, '$1/$2'); // Formato dd/mm
        } else if (valor.length > 4) {
            valor = valor.replace(/(\d{2})(\d{2})(\d{4})/, '$1/$2/$3'); // Formato dd/mm/aaaa
        }
        setFechaVencimiento(valor);
    };

    // Formatea el numero de tarjeta
    const handleCvvChange = (e) => {
        let valor = e.target.value.replace(/\D/g, ''); // Elimina lo que no sea un numero
        setCvv(valor.trim()); // Elimina cualquier espacio al final
    };

    const handleAgregar = () => {

        // Validacion de que los campos tienen algo
        if (!nombreTitular || !numeroTarjeta || !fechaVencimiento || !cvv) {
            alert('Por favor complete todos los campos');
            return;
        }


        // Aqui deberia estar la logica del backend


        // Si el backend responde con exito, hace lo siguiente
        setMensajeExito(true);

        // Limpiar el formulario y cerrar luego de 10s
        setNombreTitular('');
        setNumeroTarjeta('');
        setFechaVencimiento('');
        setCvv('');

        // Se cierra en 5s solo, cerrando el formulario
        setTimeout(() => {
            setMensajeExito(false);
            onClose();
        }, 5000);
    };

    return (
        <div className="popupMediosPago">
            <div className="popupMediosPago-inner">
                <h2>Agregar Medio de Pago</h2>
                <div className="popupMediosPago-field">
                    <label>Nombre del Titular</label>
                    <input
                        type="text"
                        value={nombreTitular}
                        onChange={(e) => setNombreTitular(e.target.value)}
                        required
                    />
                </div>
                <div className="popupMediosPago-field">
                    <label>Número de Tarjeta</label>
                    <input
                        type="text"
                        value={numeroTarjeta}
                        onChange={handleNumeroTarjetaChange}
                        maxLength="19"
                        required
                    />
                </div>
                <div className="popupMediosPago-field">
                    <label>Fecha de Vencimiento</label>
                    <input
                        type="text"
                        value={fechaVencimiento}
                        onChange={handleFechaVencimientoChange}
                        maxLength="10"
                        required
                    />
                </div>
                <div className="popupMediosPago-field">
                    <label>CVV</label>
                    <input
                        type="text"
                        value={cvv}
                        onChange={handleCvvChange}
                        maxLength="3"
                        required
                    />
                </div>
                <div className="popupMediosPago-buttons">
                    <button onClick={handleAgregar}>Agregar</button>
                    <button onClick={onClose}>Cancelar</button>
                </div>
            </div>
            {mensajeExito && (
                <div className="success-popup" onClick={() => {
                    setMensajeExito(false);
                    onClose();
                }}>
                    <div className="success-content">
                        <span className="icon">✔️</span> Medio de pago agregado correctamente
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgregarMedioPago;