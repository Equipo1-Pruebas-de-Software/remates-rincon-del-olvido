import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './detalleproducto.css';

const ProductoDetalle = () => {
    const { id } = useParams(); // Obtenemos el id de la url
    const [producto, setProducto] = useState(null);

    const [mostrarPopup, setMostrarPopup] = useState(false); // Estado para controlar el popup
    const [nuevaOferta, setNuevaOferta] = useState(''); // Estado para la nueva oferta
    const [mensajeExito, setMensajeExito] = useState(false); //Estado para el mensaje de exito

    //Aqui debe ir la logica o la carga de los detalles de un producto
    useEffect(() => {
        // Aqui hago simulacion de datos de la bd, que cargaron aqui y se extrae el necesario para obtener su info
        const productos = [
            { id: 1, nombre: 'Producto 1', precio: 1000, fecha_termino: '2024-10-07', rareza: 'comun', imagen: 'https://via.placeholder.com/150' },
            { id: 2, nombre: 'Producto 2', precio: 100, fecha_termino: '2024-10-08', rareza: 'raro', imagen: 'https://via.placeholder.com/150' },
            { id: 3, nombre: 'Producto 3', precio: 50, fecha_termino: '2024-10-09', rareza: 'poco comun', imagen: 'https://via.placeholder.com/150' },
            { id: 4, nombre: 'Producto 4', precio: 500, fecha_termino: '2024-10-07', rareza: 'extravagante', imagen: 'https://via.placeholder.com/150' },
        ];
        const productoEncontrado = productos.find(prod => prod.id === parseInt(id));
        setProducto(productoEncontrado);
    }, [id]);

    // Funcion para nuevas ofertas
    const handleNuevaOfertaClick = () => {
        setMostrarPopup(true); // Mostrar el popup
    };

    // Funcion para agregar el nuevo precio oferta
    const handleEnviarOferta = () => {
        // Verifica si el campo esta vacio
        if (!nuevaOferta || isNaN(parseFloat(nuevaOferta))) {
            alert('Por favor, ingresa una oferta valida');
            return;
        }
        
        if (parseFloat(nuevaOferta) <= producto.precio) {
            alert('La oferta debe ser mayor al precio actual');
        } else {
            setMostrarPopup(false);
            setMensajeExito(true);
            setTimeout(() => {
                setMensajeExito(false);
            }, 10000);
            //Aqui deberia ir la logica del backend y bd
        }
    };

    if (!producto) {
        return <div>Producto no encontrado</div>;
    }

    return (
        <div>
            <div className="detalle-container">
                <div className="image-container">
                    <img src={producto.imagen} alt={producto.nombre} className="imagen-producto" />
                </div>
                <div className="info">
                    <h1>{producto.nombre}</h1>
                    <p>Rareza: {producto.rareza}</p>
                    <p>Precio: ${producto.precio}</p>
                    <p>Termina: {new Date(producto.fecha_termino).toLocaleDateString()}</p>

                    {/* Boton para nueva oferta */}
                    <button onClick={handleNuevaOfertaClick} className="boton-oferta">
                        Hacer nueva oferta
                    </button>

                </div>
                {/* Popup de oferta */}
                {mostrarPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Oferta para: {producto.nombre}</h2>
                        <p>Precio actual: ${producto.precio}</p>
                        <input
                            type="number"
                            value={nuevaOferta}
                            onChange={(e) => setNuevaOferta(e.target.value)}
                            placeholder="Ingresa tu oferta"
                        />
                        <button onClick={handleEnviarOferta}>Enviar Oferta</button>
                        <button onClick={() => setMostrarPopup(false)}>Cerrar</button>
                    </div>
                </div>
            )}

            {mensajeExito && (
                <div className="success-popup" onClick={() => setMensajeExito(false)}>
                    <div className="success-content">
                        <span className="icon">✔️</span> Oferta enviada exitosamente
                    </div>
                </div>
            )}
            </div>
            <div className="desc-container">
                <div className='desc'>
                    <h2>Descripción del Producto</h2>
                    <p>Aquí irá la descripción del producto.</p>
                </div>
            </div>
        </div>
    );
};

export default ProductoDetalle;