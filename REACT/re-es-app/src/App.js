import './App.css';
import * as React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { Login } from './pages/login';
import { SqlTest } from './pages/sqltest';
import { ShadowTest } from './pages/shadowTest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Inventory } from './pages/inventory';
import { InventoryAdmin } from './pages/inventoryAdmin';
import { Analytics } from './pages/analytics';

const theme = createTheme({
  palette: {
    primary: {
      main: '#fcba03',
      dark: '#0066CC',
    },
  },
  spacing: 8,
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/sqltest" element={<SqlTest />} />
          <Route path="/shadowTest" element={<ShadowTest />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/inventoryAdmin" element={<InventoryAdmin />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
