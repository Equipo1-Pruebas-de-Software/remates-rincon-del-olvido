import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './login.css';
import { BASE_URL } from '../../services/constants';
import { toast } from 'react-hot-toast';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log(`${BASE_URL}login`);
            await axios.post(`${BASE_URL}/login/user`, formData, { withCredentials: true });
            window.location.href = '/catalogo';
        } catch (error) {
            console.log(error);
            toast.error('Credenciales incorrectas');
        }
    };

    return (
        <div>
            <h1 className="login-titulo">El Rincón del Olvido</h1>
            <div className="login-container">
                <div className="login-card">
                    <h2>Iniciar Sesión</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="email" name="email" placeholder="Correo Electrónico" onChange={handleInputChange} />
                        <input type="password" name="password" placeholder="Contraseña" onChange={handleInputChange} />
                        <button type="submit">Iniciar Sesión</button>
                    </form>
                </div>
                
                <div className="register-card">
                    <h2>¿Eres nuevo en el sitio?</h2>
                    <p>¡Descubre el mejor sitio de subastas!</p>
                    <Link to="/register">
                        <button>Crear Cuenta</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
