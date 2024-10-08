import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './login.css';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/login', formData);
            localStorage.setItem('token', res.data.token);
            alert('Login exitoso');
        } catch (error) {
            alert('Error al iniciar sesión');
        }
    };

    return (
        <div>
            <h1 className="login-titulo">El Rincón del Olvido</h1>
            <div className="login-container">
                <div className="login-card">
                    <h2>Iniciar Sesión</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="username" placeholder="Usuario" onChange={handleInputChange} />
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
