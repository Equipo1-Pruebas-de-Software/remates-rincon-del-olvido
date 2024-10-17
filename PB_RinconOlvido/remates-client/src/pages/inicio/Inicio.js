import { useNavigate } from 'react-router-dom';

const Inicio = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/login');
    };

    return (
        <div className="inicio">
            <div className="inicio-contenido">
                <h1>Bienvenido a Remates</h1>
                <p>La mejor plataforma para comprar y vender productos de colección.</p>
                <button className="boton-inicio" onClick={handleButtonClick}>Explorar catálogo</button>
            </div>
        </div>
    );
};

export default Inicio;