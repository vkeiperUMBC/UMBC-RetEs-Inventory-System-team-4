-- Create the current_database table
CREATE TABLE IF NOT EXISTS current_database (
    item_name TEXT,
    storage_quantity INTEGER,
    num_sold INTEGER,
    serving_weight REAL,
    serving_amount INTEGER,
    max_weight REAL,
    max_amount INTEGER
);

-- Create the stored_previous table
CREATE TABLE IF NOT EXISTS stored_previous (
    item_name TEXT,
    storage_quantity INTEGER,
    num_sold INTEGER,
    serving_weight REAL,
    serving_amount INTEGER,
    max_weight REAL,
    max_amount INTEGER
);

-- Functionality to add a row to the current_database
-- This would be implemented in application logic, but here's an example SQL statement:
-- INSERT INTO current_database (item_name, storage_quantity, num_sold, serving_weight, serving_amount, max_weight, max_amount)
-- VALUES ('item_name', storage_quantity, num_sold, serving_weight, serving_amount, max_weight, max_amount);

-- Functionality to add a row to the current_database
CREATE PROCEDURE AddToCurrentDatabase(
    item_name TEXT,
    storage_quantity INTEGER,
    num_sold INTEGER,
    serving_weight REAL,
    serving_amount INTEGER,
    max_weight REAL,
    max_amount INTEGER
)
BEGIN
    INSERT INTO current_database (item_name, storage_quantity, num_sold, serving_weight, serving_amount, max_weight, max_amount)
    VALUES (item_name, storage_quantity, num_sold, serving_weight, serving_amount, max_weight, max_amount);
END;

-- Functionality to remove a row from current_database and add it to stored_previous
-- Example SQL statements:
-- INSERT INTO stored_previous SELECT * FROM current_database WHERE item_name = 'item_name';
-- DELETE FROM current_database WHERE item_name = 'item_name';

CREATE PROCEDURE MoveToStoredPrevious(item_name TEXT)
BEGIN
    INSERT INTO stored_previous SELECT * FROM current_database WHERE item_name = item_name;
    DELETE FROM current_database WHERE item_name = item_name;
END;

-- Functionality to load data from a file into a table
-- SQLite supports the `.import` command in the CLI for this purpose:
-- .mode csv
-- .import file_path current_database

-- Functionality to replace the current_database with new data
-- Example SQL statements:
-- DELETE FROM stored_previous;
-- INSERT INTO stored_previous SELECT * FROM current_database;
-- DELETE FROM current_database;
-- .mode csv
-- .import file_path current_database
