import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './styles/home.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [productToUpdate, setProductToUpdate] = useState(null);
    const [showProductList, setShowProductList] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Authentication required');
                return;
            }

            try {
                const response = await axios.get('http://localhost:5000/products', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProducts(response.data);
            } catch (err) {
                setError('Failed to fetch products');
                console.error(err);
            }
        };

        fetchProducts();
    }, [localStorage.getItem('token')]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication required');
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            const productData = { name, description, price: Number(price) };
            let response;

            if (productToUpdate) {
                response = await axios.put(`http://localhost:5000/products/${productToUpdate._id}`, productData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProducts(products.map((product) => (product._id === productToUpdate._id ? response.data : product)));
                setSuccess('Product updated successfully');
            } else {
                response = await axios.post('http://localhost:5000/products', productData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProducts([...products, response.data]);
                setSuccess('Product added successfully');
            }

            setName('');
            setDescription('');
            setPrice('');
            setProductToUpdate(null);
            setError('');
        } catch (err) {
            setError('Error submitting product');
            console.error(err.response ? err.response.data : err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (productId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication required');
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            await axios.delete(`http://localhost:5000/products/${productId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProducts(products.filter((product) => product._id !== productId));
            setSuccess('Product deleted successfully');
            setError('');
        } catch (err) {
            setError('Error deleting product');
            console.error(err.response ? err.response.data : err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setProducts([]);
        setName('');
        setDescription('');
        setPrice('');
        setProductToUpdate(null);
        setError('');
        setSuccess('');
        navigate('/login');
        window.location.reload();
    };

    return (
        <div className="home-container">
            <h2 className="home-title">Product Management</h2>

            {error && <p className="message error-message">{error}</p>}
            {success && <p className="message success-message">{success}</p>}
            {loading && <p className="loading-message">Loading...</p>}

            <div className="header-actions">
                <button className="logout-button" onClick={handleLogout}>Logout</button>

                <form className="product-form" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Product Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    <input
                        type="number"
                        className="form-input"
                        placeholder="Price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                    />
                    <button type="submit" className="submit-button">
                        {productToUpdate ? 'Update Product' : 'Add Product'}
                    </button>
                </form>

                <button className="toggle-button" onClick={() => setShowProductList(!showProductList)}>
                    {showProductList ? 'Hide Product List' : 'Show Product List'}
                </button>
            </div>

            {showProductList && (
                <div className="product-list-container">
                    <h3 className="product-list-title">Product List</h3>
                    <ul className="product-list">
                        {products.map((product) => (
                            <li key={product._id} className="product-item">
                                <strong>{product.name}</strong> - {product.description} - ${product.price}
                                <button className="update-button" onClick={() => {
                                    setProductToUpdate(product);
                                    setName(product.name);
                                    setDescription(product.description);
                                    setPrice(product.price);
                                }}>Update</button>
                                <button className="delete-button" onClick={() => handleDeleteProduct(product._id)}>Delete</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Home;
