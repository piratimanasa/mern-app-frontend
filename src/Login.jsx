import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/login.css';

const Login = ({ setToken }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setEmail('');
        setPassword('');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            setToken(response.data.token);
            navigate('/home');
        } catch (err) {
            setError('Login failed. Please try again.');
            console.error('Login error:', err);
        }
    };

    const handleNavigateToRegister = () => {
        navigate('/register');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="off"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="off"
                    />
                    <button type="submit">Login</button>
                </form>
                <p>Don't have an account?</p>
                <button className="register-button" onClick={handleNavigateToRegister}>
                    Register
                </button>
            </div>
        </div>
    );
};

export default Login;
