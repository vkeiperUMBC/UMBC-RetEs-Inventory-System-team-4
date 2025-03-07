import React, { useState } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Box, AppBar, Toolbar, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export function Inventory() {
    const createData = (name, stock, maxWithdraw) => {
        return { name, stock, maxWithdraw, userInput: '' };
    };

    const [rows, setRows] = useState([
        createData('Beans', 10, 5),
        createData('Rice', 5, 2),
        createData('Ramen', 20, 10),
    ]);

    const handleInputChange = (index, value) => {
        const newRows = [...rows];
        newRows[index].userInput = value;
        setRows(newRows);
    };

    const handleCheckout = () => {
        const overMax = rows.some(row => row.userInput > row.maxWithdraw);
        if (overMax) {
            alert('One or more quantities entered exceed the maximum allowed.');
        } else {
            const orderSummary = rows
                .filter(row => row.userInput > 0)
                .map(row => `${row.name}: ${row.userInput}`)
                .join('\n');

            const confirmOrder = window.confirm(`You are ordering:\n${orderSummary}\n\nDo you want to proceed?`);
            if (confirmOrder) {
                const newRows = rows.map(row => ({
                    ...row,
                    stock: row.stock - row.userInput,
                    userInput: ''
                }));
                setRows(newRows);
                alert('Checkout successful!');
            }
        }
    };

    return (
        <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6">
                        Logged in as: User123
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box sx={{ width: '100%', maxWidth: 800, marginTop: 4 }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Stock</TableCell>
                                <TableCell align="right">Max Withdraw</TableCell>
                                <TableCell align="right">Requested Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow key={row.name}>
                                    <TableCell component="th" scope="row">
                                        {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.stock}</TableCell>
                                    <TableCell align="right">{row.maxWithdraw}</TableCell>
                                    <TableCell align="right">
                                        <TextField
                                            type="number"
                                            value={row.userInput}
                                            onChange={(e) => handleInputChange(index, e.target.value)}
                                            inputProps={{ min: 0, max: row.maxWithdraw }}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
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