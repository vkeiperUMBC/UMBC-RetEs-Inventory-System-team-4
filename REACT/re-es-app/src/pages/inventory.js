import React, { useState } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Box, AppBar, Toolbar, Typography, Switch, FormControlLabel } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';

export function Inventory() {
    const navigate = useNavigate();

    const createData = (name, stock, maxWithdraw, stockWeight, maxWithdrawWeight) => {
        return { name, stock, maxWithdraw, userInput: '', stockWeight, maxWithdrawWeight, userWeight: '' };
    };

    const [rows, setRows] = useState([
        createData('Beans', 10, 5, 50, 25),
        createData('Rice', 5, 2, 20, 10),
        createData('Ramen', 20, 10, 40, 20),
    ]);

    const [isWeightMode, setIsWeightMode] = useState(false);

    const handleInputChange = (index, value) => {
        const newRows = [...rows];
        if (isWeightMode) {
            newRows[index].userWeight = value;
        } else {
            newRows[index].userInput = value;
        }
        setRows(newRows);
    };

    const handleCheckout = () => {
        const overMax = rows.some(row => 
            isWeightMode ? row.userWeight > row.maxWithdrawWeight : row.userInput > row.maxWithdraw
        );
        if (overMax) {
            alert('One or more quantities entered exceed the maximum allowed.');
        } else {
            const orderSummary = rows
                .filter(row => (isWeightMode ? row.userWeight > 0 : row.userInput > 0))
                .map(row => `${row.name}: ${isWeightMode ? `${row.userWeight} lbs` : `${row.userInput}`}`)
                .join('\n');

            const confirmOrder = window.confirm(`You are ordering:\n${orderSummary}\n\nDo you want to proceed?`);
            if (confirmOrder) {
                const newRows = rows.map(row => ({
                    ...row,
                    stock: isWeightMode ? row.stock : row.stock - row.userInput,
                    stockWeight: isWeightMode ? row.stockWeight - row.userWeight : row.stockWeight,
                    userInput: '',
                    userWeight: ''
                }));
                setRows(newRows);
                alert('Checkout successful!');
            }
        }
    };

    const handleLogout = () => {
        navigate('/');
    };

    const toggleMode = () => {
        setIsWeightMode(!isWeightMode);
    };

    return (
        <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Logged in as: User123
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ width: '100%', maxWidth: 800, marginTop: 4 }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">{isWeightMode ? 'Stock (lbs)' : 'Stock (Quantity)'}</TableCell>
                                <TableCell align="right">{isWeightMode ? 'Max Request (lbs)' : 'Max Request (Quantity)'}</TableCell>
                                <TableCell align="right">{isWeightMode ? 'Requested Weight (lbs)' : 'Requested Amount'}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{isWeightMode ? row.stockWeight : row.stock}</TableCell>
                                    <TableCell align="right">{isWeightMode ? row.maxWithdrawWeight : row.maxWithdraw}</TableCell>
                                    <TableCell align="right">
                                        <TextField
                                            type="number"
                                            value={isWeightMode ? row.userWeight : row.userInput}
                                            onChange={(e) => handleInputChange(index, e.target.value)}
                                            inputProps={{ min: 0, max: isWeightMode ? row.maxWithdrawWeight : row.maxWithdraw }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: 'primary.main',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            color: 'white',
                        }}
                    >
                        <Typography variant="body2" sx={{ marginRight: 1, color: 'black' }}>
                            Quantity
                        </Typography>
                        <Switch
                            checked={isWeightMode}
                            onChange={toggleMode}
                            color="default"
                        />
                        <Typography variant="body2" sx={{ marginLeft: 1, color: 'black' }}>
                            Weight
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCheckout}
                        startIcon={<ShoppingCartIcon />}
                    >
                        Checkout
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Inventory;