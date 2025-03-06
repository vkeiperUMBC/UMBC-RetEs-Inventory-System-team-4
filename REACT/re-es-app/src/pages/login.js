import React from 'react';
import { useState } from 'react';
import Label from '../components/label';
import TextInput from '../components/textInput';
import { Link } from 'react-router-dom';

export function Login() {
    return (
        <div className="App">
        <Label text="Username/ID:" size='3' color='#252525'/>
        <TextInput phTxt="Enter Username/ID Here" isPass={false} />
        <Label text="Password:" size='3' />
        <TextInput phTxt="Enter Password Here" isPass={true} />
        <div className="inline-elements">
          <p>Forgot your password? too bad</p>
          <button>Log In</button>
        </div>
        <Link to="/sqltest">SQL Test</Link>
      </div>
    );
};

export default Login;