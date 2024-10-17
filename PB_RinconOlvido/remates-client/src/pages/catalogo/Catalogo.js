import { useState, useEffect } from 'react';
import './catalogo.css';
import { Link } from 'react-router-dom';
import AgregarProducto from './agregarProducto';
import { BASE_URL } from '../../services/constants';
import axios from 'axios';

const Catalogo = () => {
    const [productos, setProductos] = useState([]);
    const [isAdmin] = useState(true); // esto simula que el usuario es admin, se debe implementar esta logica en backend por seguridad
    const [productoEliminar, setProductoEliminar] = useState(null);
    const [mostrarPopup, setMostrarPopup] = useState(false);
    const [filtroNombre, setFiltroNombre] = useState('');
    const [precioMin, setPrecioMin] = useState('');
    const [precioMax, setPrecioMax] = useState('');
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [fechaFiltro, setFechaFiltro] = useState('');

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/products`, { withCredentials: true });
                if (response.data.status === 'success') {
                    setProductos(response.data.data);
                    setProductosFiltrados(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProductos();
    }, []);

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
        let maxPrecio = precioMax === '' ? Math.max(...productos.map(p => parseFloat(p.start_price))) : parseFloat(precioMax);

        const productosFiltrados = productos.filter(producto => {
            const coincideNombre = producto.name.toLowerCase().includes(filtroNombre.toLowerCase());
            const coincidePrecio = parseFloat(producto.start_price) >= minPrecio && parseFloat(producto.start_price) <= maxPrecio;
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
                                {/* Cambiar no-img.jpg por {producto.image_url} cuando esté listo el manejo de imagenes en S3*/}
                                <img src="no-img.jpg" alt={producto.name} className="catalogo-imagen-producto" />
                                <div className="catalogo-info">
                                    <h3>{producto.name}</h3>
                                    <p><span>Precio Actual: ${producto.start_price}</span></p>
                                    <p><span>Termina:</span> {new Date(producto.end_date).toLocaleDateString()}</p>
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
