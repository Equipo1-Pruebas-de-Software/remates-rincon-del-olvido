import { useState } from 'react';
import './catalogo.css';
import { BASE_URL } from '../../services/constants';
import axios from 'axios';

const AgregarProductoPopup = ({ onClose }) => {
    const [nombreProducto, setNombreProducto] = useState('');
    const [precioBase, setPrecioBase] = useState('');
    const [fechaTermino, setFechaTermino] = useState('');
    const [imagenPortada, setImagenPortada] = useState(null);
    const [imagenesAdicionales, setImagenesAdicionales] = useState([]);
    const [descripcion, setDescripcion] = useState('');

    const [mensajeExito, setMensajeExito] = useState(false);

    // Se agregan hasta 5 imagenes addicionales sin incluir portada
    const handleAgregarImagen = () => {
        if (imagenesAdicionales.length < 5) {
            setImagenesAdicionales([...imagenesAdicionales, '']);
        }
    };

    const handleCambiarImagenAdicional = (index, url) => {
        const nuevasImagenes = [...imagenesAdicionales];
        nuevasImagenes[index] = url;
        setImagenesAdicionales(nuevasImagenes);
    };

    const validarFormulario = () => {
        if (!nombreProducto || !precioBase || !fechaTermino || !imagenPortada || !descripcion) {
            alert('Todos los campos obligatorios deben ser llenados.');
            return false;
        }
        return true;
    };

    const handleEliminarImagen = (index) => {
        const nuevasImagenes = imagenesAdicionales.filter((_, i) => i !== index);
        setImagenesAdicionales(nuevasImagenes);
    };

    const limpiarCampos = () => {
        setNombreProducto('');
        setPrecioBase('');
        setFechaTermino('');
        setImagenPortada(null);
        setImagenesAdicionales([]);
        setDescripcion('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validarFormulario()) {
            
            const newFormData = {
                name: nombreProducto,
                price: precioBase,
                end_date: fechaTermino,
                image_url: imagenPortada, // Asigna la URL de la imagen
                description: descripcion
            };

            // Esto para imagenes adicionales
            /*
            imagenesAdicionales.forEach((imagen, index) => {
                newFormData.append(`additional_image_${index}`, imagen);
            });
            */

            try {
                await axios.post(`${BASE_URL}/products`, newFormData, {withCredentials: true});
                // Mostrar el mensaje de exito y se borra el formulario
                setMensajeExito(true);
                limpiarCampos();
    
                // Ocultar el popup despues de un tiempo
                setTimeout(() => {
                    setMensajeExito(false);
                    onClose();
                    window.location.reload();
                }, 3000);
            } catch (error) {
                console.error('Error al enviar los datos:', error);
                console.log(error);
                alert('Ocurrió un error al agregar el producto');
            }
        }
    };

    return (
        <div className="agregar-popup-overlay">
            <div className="agregar-popup-content">
                <div className="agregar-popup-title">
                    Agregar producto al catálogo
                </div>
                <form onSubmit={handleSubmit} className="agregar-popup-form">
                    <div className="agregar-form-col">
                        <label>Nombre del Producto:</label>
                        <input
                            type="text"
                            value={nombreProducto}
                            onChange={(e) => setNombreProducto(e.target.value)}
                            required
                        />

                        <label>Precio Base:</label>
                        <input
                            type="number"
                            value={precioBase}
                            onChange={(e) => setPrecioBase(e.target.value)}
                            required
                        />

                        <label>Fecha de Término:</label>
                        <input
                            type="date"
                            value={fechaTermino}
                            onChange={(e) => setFechaTermino(e.target.value)}
                            required
                        />

                        <div className="contenedor-portada">
                            <label>URL de Imagen de Portada:</label>
                            <input
                                type="text"
                                value={imagenPortada}
                                onChange={(e) => setImagenPortada(e.target.value)}
                                placeholder="URL de la imagen de portada"
                                required
                            />

                            {imagenPortada && (
                                <div className="contenedor-miniatura">
                                    <img src={imagenPortada} alt="Portada" className="miniatura-portada" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="agregar-form-col imagenes-adicionales">

                        <label>Descripción:</label>
                            <textarea
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                required
                        />

                        <label>Imágenes Adicionales (máximo 5):</label>
                        {imagenesAdicionales.map((imagen, index) => (
                            <div key={index} className="agregar-imagen-adicional">
                                <input
                                    type="text"
                                    className="input-imagen-adicional"
                                    value={imagen}
                                    onChange={(e) => handleCambiarImagenAdicional(index, e.target.value)}
                                    placeholder="URL de la imagen"
                                />
                                {imagen && (
                                    <img
                                        src={imagen}
                                        alt={`Imagen adicional ${index + 1}`}
                                        className="miniatura-imagen"
                                    />
                                )}
                                <button
                                    type="button"
                                    className="agregar-boton-eliminar"
                                    onClick={() => handleEliminarImagen(index)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))}

                        {imagenesAdicionales.length < 5 && (
                            <button
                                type="button"
                                onClick={handleAgregarImagen}
                                className='agregar-boton-agregar'
                                /* Imagenes adicionales son opcional de agregar */
                            >
                                Agregar Imagen adicional
                            </button>
                        )}
                    </div>


                {/* Botones de abajo */}
                <div className="agregar-popup-buttons">
                    <button type="submit" className="agregar-boton-aplicar">Agregar Producto</button>
                    <button type="button" className="agregar-boton-cancelar" onClick={onClose}>Cancelar</button>
                </div>

                </form>            
                {/* Popup de éxito */}
                {mensajeExito && (
                    <div className="success-popup" onClick={() => {
                        setMensajeExito(false);
                        window.location.reload();
                    }}>
                    <div className="success-content">
                        <span className="icon">✔️</span> Producto agregado exitosamente
                    </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgregarProductoPopup;
