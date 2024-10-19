import React, { useState } from 'react';
import './cambiarFotoPerfil.css';

const CambiarFotoPerfil = ({ onClose, onActualizarFoto }) => {
    const [nuevaFoto, setNuevaFoto] = useState(null);
    const [previewFoto, setPreviewFoto] = useState('');

    const handleSeleccionarFoto = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNuevaFoto(file);
            setPreviewFoto(URL.createObjectURL(file));
        }
    };

    const handleActualizarFoto = () => {
        if (nuevaFoto) {
            // Aquí se enviaria la nueva foto al backend
            onActualizarFoto(previewFoto);  // Simula que se actualizo la foto
            onClose(); // Cierra el pop-up
        }
    };

    return (
        <div className="popupFoto">
            <div className="popupFoto-inner">
                <h2>Cambiar Foto de Perfil</h2>
                <img src={previewFoto || 'https://via.placeholder.com/150'} alt="Previsualización" />
                <input type="file" onChange={handleSeleccionarFoto} accept="image/*" />
                <div className="fotoperfil-buttons">
                    <button onClick={handleActualizarFoto}>Actualizar Foto</button>
                    <button onClick={onClose}>Cancelar</button>
                </div>
            </div>
        </div>
    );
};

export default CambiarFotoPerfil;