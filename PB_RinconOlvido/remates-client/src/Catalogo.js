import { useState } from 'react';
import './catalogo.css';
import { Link } from 'react-router-dom';
import AgregarProducto from './agregarProducto';

const Catalogo = () => {
    const productos = [
        { id: 1, nombre: 'Producto 1', precio: 1000, fecha_termino: '2024-10-07', rareza: 'comun', imagen: 'https://via.placeholder.com/150' },
        { id: 2, nombre: 'Producto 2', precio: 100, fecha_termino: '2024-10-08', rareza: 'raro', imagen: 'https://via.placeholder.com/150' },
        { id: 3, nombre: 'Producto 3', precio: 50, fecha_termino: '2024-10-09', rareza: 'poco comun', imagen: 'https://via.placeholder.com/150' },
        { id: 4, nombre: 'Producto 4', precio: 500, fecha_termino: '2024-10-07', rareza: 'extravagante', imagen: 'https://via.placeholder.com/150' },
    ];

    //Por aqui lo que tiene que ver con admin
    const [isAdmin] = useState(true); // esto simula que el usuario es admin, se debe implementar esta logica en backend por seguridad
    const [productoEliminar, setProductoEliminar] = useState(null);

    const confirmarEliminacion = () => {
        setProductosFiltrados(productosFiltrados.filter(p => p.id !== productoEliminar.id));
        setProductoEliminar(null); // Cierra el popup
    };

    //Para mostrar popup de agregar producto
    const [mostrarPopup, setMostrarPopup] = useState(false);

    const abrirPopup = () => {
        setMostrarPopup(true);
    };

    const cerrarPopup = () => {
        setMostrarPopup(false);
    };
    
    //Fin de cosas de admin

    const [filtroNombre, setFiltroNombre] = useState('');

    const [precioMin, setPrecioMin] = useState('');
    const [precioMax, setPrecioMax] = useState('');
    const [productosFiltrados, setProductosFiltrados] = useState(productos);

    const [fechaFiltro, setFechaFiltro] = useState('');

    const [rarezaFiltro, setRarezaFiltro] = useState('');

    const aplicarFiltro = () => {
        let minPrecio = precioMin === '' ? 0 : parseFloat(precioMin);
        let maxPrecio = precioMax === '' ? Math.max(...productos.map(p => p.precio)) : parseFloat(precioMax);
    
        const productosFiltrados = productos.filter(producto => {
            const coincideNombre = producto.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
            const coincidePrecio = producto.precio >= minPrecio && producto.precio <= maxPrecio;
            const coincideFecha = !fechaFiltro || producto.fecha_termino === fechaFiltro;
            const coincideRareza = !rarezaFiltro || producto.rareza === rarezaFiltro;
    
            return coincideNombre && coincidePrecio && coincideFecha && coincideRareza;
        });
    
        setProductosFiltrados(productosFiltrados);
    };

    return (
        <div>
            <div class="catalogo-container">
                <div class="catalogo-sidebar">
                    <div className="barra-lateral">
                        <h2>Filtrar productos</h2>
                        <div className="filtro">
                            <h3>Nombre</h3>
                            {/* Buscador por nombre */}
                            <input
                                type="text"
                                placeholder="Buscar por nombre"
                                value={filtroNombre}
                                onChange={(e) => setFiltroNombre(e.target.value)}
                            />
                        </div>
                        <div className="filtro">
                        {/* Filtro por precio */}
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
                        <h3>Rareza</h3>
                        {/* Filtro por rareza */}
                        <select value={rarezaFiltro} onChange={(e) => setRarezaFiltro(e.target.value)}>
                            <option value="">Todas</option>
                            <option value="comun">Común</option>
                            <option value="poco comun">Poco común</option>
                            <option value="raro">Raro</option>
                            <option value="extravagante">Extravagante</option>
                        </select>
                        </div>
                        <div className="filtro">
                        {/* Filtro por fecha de termino */}
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
            
            {/* Catalogo principal */}

                <div className="catalogo">
                    {productosFiltrados.map(producto => (
                        <Link key={producto.id} to={`/producto/${producto.id}`} className="card-link">
                            <div className="catalogo-card">
                                <img src={producto.imagen} alt={producto.nombre} className="catalogo-imagen-producto" />
                                <div className="catalogo-info">
                                    <h3>{producto.nombre}</h3>
                                    <p><span>Precio Actual: ${producto.precio}</span></p>
                                    <p><span>Termina:</span> {new Date(producto.fecha_termino).toLocaleDateString()}</p>
                                    <p><span>Rareza:</span> {producto.rareza}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            {/* Popup de agregar producto */}
            {mostrarPopup && <AgregarProducto onClose={cerrarPopup} />}
            </div>
            {/* Popup de eliminacion */}
            {productoEliminar && (
                <div className="popup-eliminar">
                    <div className="popup-contenido">
                        <h2>¿Seguro que quieres eliminar este producto?</h2>
                        <p>{productoEliminar.nombre}</p>
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
