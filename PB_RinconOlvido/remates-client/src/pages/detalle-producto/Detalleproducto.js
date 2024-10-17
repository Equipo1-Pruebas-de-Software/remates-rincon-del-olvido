import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './detalleproducto.css';
import EditarProducto from '../catalogo/editarProducto.js';
import { BASE_URL } from '../../services/constants.js';
import axios from 'axios';

const ProductoDetalle = () => {
    const { id } = useParams(); // Obtenemos el id de la url
    const [producto, setProducto] = useState(null);
    const [tiempoRestante, setTiempoRestante] = useState('');

    const [mostrarPopup, setMostrarPopup] = useState(false); // Estado para controlar el popup
    const [nuevaOferta, setNuevaOferta] = useState(''); // Estado para la nueva oferta
    const [mensajeExito, setMensajeExito] = useState(false); //Estado para el mensaje de exito

    const [isAdmin] = useState(true); // esto simula que el usuario es admin, se debe implementar esta logica en backend por seguridad

    //Popup de eliminacion
    const [isPopupVisibleEliminar, setIsPopupVisibleEliminar] = useState(false);
    const [successMessageEliminar, setSuccessMessageEliminar] = useState("");

    //Aqui debe ir la logica o la carga de los detalles de un producto
    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/products/${id}`, { withCredentials: true });
                if (response.data.status === 'success') {
                    const productoData = response.data.data;
                    setProducto({
                        id: productoData.id,
                        nombre: productoData.name,
                        precio: parseFloat(productoData.start_price),
                        fecha_termino: productoData.end_date,
                        imagen: productoData.image_url,
                    });
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProducto();
    }, [id]);

    useEffect(() => {
        if (producto) {
            const interval = setInterval(() => {
                setTiempoRestante(calcularTiempoRestante(producto.fecha_termino));
            }, 1000); // Actualiza cada segundo

            // Calcular el tiempo restante inmediatamente
            setTiempoRestante(calcularTiempoRestante(producto.fecha_termino));

            return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
        }
    }, [producto]);

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

    //Para mostrar popup de agregar producto
    const [mostrarEditar, setMostrarEditar] = useState(false);

    const abrirEditar = () => {
        setMostrarEditar(true);
    };

    const cerrarEditar = () => {
        setMostrarEditar(false);
    };

    //Popup de eliminacion
    const abrirPopupEliminar = () => {
        setIsPopupVisibleEliminar(true);
    };
    
    const cerrarPopupEliminar = () => {
        setIsPopupVisibleEliminar(false);
    };
    
    const eliminarProducto = async () => {
        // Aqui va la logica backend de eliminacion del producto
        
        // Esto deberia salir siempre y cuando la eliminacion sale bien
        setSuccessMessageEliminar("Producto eliminado correctamente");
        setIsPopupVisibleEliminar(false);
    };

    const calcularTiempoRestante = (fechaTermino) => {
        const ahora = new Date();
        const termino = new Date(fechaTermino);
        const diferencia = termino - ahora;

        if (diferencia <= 0) {
            return "Finalizado";
        }

        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

        return `${dias}d, ${horas}h, ${minutos}min, ${segundos}s`;
    };

    if (!producto) {
        return <div>Producto no encontrado</div>;
    }

    return (
        <div>
            <div className="detalle-container">
                <div className="image-container">
                    {/* Cambiar cuando esté listo, a producto.imagen */}
                    <img src="https://media.istockphoto.com/id/931643150/vector/picture-icon.jpg?s=612x612&w=0&k=20&c=St-gpRn58eIa8EDAHpn_yO4CZZAnGD6wKpln9l3Z3Ok=" alt={producto.nombre} className="imagen-producto" />
                </div>
                <div className="info">
                    <h1>{producto.nombre}</h1>
                    <p>Precio: ${producto.precio}</p>
                    <p>Termina: {tiempoRestante}</p>

                    {/* Boton para nueva oferta */}
                    <button onClick={handleNuevaOfertaClick} className="boton-oferta">
                        Hacer nueva oferta
                    </button>
                    {/* {isAdmin && (
                            <button onClick={abrirEditar} className="boton-agregar">Editar producto</button>
                    )}
                    {isAdmin && (
                            <button onClick={abrirPopupEliminar} className="boton-editar-eliminar">Eliminar producto</button>
                    )} */}
                {/* cerrar PopUp */}
                {mostrarEditar && <EditarProducto onClose={cerrarEditar} producto={producto}/>}
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
            {/* Popup de eliminar */}
            {isPopupVisibleEliminar && (
                <div className="popup">
                    <div className="popupEliminar">
                        <h2>¿Seguro que deseas eliminar este producto? :</h2>
                        <h4>{producto.nombre}</h4>
                        <button className="Cancelarbutton-e" onClick={cerrarPopupEliminar}>Cancelar</button>
                        <button className="Eliminarbutton" onClick={eliminarProducto}>Eliminar</button>
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

            {successMessageEliminar && (
                <div className="success-popup" onClick={() => setSuccessMessageEliminar(false)}>
                    <div className="success-content">
                        <span className="icon">✔️</span> Producto Eliminado correctamente
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