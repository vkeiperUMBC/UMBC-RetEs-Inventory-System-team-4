import React, { useState, useEffect } from 'react';
import {
    Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Box,
    AppBar, Toolbar, Typography, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const fetchData = async (setRows, createData) => {
    try {
        const response = await fetch('http://localhost:5000/api/inventory', {
            method: 'GET',
        });

        if (response.ok) {
            const data = await response.json();
            const formattedData = data.map(item =>
                // name, stock, num_sold, serving_weight, serving_amount, max weight, max amount
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

export function InventoryAdmin() {
    const navigate = useNavigate();

    const createData = (name, stock, maxWithdraw, stockWeight, maxWithdrawWeight) => {
        return { name, stock, maxWithdraw, stockWeight, maxWithdrawWeight };
    };

    const [rows, setRows] = useState([]);
    const [initialRows, setInitialRows] = useState([]); // Baseline state for comparison
    const [modifiedFields, setModifiedFields] = useState({}); // Tracks modified fields
    const [newlyAddedRows, setNewlyAddedRows] = useState([]); // Tracks newly added rows
    const [filters, setFilters] = useState({ searchQuery: '' });
    const [openDialog, setOpenDialog] = useState(false);
    const [newItem, setNewItem] = useState({
        name: '',
        stock: '',
        maxWithdraw: '',
        stockWeight: '',
        maxWithdrawWeight: '',
    });

    // Fetch inventory data on component load
    useEffect(() => {
        fetchData(setRows, createData);
    }, []);

    const handleInputChange = (index, field, value) => {
        const newRows = [...rows];
        const newValue = parseFloat(value) || 0;

        // Update the specific field
        newRows[index][field] = newValue;

        // Track the modified field based on comparison with initialRows
        setModifiedFields((prev) => ({
            ...prev,
            [`${index}-${field}`]: newValue > initialRows[index][field] ? 'increased' : newValue < initialRows[index][field] ? 'decreased' : 'unchanged',
        }));

        setRows(newRows);
    };

    const getCellStyle = (index, field) => {
        const key = `${index}-${field}`;
        if (modifiedFields[key] === 'increased') {
            return { backgroundColor: 'lightgreen' };
        } else if (modifiedFields[key] === 'decreased') {
            return { backgroundColor: 'lightcoral' };
        }
        return {};
    };

    const getRowStyle = (index) => {
        if (newlyAddedRows.includes(index)) {
            return { backgroundColor: 'lightgreen' };
        }
        return {};
    };

    const handleAddItem = async () => {
        const newItemData = {
            name: newItem.name,
            stock: parseInt(newItem.stock, 10),
            maxWithdraw: parseInt(newItem.maxWithdraw, 10),
            servingWeight: parseFloat(newItem.servingWeight),
            servingAmount: parseInt(newItem.servingAmount, 10),
            maxWithdrawWeight: parseFloat(newItem.maxWithdrawWeight),
        };

        try {
            const response = await fetch('http://localhost:5000/api/addItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newItemData),
            });

            if (response.ok) {
                alert('Item added successfully!');
                // Refresh the inventory after adding the item
                fetchData(setRows, createData);
            } else {
                console.error('Failed to add item');
                alert('Failed to add item');
            }
        } catch (error) {
            console.error('Error adding item:', error);
            alert('An error occurred while adding the item');
        }

        // Reset the dialog and new item state
        setNewItem({ name: '', stock: '', maxWithdraw: '', servingWeight: '', servingAmount: '', maxWithdrawWeight: '' });
        setOpenDialog(false);
    };

    const handleRemoveItem = async (itemName) => {
        try {
            const response = await fetch('http://localhost:5000/api/removeItem', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: itemName }),
            });

            if (response.ok) {
                alert(`Item "${itemName}" removed successfully!`);
                // Refresh the inventory after removing the item
                fetchData(setRows, createData);
            } else {
                console.error('Failed to remove item');
                alert('Failed to remove item');
            }
        } catch (error) {
            console.error('Error removing item:', error);
            alert('An error occurred while removing the item');
        }
    };

    const handleLogout = () => {
        navigate('/');
    };

    const handleCommitChanges = () => {
        const confirmCommit = window.confirm('Are you sure you want to commit all changes?');
        if (confirmCommit) {
            setInitialRows([...rows]); // Update the baseline state
            setModifiedFields({}); // Clear all modified fields
            setNewlyAddedRows([]); // Clear all newly added rows
            alert('Changes committed successfully!');
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            alert('No file selected');
            return;
        }

        // Rename the file to "excel"
        const renamedFile = new File([file], "excel.xlsx", { type: file.type });

        const formData = new FormData();
        formData.append('file', renamedFile);

        try {
            const response = await fetch('http://localhost:5000/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert('File uploaded successfully!');
                // Optionally, refresh the inventory after upload
                fetchData(setRows, createData);
            } else {
                console.error('Failed to upload file');
                alert('Failed to upload file');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('An error occurred while uploading the file');
        }
    };

    const filteredRows = rows.filter(row =>
        row.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
    );

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
            <Box sx={{ width: '100%', maxWidth: 800, marginTop: 4 }}>
                <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                    <TextField
                        label="Search"
                        variant="outlined"
                        fullWidth
                        value={filters.searchQuery}
                        onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                    />
                </Box>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Stock (Quantity)</TableCell>
                                <TableCell align="right">Max Request (Quantity)</TableCell>
                                <TableCell align="right">Stock (Weight)</TableCell>
                                <TableCell align="right">Max Request (Weight)</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRows.map((row, index) => (
                                <TableRow key={row.name} style={getRowStyle(index)}>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell align="right" style={getCellStyle(index, 'stock')}>
                                        <TextField
                                            type="number"
                                            value={row.stock}
                                            onChange={(e) => handleInputChange(index, 'stock', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell align="right" style={getCellStyle(index, 'maxWithdraw')}>
                                        <TextField
                                            type="number"
                                            value={row.maxWithdraw}
                                            onChange={(e) => handleInputChange(index, 'maxWithdraw', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.stockWeight} {/* Display-only field */}
                                    </TableCell>
                                    <TableCell align="right" style={getCellStyle(index, 'maxWithdrawWeight')}>
                                        <TextField
                                            type="number"
                                            value={row.maxWithdrawWeight}
                                            onChange={(e) => handleInputChange(index, 'maxWithdrawWeight', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            color="black"
                                            onClick={() => {
                                                const confirmDelete = window.confirm(`Are you sure you want to remove "${row.name}" from the inventory?`);
                                                if (confirmDelete) {
                                                    handleRemoveItem(row.name);
                                                }
                                            }}
                                        >
                                            Remove
                                        </Button>
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
                        onClick={() => setOpenDialog(true)}
                    >
                        Add New Item
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCommitChanges}
                    >
                        Commit Changes
                    </Button>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', marginTop: 2 }}>
                    <Button
                        variant="contained"
                        component="label"
                        color='primary'
                    >
                        Upload Excel
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            hidden
                            onChange={(e) => handleFileUpload(e)}
                        />
                    </Button>
                </Box>
            </Box>

            {/* Dialog for Adding New Item */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Add New Item</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Name"
                        fullWidth
                        margin="dense"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    />
                    <TextField
                        label="Stock"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={newItem.stock}
                        onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                    />
                    <TextField
                        label="Max Withdraw"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={newItem.maxWithdraw}
                        onChange={(e) => setNewItem({ ...newItem, maxWithdraw: e.target.value })}
                    />
                    <TextField
                        label="Weight per Serving"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={newItem.servingWeight}
                        onChange={(e) => setNewItem({ ...newItem, servingWeight: e.target.value })}
                    />
                    <TextField
                        label="Serving Per Stock"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={newItem.servingAmount}
                        onChange={(e) => setNewItem({ ...newItem, servingAmount: e.target.value })}
                    />
                    <TextField
                        label="Max Withdraw Weight"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={newItem.maxWithdrawWeight}
                        onChange={(e) => setNewItem({ ...newItem, maxWithdrawWeight: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddItem} variant="contained" color="primary">
                        Add
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default InventoryAdmin;