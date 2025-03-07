-- dummy file that tests the connection to python

CREATE FUNCTION test_connection() RETURNS VARCHAR(255)
BEGIN
    -- make text file
    DECLARE sql_command VARCHAR(255);
    SET sql_command = 'echo "Connection successful" > test_connection.txt';
    EXECUTE IMMEDIATE sql_command;
    RETURN 'Connection successful';
END;