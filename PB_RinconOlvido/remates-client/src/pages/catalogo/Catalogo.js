import { useState, useEffect } from 'react';
import './catalogo.css';
import { Link } from 'react-router-dom';
import AgregarProducto from './agregarProducto';
import { BASE_URL } from '../../services/constants';
import axios from 'axios';

const Catalogo = () => {
    const [productos, setProductos] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [productoEliminar, setProductoEliminar] = useState(null);
    const [mostrarPopup, setMostrarPopup] = useState(false);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [precioMin, setPrecioMin] = useState('');
    const [precioMax, setPrecioMax] = useState('');
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [fechaFiltro, setFechaFiltro] = useState('');
    const [timeRemaining, setTimeRemaining] = useState({});
    const [ultimaActualizacion, setUltimaActualizacion] = useState('');

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/products`, { withCredentials: true });
                if (response.data.status === 'success') {
                    setProductos(response.data.data);
                    setProductosFiltrados(response.data.data);
                    setUltimaActualizacion(new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' }));
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProductos();
        const interval = setInterval(fetchProductos, 5000);
        return () => clearInterval(interval);
    }, []);

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

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const updatedTimeRemaining = productos.reduce((acc, producto) => {
                const end = new Date(producto.end_date);
                const diff = end - now;

                if (diff > 0) {
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                    acc[producto.id] = `${days}d, ${hours}h, ${minutes}min, ${seconds}s`;
                } else {
                    acc[producto.id] = 'Finalizado';
                }
                return acc;
            }, {});

            setTimeRemaining(updatedTimeRemaining);
        }, 1000);

        return () => clearInterval(interval);
    }, [productos]);

    const confirmarEliminacion = () => {
        setProductosFiltrados(productosFiltrados.filter(p => p.id !== productoEliminar.id));
        setProductoEliminar(null); // Cierra el popup
    };

    const abrirPopup = () => {
        setMostrarPopup(true);
    };

    const cerrarPopup = () => {
        setMostrarPopup(false);
    };

    const aplicarFiltro = () => {
        let minPrecio = precioMin === '' ? 0 : parseFloat(precioMin);
        let maxPrecio = precioMax === '' ? Math.max(...productos.map(p => parseFloat(p.price))) : parseFloat(precioMax);

        const productosFiltrados = productos.filter(producto => {
            const coincideNombre = producto.name.toLowerCase().includes(filtroNombre.toLowerCase());
            const coincidePrecio = parseFloat(producto.price) >= minPrecio && parseFloat(producto.price) <= maxPrecio;
            const coincideFecha = !fechaFiltro || new Date(producto.end_date).toLocaleDateString() === new Date(fechaFiltro).toLocaleDateString();

            return coincideNombre && coincidePrecio && coincideFecha;
        });

        setProductosFiltrados(productosFiltrados);
    };

    return (
        <div>
            <div className="catalogo-container">
                <div className="catalogo-sidebar">
                    <div className="barra-lateral">
                        <h2>Filtrar productos</h2>
                        <div className="filtro">
                            <h3>Nombre</h3>
                            <input
                                type="text"
                                placeholder="Buscar por nombre"
                                value={filtroNombre}
                                onChange={(e) => setFiltroNombre(e.target.value)}
                            />
                        </div>
                        <div className="filtro">
                            <h3>Precio</h3>
                            <input
                                type="number"
                                placeholder="Precio Mínimo"
                                value={precioMin}
                                onChange={(e) => setPrecioMin(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Precio Máximo"
                                value={precioMax}
                                onChange={(e) => setPrecioMax(e.target.value)}
                            />
                        </div>
                        <div className="filtro">
                            <h3>Fecha de termino</h3>
                            <input
                                type="date"
                                value={fechaFiltro}
                                onChange={(e) => setFechaFiltro(e.target.value)}
                            />
                        </div>
                        <button className="boton-aplicar" onClick={aplicarFiltro}>Aplicar Filtro</button>
                        {isAdmin && (
                            <button onClick={abrirPopup} className="boton-agregar">Agregar un producto</button>
                        )}
                    </div>
                </div>

                <div className="catalogo">
                    {productosFiltrados.map(producto => (
                        <Link key={producto.id} to={`/producto/${producto.id}`} className="card-link">
                            <div className="catalogo-card">
                                <img src={producto.image_url} alt={producto.name} className="catalogo-imagen-producto" />
                                <div className="catalogo-info">
                                    <h3>{producto.name}</h3>
                                    {producto.Bids.length === 0 ? (
                                        <>
                                            <p ><span>Puja Inicial: ${producto.price}</span></p>
                                            <p style={{ color: 'blue' }}><strong>Sé el primero en pujar</strong></p>
                                        </>
                                    ) : (
                                        <p><span>Puja Actual: ${producto.Bids[0].bid}</span></p>
                                    )}
                                    <p><span>Termina:</span> {timeRemaining[producto.id]}</p>
                                    <p className="act_text">
                                        Última actualización: {ultimaActualizacion}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                {mostrarPopup && <AgregarProducto onClose={cerrarPopup} />}
            </div>
            {productoEliminar && (
                <div className="popup-eliminar">
                    <div className="popup-contenido">
                        <h2>¿Seguro que quieres eliminar este producto?</h2>
                        <p>{productoEliminar.name}</p>
                        <div>
                            <button onClick={() => setProductoEliminar(null)}>Cancelar</button>
                            <button onClick={confirmarEliminacion}>Eliminar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Catalogo;
