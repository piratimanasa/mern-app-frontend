import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'; // Use Navigate instead of Redirect
import Register from './Register';
import Login from './Login';
import Home from './Home';
import Navbar from './Navbar';  // Import Navbar component

const App = () => {
    const [token, setToken] = useState('');

    return (
        <Router>
            {/* Navbar component visible on all pages */}
            {/* <Navbar /> */}

            <Routes>
                {/* Route for Register page */}
                <Route path="/register" element={<Register />} />

                {/* Route for Login page */}
                <Route path="/login" element={<Login setToken={setToken} />} />

                {/* Route for Home page with Product Management */}
                <Route 
                    path="/home" 
                    element={token ? <Home token={token} /> : <Navigate to="/login" />} 
                />

                {/* Redirect to Login page if no route matches */}
                <Route path="/" element={<Navigate to="/register" />} />
            </Routes>
        </Router>
    );
};

export default App;
