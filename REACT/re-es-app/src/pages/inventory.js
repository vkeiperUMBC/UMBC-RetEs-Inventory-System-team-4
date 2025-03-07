import React, { useState } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button } from '@mui/material';

export function Inventory() {
    const createData = (name, stock, maxWithdraw) => {
        return { name, stock, maxWithdraw, userInput: '' };
    };

    const [rows, setRows] = useState([
        createData('Item 1', 10, 5),
        createData('Item 2', 5, 2),
        createData('Item 3', 20, 10),
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
            alert('Checkout successful!');
        }
    };

    return (
        <Container style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Stock</TableCell>
                            <TableCell align="right">Max Withdraw</TableCell>
                            <TableCell align="right">User Input</TableCell>
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
            <Button variant="contained" color="primary" onClick={handleCheckout} style={{ marginTop: '20px' }}>
                Checkout
            </Button>
        </Container>
    );
};

export default Inventory;