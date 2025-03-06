import './App.css';
import {HashRouter as Router, Route, Routes} from 'react-router-dom';
import { Login } from './pages/login';
import { SqlTest } from './pages/sqltest';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/sqltest" element={<SqlTest/>}/>
      </Routes>
    </Router>
  );


  }

export default App;
