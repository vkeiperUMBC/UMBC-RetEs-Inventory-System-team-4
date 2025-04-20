import React, { useState } from 'react';

export function SqlTest() {
    const [text, setText] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State to store the error message
    const [latestMessage, setLatestMessage] = useState(''); // State to store the latest message from the server

    // Function to handle the POST request
    const handleButtonClick = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: text, // Send the string directly
            });

            if (response.ok) {
                alert('Message sent successfully!');
                setErrorMessage(''); // Clear any previous error message
                fetchLatestMessage(); // Fetch the latest message from the server
            } else {
                const errorText = await response.text(); // Get error details from the response
                setErrorMessage(`Failed to send message: ${errorText}`);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setErrorMessage(`An error occurred: ${error.message}`); // Display the error message
        }
    };

    // Function to handle the GET request
    const fetchLatestMessage = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/data');
            if (response.ok) {
                const data = await response.json();
                setLatestMessage(data.text || 'No message available'); // Update the latest message
            } else {
                console.error('Failed to fetch the latest message.');
            }
        } catch (error) {
            console.error('Error fetching the latest message:', error);
        }
    };

    return (
        <div>
            <h1>Send Message</h1>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter your message here"
                style={{ display: 'block', width: '100%', marginBottom: '10px' }}
            ></textarea>
            <button type="button" onClick={handleButtonClick}>Send Message</button>
            {errorMessage && (
                <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p> // Display error message
            )}
            <p style={{ marginTop: '20px' }}>
                <strong>Latest Message from Server:</strong> {latestMessage}
            </p>
        </div>
    );
}

export default SqlTest;
