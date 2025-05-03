import React, { useState, useEffect } from 'react';
import {
    Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, AppBar, Toolbar, Typography, Button, Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Analytics = () => {
    const [purchases, setPurchases] = useState([]); // Stores all purchase data
    const [studentData, setStudentData] = useState([]); // Stores aggregated data for the bar chart
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/purchases', {
                    method: 'GET',
                });

                if (response.ok) {
                    const data = await response.json();
                    setPurchases(data);

                    // Process data to calculate total purchases per student
                    const studentTotals = data.reduce((acc, purchase) => {
                        const { student_id, purchase_quantity } = purchase;
                        acc[student_id] = (acc[student_id] || 0) + purchase_quantity;
                        return acc;
                    }, {});

                    // Convert the totals into an array for rendering and sort by total in descending order
                    const chartData = Object.entries(studentTotals)
                        .map(([student_id, total]) => ({ student_id, total }))
                        .sort((a, b) => b.total - a.total);

                    setStudentData(chartData);
                } else {
                    console.error('Failed to fetch purchases');
                }
            } catch (error) {
                console.error('Error fetching purchases:', error);
            }
        };

        fetchPurchases();
    }, []);

    return (
        <Container style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh' }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Analytics
                    </Typography>
                    <Button color="inherit" onClick={() => navigate('/inventoryAdmin')}>
                        Back to Inventory
                    </Button>
                </Toolbar>
            </AppBar>

            {/* Bar Chart */}
            <Typography variant="h6" sx={{ marginTop: 4 }}>
                Total Purchases by Student
            </Typography>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-around',
                    marginTop: 2,
                    width: '80%',
                    height: 300,
                    border: '1px solid #ccc',
                    padding: 2,
                }}
            >
                {studentData.map((data, index) => (
                    <Box
                        key={index}
                        sx={{
                            flex: 1, // Dynamically adjust bar width
                            margin: '0 5px',
                            backgroundColor: '#3f51b5',
                            height: `${(data.total / studentData[0].total) * 100}%`, // Scale relative to the highest value
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: '12px',
                        }}
                    >
                        <Typography variant="caption">{data.total}</Typography>
                    </Box>
                ))}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', marginTop: 1, width: '80%' }}>
                {studentData.map((data, index) => (
                    <Box
                        key={index}
                        sx={{
                            flex: 1, // Dynamically adjust label width
                            textAlign: 'center',
                            fontSize: '12px',
                        }}
                    >
                        {data.student_id}
                    </Box>
                ))}
            </Box>

            {/* Table */}
            <TableContainer component={Paper} sx={{ marginTop: 4, maxWidth: 800 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Student ID</TableCell>
                            <TableCell>Item Name</TableCell>
                            <TableCell>Purchase Date</TableCell>
                            <TableCell>Day of Week</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {purchases.map((purchase, index) => (
                            <TableRow key={index}>
                                <TableCell>{purchase.student_id}</TableCell>
                                <TableCell>{purchase.item_name}</TableCell>
                                <TableCell>{purchase.purchase_date}</TableCell>
                                <TableCell>{purchase.day_of_week}</TableCell>
                                <TableCell align="right">{purchase.purchase_quantity}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default Analytics;