import React, { useState } from 'react';

export function SqlTest() {
    const [text, setText] = useState('');

    const handleButtonClick = () => {
        alert(text);
    };

    return (
        <div>
            <h1>SQL Test Page</h1>
            <p>This is a simple default React page for SQL testing.</p>
            <button type="button" onClick={handleButtonClick}>Send</button>
            <textarea value={text} onChange={(e) => setText(e.target.value)}></textarea>
        </div>
    );
};

export default SqlTest;
