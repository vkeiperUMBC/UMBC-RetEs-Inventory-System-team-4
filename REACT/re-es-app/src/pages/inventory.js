import React, { useState, useEffect } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Box, AppBar, Toolbar, Typography, Switch } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';

const fetchData = async (setRows, createData) => {
    try {
        const response = await fetch('http://localhost:5000/api/inventory', {
            method: 'GET'
        });

        if (response.ok) {
            const data = await response.json();
            const formattedData = data.map(item =>
                createData(item.name, item.stock, item.maxWithdraw, item.stockWeight, item.maxWithdrawWeight)
            );
            setRows(formattedData);
        } else {
            console.error('Failed to fetch inventory data');
        }
    } catch (error) {
        console.error('Error fetching inventory data:', error);
    }
};

const sendCheckoutData = async (checkoutItems) => {
    try {
        const response = await fetch('http://localhost:5000/api/checkout', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(checkoutItems), // Send the checkout data as JSON
        });

        if (response.ok) {
            console.log('Checkout data sent successfully');
        } else {
            console.error('Failed to send checkout data');
        }
    } catch (error) {
        console.error('Error sending checkout data:', error);
    }
};

export function Inventory() {
    const navigate = useNavigate();

    const createData = (name, stock, maxWithdraw, stockWeight, maxWithdrawWeight) => {
        return { name, stock, maxWithdraw, userInput: '', stockWeight, maxWithdrawWeight, userWeight: '' };
    };

    const [rows, setRows] = useState([]);
    const [isWeightMode, setIsWeightMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchData(setRows, createData); // Fetch data on initial load
    }, []); // Empty dependency array ensures this runs only once when the component is mounted

    const handleInputChange = (index, value) => {
        const rowIndex = rows.findIndex(row => row.name === filteredRows[index].name);
        const newRows = [...rows];

        if (isWeightMode) {
            newRows[rowIndex].userWeight = value;
        } else {
            newRows[rowIndex].userInput = value;
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
            const checkoutItems = rows
                .filter(row => (isWeightMode ? row.userWeight > 0 : row.userInput > 0))
                .map(row => ({
                    name: row.name,
                    stock: isWeightMode ? row.userWeight : row.userInput,
                }));

            const orderSummary = checkoutItems
                .map(item => `${item.name}: ${item.stock}`)
                .join('\n');

            const confirmOrder = window.confirm(`You are ordering:\n${orderSummary}\n\nDo you want to proceed?`);
            if (confirmOrder) {
                // Send checkout data to the backend
                sendCheckoutData(checkoutItems).then(() => {
                    alert('Checkout successful!');
                    // Refresh the inventory after a successful checkout
                    fetchData(setRows, createData);
                });
            }
        }
    };

    const handleLogout = () => {
        navigate('/');
    };

    const toggleMode = () => {
        setIsWeightMode(!isWeightMode);
    };

    const filteredRows = rows.filter(row =>
        row.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                    <TextField
                        label="Search"
                        variant="outlined"
                        fullWidth
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Box>
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
                            {filteredRows.map((row, index) => (
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
}

export default Inventory;