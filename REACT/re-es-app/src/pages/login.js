import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Link, useNavigate } from 'react-router-dom';

export function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const loginClick = async () => {
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                if (data.role === 'admin') {
                    navigate('/inventoryAdmin'); // Navigate to admin inventory
                } else if (data.role === 'user') {
                    navigate('/inventory'); // Navigate to regular inventory
                }
            } else {
                const errorData = await response.json();
                setErrorMessage(errorData.error || 'Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('An error occurred during login');
        }
    };

    return (
        <Box
            sx={{
                width: 400,
                margin: 'auto',
                marginTop: 8,
                padding: 4,
                borderRadius: 2,
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                bgcolor: 'background.paper',
                textAlign: 'center',
            }}
        >
            <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold', color: 'primary.main' }}>
                Welcome to Retriever Essentials
            </Typography>
            <TextField
                label="Username/ID"
                variant="outlined"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{ marginBottom: 2 }}
            />
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ marginBottom: 3 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Forgot your password?
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={loginClick}
                >
                    Log In
                </Button>
            </Box>
            {errorMessage && <Typography variant="body2" sx={{ color: 'red' }}>{errorMessage}</Typography>}
            <Link to="/inventoryAdmin" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" color="primary" fullWidth>
                    Admin Login
                </Button>
            </Link>
            <Link to="/inventory" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" color="primary" fullWidth>
                    Stud Login
                </Button>
            </Link>
            <Link to="/sqltest" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" color="primary" fullWidth>
                    Testing
                </Button>
            </Link>
        </Box>
    );
}

export default Login;