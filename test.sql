-- Create a table to test the connection
CREATE TABLE IF NOT EXISTS test_connection (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message TEXT
);

-- Insert a test message
INSERT INTO test_connection (message) VALUES ('Connection successful');

-- Query the table to verify the insertion
SELECT * FROM test_connection;