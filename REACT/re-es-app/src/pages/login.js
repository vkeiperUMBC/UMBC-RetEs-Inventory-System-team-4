import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';

export function Login() {
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
                sx={{ marginBottom: 2 }}
            />
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                sx={{ marginBottom: 3 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Forgot your password?
                </Typography>
                <Link to="/inventory" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" color="primary">
                        Log In
                    </Button>
                </Link>
            </Box>
            <Link to="/inventoryAdmin" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" color="primary" fullWidth>
                    Admin Login
                </Button>
            </Link>
        </Box>
    );
}

export default Login;