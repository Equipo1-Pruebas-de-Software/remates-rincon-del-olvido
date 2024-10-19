import { useState, useRef } from 'react';
import './catalogo.css';
import { BASE_URL } from '../../services/constants';
import axios from 'axios';

const AgregarProductoPopup = ({ onClose }) => {
    const [nombreProducto, setNombreProducto] = useState('');
    const [precioBase, setPrecioBase] = useState('');
    const [fechaTermino, setFechaTermino] = useState('');
    const [imagenPortada, setImagenPortada] = useState(null);
    const [imagenesAdicionales, setImagenesAdicionales] = useState([]);

    const [mensajeExito, setMensajeExito] = useState(false);

    const imagenPortadaRef = useRef(null);
    const imagenesAdicionalesRef = useRef(null);

    // Se agregan hasta 5 imagenes addicionales sin incluir portada
    const handleAgregarImagen = (event) => {
        if (imagenesAdicionales.length < 5) {
            setImagenesAdicionales([...imagenesAdicionales, event.target.files[0]]);
        }
    };

    const validarFormulario = () => {
        if (!nombreProducto || !precioBase || !fechaTermino || !imagenPortada) {
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

        // resetea los campos para subir imagenes
        if (imagenPortadaRef.current) {
            imagenPortadaRef.current.value = '';
        }
        if (imagenesAdicionalesRef.current) {
            imagenesAdicionalesRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validarFormulario()) {
            // Creando un FormData para poder enviar la imagen junto con los datos
            const formData = new FormData();
            formData.append('name', nombreProducto);
            formData.append('price', precioBase);
            formData.append('end_date', fechaTermino);
            formData.append('image_url', "https://png.pngtree.com/png-clipart/20200224/original/pngtree-question-mark-icon-for-your-project-png-image_5214036.jpg"); // Aquí suponemos que almacenarás la URL de la imagen directamente

            // Esto para imagenes adicionales
            /*
            imagenesAdicionales.forEach((imagen, index) => {
                formData.append(`additional_image_${index}`, imagen);
            });
            */


            try {
                await axios.post(`${BASE_URL}/products`, formData, {withCredentials: true});
                // Mostrar el mensaje de exito y se borra el formulario
                setMensajeExito(true);
                limpiarCampos();
    
                // Ocultar el popup despues de un tiempo
                setTimeout(() => {
                    setMensajeExito(false);
                    onClose();
                }, 3000);
            } catch (error) {
                console.error('Error al enviar los datos:', error);
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

                        <label>Imagen de Portada:</label>
                        <input
                            type="file"
                            accept="image/*"
                            ref={imagenPortadaRef}
                            onChange={(e) => setImagenPortada(e.target.files[0])}
                            required
                        />
                    </div>

                    <div className="agregar-form-col imagenes-adicionales">
                        <label>Imágenes Adicionales (máximo 5):</label>
                        {imagenesAdicionales.map((imagen, index) => (
                            <div key={index} className="agregar-imagen-adicional">
                                <p>{imagen.name}</p>
                                <button type="button" className="agregar-boton-eliminar" onClick={() => handleEliminarImagen(index)}>Eliminar</button>
                            </div>
                        ))}

                        {imagenesAdicionales.length < 5 && (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAgregarImagen}
                                ref={imagenesAdicionalesRef}
                                /* Imagenes adicionales son opcional de agregar */
                            />
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
                    <div className="success-popup" onClick={() => setMensajeExito(false)}>
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
