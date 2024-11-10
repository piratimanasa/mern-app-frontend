import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/register.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setUsername('');
        setPassword('');
        setEmail('');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await axios.post('http://localhost:5000/auth/register', {
                username,
                password,
                email,
            });

            setSuccess('Registration successful! Redirecting to login...');
            setUsername('');
            setPassword('');
            setEmail('');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                const errorMessage = err.response.data.error;
                setError(errorMessage.includes('User already exists')
                    ? 'This email is already registered. Please try another one.'
                    : errorMessage);
            } else {
                setError('Registration failed. Please try again.');
            }
            console.error('Registration error: ', err);
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Register</h2>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        autoComplete="off"
                    />
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
                    <button type="submit">Register</button>
                </form>
                <button className="redirect-button" onClick={handleLoginRedirect}>
                    Already have an account? Login
                </button>
            </div>
        </div>
    );
};

export default Register;
