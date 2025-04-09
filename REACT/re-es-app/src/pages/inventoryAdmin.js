import React, { useState } from 'react';
import {
    Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Box,
    AppBar, Toolbar, Typography, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function InventoryAdmin() {
    const navigate = useNavigate();

    const createData = (name, stock, maxWithdraw, stockWeight, maxWithdrawWeight, category) => {
        return { name, stock, maxWithdraw, stockWeight, maxWithdrawWeight, category };
    };

    const [rows, setRows] = useState([
        createData('Beans', 10, 5, 50, 25, 'Legumes'),
        createData('Rice', 5, 2, 20, 10, 'Grains'),
        createData('Ramen', 20, 10, 40, 20, 'Packaged Food'),
        createData('Soap', 15, 5, 0, 0, 'Hygiene'),
        createData('Shampoo', 8, 3, 0, 0, 'Hygiene'),
        createData('Lentils', 12, 6, 30, 15, 'Legumes'),
        createData('Pasta', 25, 12, 50, 25, 'Grains'),
        createData('Oats', 18, 9, 40, 20, 'Grains'),
        createData('Canned Tuna', 30, 15, 60, 30, 'Packaged Food'),
        createData('Cereal', 20, 10, 50, 25, 'Packaged Food'),
    ]);

    const [initialRows, setInitialRows] = useState([...rows]); // Baseline state for comparison
    const [modifiedFields, setModifiedFields] = useState({}); // Tracks modified fields
    const [newlyAddedRows, setNewlyAddedRows] = useState([]); // Tracks newly added rows

    const [filters, setFilters] = useState({ searchQuery: '', selectedCategory: '' });

    const [openDialog, setOpenDialog] = useState(false);

    const [newItem, setNewItem] = useState({
        name: '',
        stock: '',
        maxWithdraw: '',
        stockWeight: '',
        maxWithdrawWeight: '',
        category: '',
    });

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

    const handleAddItem = () => {
        setRows([...rows, createData(
            newItem.name,
            parseInt(newItem.stock, 10),
            parseInt(newItem.maxWithdraw, 10),
            parseFloat(newItem.stockWeight),
            parseFloat(newItem.maxWithdrawWeight),
            newItem.category
        )]);
        setNewlyAddedRows([...newlyAddedRows, rows.length]); // Add the index of the new row
        setNewItem({ name: '', stock: '', maxWithdraw: '', stockWeight: '', maxWithdrawWeight: '', category: '' });
        setOpenDialog(false);
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

    const filteredRows = rows.filter(row =>
        row.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
        (filters.selectedCategory === '' || row.category === filters.selectedCategory)
    );

    const uniqueCategories = [...new Set(rows.map(row => row.category))];

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
                        value={filters.searchQuery}
                        onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                    />
                    <FormControl variant="outlined" sx={{ minWidth: 150 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={filters.selectedCategory}
                            onChange={(e) => setFilters({ ...filters, selectedCategory: e.target.value })}
                            label="Category"
                        >
                            <MenuItem value="">All</MenuItem>
                            {uniqueCategories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
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
                                <TableCell align="right">Category</TableCell>
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
                                    <TableCell align="right" style={getCellStyle(index, 'stockWeight')}>
                                        <TextField
                                            type="number"
                                            value={row.stockWeight}
                                            onChange={(e) => handleInputChange(index, 'stockWeight', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell align="right" style={getCellStyle(index, 'maxWithdrawWeight')}>
                                        <TextField
                                            type="number"
                                            value={row.maxWithdrawWeight}
                                            onChange={(e) => handleInputChange(index, 'maxWithdrawWeight', e.target.value)}
                                        />
                                    </TableCell>
                                    <TableCell>{row.category}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={() => {
                                                const confirmDelete = window.confirm(`Are you sure you want to remove "${row.name}" from the inventory?`);
                                                if (confirmDelete) {
                                                    const newRows = rows.filter((_, i) => i !== index);
                                                    setRows(newRows);

                                                    // Remove related modified fields
                                                    const updatedModifiedFields = { ...modifiedFields };
                                                    Object.keys(updatedModifiedFields).forEach((key) => {
                                                        if (key.startsWith(`${index}-`)) {
                                                            delete updatedModifiedFields[key];
                                                        }
                                                    });
                                                    setModifiedFields(updatedModifiedFields);
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
                        label="Stock Weight (lbs)"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={newItem.stockWeight}
                        onChange={(e) => setNewItem({ ...newItem, stockWeight: e.target.value })}
                    />
                    <TextField
                        label="Max Withdraw Weight (lbs)"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={newItem.maxWithdrawWeight}
                        onChange={(e) => setNewItem({ ...newItem, maxWithdrawWeight: e.target.value })}
                    />
                    <TextField
                        label="Category"
                        fullWidth
                        margin="dense"
                        value={newItem.category}
                        onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
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