import { useState, useRef, useEffect} from 'react';
import './catalogo.css';

const EditarProductoPopup = ({ onClose, producto}) => {
    const [nombreProducto, setNombreProducto] = useState('');
    const [precioBase, setPrecioBase] = useState('');
    const [fechaTermino, setFechaTermino] = useState('');
    const [rareza, setRareza] = useState('');
    const [imagenPortada, setImagenPortada] = useState(null);
    const [imagenesAdicionales, setImagenesAdicionales] = useState([]);

    const [mensajeExito, setMensajeExito] = useState(false);

    const imagenPortadaRef = useRef(null);
    const imagenesAdicionalesRef = useRef(null);

    // Se cargan los datos del producto a editar
    useEffect(() => {
        if (producto) {
            setNombreProducto(producto.nombre);
            setPrecioBase(producto.precio);
            setFechaTermino(producto.fecha_termino);
            setRareza(producto.rareza);
            setImagenPortada(producto.imagen); // la imagen debe ser url, ojo
            //Las imagenes adicionales hay que agregarlas tambien para cargarlas
        }
    }, [producto]);

    // Se agregan hasta 5 imagenes addicionales sin incluir portada
    const handleAgregarImagen = (event) => {
        if (imagenesAdicionales.length < 5) {
            setImagenesAdicionales([...imagenesAdicionales, event.target.files[0]]);
        }
    };

    const validarFormulario = () => {
        if (!nombreProducto || !precioBase || !fechaTermino || !rareza || !imagenPortada) {
            alert('Todos los campos obligatorios deben ser llenados.');
            return false;
        }
        return true;
    };

    const handleEliminarImagen = (index) => {
        const nuevasImagenes = imagenesAdicionales.filter((_, i) => i !== index);
        setImagenesAdicionales(nuevasImagenes);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validarFormulario()) { 
            // Si los campos tienen contenido, se muestra mensaje de exito
            setMensajeExito(true);

            // Oculta el popup despues de un tiempo
            setTimeout(() => {
                setMensajeExito(false);
            }, 10000);  // Espera 10 segundos antes de cerrar el popup

            //Deberia ir aqui la logica backend de base de datos
        }
    };

    return (
        <div className="agregar-popup-overlay">
            <div className="agregar-popup-content">
                <div className="agregar-popup-title">
                    Editar producto: {nombreProducto}
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

                        <label>Rareza:</label>
                        <select value={rareza} onChange={(e) => setRareza(e.target.value)} required>
                            <option value="">Seleccionar rareza</option>
                            <option value="comun">Común</option>
                            <option value="poco comun">Poco común</option>
                            <option value="raro">Raro</option>
                            <option value="extravagante">Extravagante</option>
                        </select>

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
                    <button type="submit" className="agregar-boton-aplicar">Editar Producto</button>
                    <button type="button" className="agregar-boton-cancelar" onClick={onClose}>Cancelar</button>
                </div>

                </form>            
                {/* Popup de éxito */}
                {mensajeExito && (
                    <div className="success-popup" onClick={() => setMensajeExito(false)}>
                    <div className="success-content">
                        <span className="icon">✔️</span> Producto editado exitosamente
                    </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditarProductoPopup;