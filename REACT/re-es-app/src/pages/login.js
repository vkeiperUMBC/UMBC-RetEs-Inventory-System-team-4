import React from 'react';
import Box from '@mui/material/Box';

import Label from '../components/label';
import TextInput from '../components/textInput';
import { Link } from 'react-router-dom';


export function Login() {
    return (
        <Box
            sx={{
                borderRadius: 1,
                margin: 2,
                padding: 2,
                border: "1px solid #252525",
                boxShadow: '3px 3px 10px rgba(0, 0, 0, 0.5)', // Updated boxShadow
                bgcolor: 'primary.main',
            }}
        >
            <Label text="Username/ID:" size='3' color='#252525' />
            <TextInput phTxt="Enter Username/ID Here" isPass={false} />
            <Label text="Password:" size='3' />
            <TextInput phTxt="Enter Password Here" isPass={true} />
            <div className="inline-elements">
                <p>Forgot your password? too bad</p>
                <Link to="/inventory">
                    <button>Log In</button>
                </Link>
                <Link to="/inventoryAdmin">
                    <button>Log AdmIn</button>
                </Link>

            </div>
            <Link to="/sqltest">SQL Test</Link>
            <Link to="/shadowTest">Shadow Test</Link>
        </Box>
    );
};

export default Login;