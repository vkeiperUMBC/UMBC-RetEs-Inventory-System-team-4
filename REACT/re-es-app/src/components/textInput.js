// import React, { useState } from 'react';

const TextInput = ({phTxt, isPass}) => {
    let tb;
    if (isPass === true) {
        tb = <input type="password" placeholder={phTxt} />;
    } else {
        tb = <input type="text" placeholder={phTxt} />;
    }
    return (
        <div>
            {tb}
        </div>
    );
};

export default TextInput;