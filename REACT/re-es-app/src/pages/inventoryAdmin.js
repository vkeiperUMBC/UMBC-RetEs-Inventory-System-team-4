import React, { useState, useRef } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Box, AppBar, Toolbar, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function InventoryAdmin() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const createData = (name, stock, maxWithdraw, numberSold, servingWeight, minPurchaseQuantity, maxWithdrawWeight, unitPrice) => {
        return { name, stock, maxWithdraw, userInput: '', numberSold, servingWeight, minPurchaseQuantity, maxWithdrawWeight, unitPrice };
    };

    const [rows, setRows] = useState([
        createData('Beans', 10, 5, 100, 0.5, 1, 2.5, 1.99),
        createData('Rice', 5, 2, 50, 1, 1, 2, 0.99),
        createData('Ramen', 20, 10, 200, 0.2, 1, 2, 0.49),
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

    const handleLogout = () => {
        navigate('/');
    };

    const handleUploadStock = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            alert(`File ${file.name} selected for upload.`);
            // Implement file upload logic here
        }
    };

    const handleSwitchToAnalytics = () => {
        navigate('/analytics');
    };

    return (
        <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Logged in as: Admin
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ width: '100%', maxWidth: 1200, marginTop: 4 }}>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Stock</TableCell>
                                <TableCell align="right">Max Withdraw</TableCell>
                                <TableCell align="right">Number Sold</TableCell>
                                <TableCell align="right">Serving Weight</TableCell>
                                <TableCell align="right">Min Purchase Quantity</TableCell>
                                <TableCell align="right">Max Withdraw Weight</TableCell>
                                <TableCell align="right">Unit Price</TableCell>
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
                                    <TableCell align="right">{row.numberSold}</TableCell>
                                    <TableCell align="right">{row.servingWeight}</TableCell>
                                    <TableCell align="right">{row.minPurchaseQuantity}</TableCell>
                                    <TableCell align="right">{row.maxWithdrawWeight}</TableCell>
                                    <TableCell align="right">{row.unitPrice}</TableCell>
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleUploadStock}
                    >
                        Upload Current Stock
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSwitchToAnalytics}
                    >
                        Switch to Analytics
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCheckout}
                    >
                        Checkout
                    </Button>
                </Box>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />
            </Box>
        </Container>
    );
};

export default InventoryAdmin;