import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../../services/constants';
import { toast } from 'react-hot-toast';
import './register.css';

const Register = () => {
    var desc1 = "¡Bienvenido a El Rincón del Olvido! Aquí puedes encontrar los objetos coleccionables más raros.";
    var desc2 = "¡Te garantizamos una experiencia de remate sencilla y rápida! No te preocupes, tu identidad esta a salvo con nosotros 😉";
    const [formData, setFormData] = useState({ email: '', password: ''});

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Aqui debe ir la logica del register
        try {
            console.log(`${BASE_URL}/register`);
            await axios.post(`${BASE_URL}/register/user`, formData, { withCredentials: true });
            setFormData({ email: '', password: '' });
            //window.location.href = '/';
        } catch (error) {
            console.log(error);
            toast.error('Error con el registro');
        }
    };

    return (
        <div>
            <h1 className="register-titulo">El Rincón del Olvido</h1>
            <div className="register-container">
                <div className="register-form">
                    <h2>Registro</h2>
                    <form onSubmit={handleSubmit}>
                        {/*<input type="text" name="username" placeholder="Nombre de Usuario" onChange={handleInputChange} required />*/}
                        <input type="email" name="email" placeholder="Correo Electrónico" onChange={handleInputChange} required />
                        <input type="password" name="password" placeholder="Contraseña" onChange={handleInputChange} required />
                        {/*<label htmlFor="photo">Subir foto (opcional):</label>
                        <input type="file" name="photo" onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })} />*/}
                        <button type="submit">Registrarse</button>
                    </form>
                </div>

                <div className="register-info-container">
                    <h2>Información</h2>
                    <p>{desc1}</p>
                    <p>{desc2}</p>
                    <Link to="/">
                        <button>Ya tengo una cuenta</button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
