import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './loginAdmin.css';
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
            console.log(`${BASE_URL}admin`);
            await axios.post(`${BASE_URL}/login/admin`, formData, { withCredentials: true });
            window.location.href = '/catalogo';
        } catch (error) {
            console.log(error);
            toast.error('Credenciales incorrectas');
        }
    };

    return (
        <div>
            <h1 className="login-titulo-admin">El Rincón del Olvido</h1>
            <div className="login-container-admin">
                <div className="login-card-admin">
                    <h2>Ingresar como Administrador</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="email" name="email" placeholder="Correo Electrónico" onChange={handleInputChange} />
                        <input type="password" name="password" placeholder="Contraseña" onChange={handleInputChange} />
                        <button className="loginto-button-admin" type="submit">Iniciar Sesión</button>

                        <Link to="/" className="admin-log-admin">Ingresar como cliente</Link>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
