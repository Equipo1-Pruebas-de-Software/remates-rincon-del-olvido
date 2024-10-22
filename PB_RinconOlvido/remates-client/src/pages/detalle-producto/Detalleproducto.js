import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './detalleproducto.css';
import EditarProducto from '../catalogo/editarProducto.js';
import { BASE_URL } from '../../services/constants.js';
import axios from 'axios';

const ProductoDetalle = () => {
    const navigate = useNavigate();

    const { id } = useParams(); // Obtenemos el id de la url
    const [producto, setProducto] = useState(null);
    const [tiempoRestante, setTiempoRestante] = useState('');
    const [mostrarAdvertencia, setMostrarAdvertencia] = useState(false); //Estado para pop-up ofertar deshabilitado

    const [mostrarPopup, setMostrarPopup] = useState(false); // Estado para controlar el popup
    const [nuevaOferta, setNuevaOferta] = useState(''); // Estado para la nueva oferta
    const [mensajeExito, setMensajeExito] = useState(false); //Estado para el mensaje de exito

    const [medioPagoSeleccionado, setMedioPagoSeleccionado] = useState(''); // Estado para el medio de pago seleccionado

    const [imagenPrincipal, setImagenPrincipal] = useState(producto?.imagen); // Imagen de portada

    const [isAdmin, setIsAdmin] = useState(false);
    const [isFinished, setIsFinished] = useState(false);

    //Popup de eliminacion
    const [isPopupVisibleEliminar, setIsPopupVisibleEliminar] = useState(false);
    const [successMessageEliminar, setSuccessMessageEliminar] = useState("");

    // Simulacion de medios de pago del usuario
    const mediosPagoSimulados = [
        '**** **** **** 1234',
        '**** **** **** 5678',
        '**** **** **** 9876',
        '**** **** **** 4321'
    ];

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
                        precio: parseFloat(productoData.price),
                        fecha_termino: productoData.end_date,
                        imagen: productoData.image_url,
                        descripcion: productoData.description,
                    });
                    setImagenPrincipal(productoData.image_url);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProducto();
        if (!isAdmin){
            const interval = setInterval(fetchProducto, 5000);
            return () => clearInterval(interval);
        }
    }, [id, isAdmin]);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/auth`, { withCredentials: true });
                if (response.data.status === 'success') {
                    const { user_role } = response.data.data;
                    if (user_role === 'admin') {
                        setIsAdmin(true);
                    }
                }
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };
    
        fetchUserRole();
    }, []);

    const calcularTiempoRestante = (fechaTermino) => {
        const ahora = new Date();
        const termino = new Date(fechaTermino);
        const diferencia = termino - ahora;

        if (diferencia <= 0) {
            setIsFinished(true);
            console.log(isFinished);
            return "Finalizado";
        }

        const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
        const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

        return `${dias}d, ${horas}h, ${minutos}min, ${segundos}s`;
    };

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
    const handleEnviarOferta = async () => {
        // Verifica si el campo esta vacio
        if (!nuevaOferta || isNaN(parseFloat(nuevaOferta))) {
            alert('Por favor, ingresa una oferta valida');
            return;
        }

        if (parseFloat(nuevaOferta) <= producto.precio) {
            alert('La oferta debe ser mayor al precio actual');
        } else {
            setMostrarPopup(false);
            await axios.post(`${BASE_URL}/bids`, { bid: parseFloat(nuevaOferta), productId: id }, { withCredentials: true });
            setMensajeExito(true);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
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
        window.location.reload();
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

        try {
            await axios.delete(`${BASE_URL}/products/${id}`, {withCredentials: true});
            // Mostrar el mensaje de exito y se borra el formulario
            setSuccessMessageEliminar("Producto eliminado correctamente");
            setIsPopupVisibleEliminar(false);
            //Mandar a catalogo
            setTimeout(() => {
                navigate('/catalogo');
            }, 2000); // lo manda despues de 2s
        } catch (error) {
            console.error('Error al enviar los datos:', error);
            console.log(error);
            alert('Ocurrió un error al agregar el producto');
        }
        
    };

    const handleMedioPagoSeleccionado = (e) => {
        setMedioPagoSeleccionado(e.target.value);
    };

    const irAlPerfil = () => {
        navigate('/perfil');
    };

    if (!producto) {
        return <div>Producto no encontrado</div>;
    }

    return (
        <div>
            <div className="detalle-container">
                <div className="image-container">
                    {/* Cambiar cuando esté listo, a producto.imagen */}
                    <img src={imagenPrincipal} alt={producto.nombre} className="imagen-producto" />
                
                    <div className="imagenes-adicionales-mostrar">
                        
                        {/* Esta añade la imagen principal en miniatura */}
                        <img 
                            src={producto.imagen} 
                            alt="Imagen principal" 
                            className="imagen-adicional"
                            onClick={() => setImagenPrincipal(producto.imagen)} // Cambiar la imagen principal al hacer clic
                        />

                        {/* Esta añade imagenes adicionales en miniatura */}
                        {/*producto.imagenesAdicionales.map((img, index) => (
                            //<img 
                                //key={index} 
                                //src={img} 
                                //alt={`Imagen adicional ${index + 1}`} 
                                //className="imagen-adicional"
                                //onClick={() => //setImagenPrincipal(img)} // Cambiar la imagen principal al hacer clic
                            ///>
                          ))*/
                        }
                    </div>

                </div>
                <div className="info">
                    <h1>{producto.nombre}</h1>
                    <p>Puja actual: ${producto.precio}</p>
                    <p>Termina: {tiempoRestante}</p>

                    {!isAdmin && (
                        <div className="oferta-container">
                            {/* Boton para nueva oferta */}
                            <button 
                            onClick={handleNuevaOfertaClick}
                            //onClick={handleOfertarClick}
                            className={`boton-oferta ${isFinished ? 'disabled' : ''}`} //Para no permitir presionar sin medio de pago
                            >
                                Hacer nueva oferta
                            </button>
                            {/* Dropdown para seleccionar medio de pago */}
                            <select className="select-medio-pago" value={medioPagoSeleccionado} onChange={handleMedioPagoSeleccionado}>
                                <option value="">Seleccionar Medio de Pago</option>
                                {mediosPagoSimulados.map((medio, index) => (
                                    <option key={index} value={medio}>{medio}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {isAdmin && (
                            <button onClick={abrirEditar} className="boton-agregar">Editar producto</button>
                    )}
                    {isAdmin && (
                            <button onClick={abrirPopupEliminar} className="boton-editar-eliminar">Eliminar producto</button>
                    )}

                {/* cerrar PopUp */}
                {mostrarEditar && <EditarProducto onClose={cerrarEditar} producto={producto}/>}
                </div>
                {/* Popup de oferta */}
                {mostrarPopup && (
                <div className="popup">
                    <div className="popup-content">
                        <h2>Oferta para: {producto.nombre}</h2>
                        <p>Puja actual: ${producto.precio}</p>
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
                <div className="success-popup" onClick={() => {
                    setSuccessMessageEliminar(false);
                    navigate('/catalogo');
                }}>
                    <div className="success-content">
                        <span className="icon">✔️</span> Producto Eliminado correctamente
                    </div>
                </div>
            )}

            {mostrarAdvertencia && (
                <div className="success-popup" onClick={() => setMostrarAdvertencia(false)}>
                    <div className="advertencia-content">
                        <span className="icon">⚠️</span> Selecciona un medio de pago antes de ofertar
                        <div className="advertencia-popup-buttons">
                            <button onClick={irAlPerfil} className="advertencia-perfil">
                                Agregar Medio de pago en perfil
                            </button>
                            <button onClick={() => setMostrarAdvertencia(false)} className="advertencia-cerrar">
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            </div>
            <div className="desc-container">
                <div className='desc'>
                    <h2>Descripción del Producto</h2>
                    <p>{producto.descripcion}</p>
                </div>
            </div>
        </div>
    );
};

export default ProductoDetalle;