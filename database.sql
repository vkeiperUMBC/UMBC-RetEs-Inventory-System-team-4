/* library of functions python will call */
-- function to check if a database exists
DELIMITER $$
CREATE FUNCTION `check_database`(`db_name` TEXT) RETURNS INT
BEGIN
    DECLARE db_exists INT DEFAULT 0;
    SELECT COUNT(*) INTO db_exists FROM information_schema.schemata WHERE schema_name = db_name;
    RETURN db_exists;
END$$

-- function to create a new database if it does not exist
DELIMITER $$
CREATE FUNCTION `create_database`(`db_name` TEXT) RETURNS TEXT
BEGIN
    DECLARE db_exists INT DEFAULT 0;
    SELECT COUNT(*) INTO db_exists FROM information_schema.schemata WHERE schema_name = db_name;

    IF db_exists = 1 THEN
        RETURN 'Database already exists';
    END IF;

    SET @sql = CONCAT('CREATE DATABASE ', db_name);
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    RETURN 'Database created successfully';
END$$

-- function to replace a database with a new one and make the old database the stored_previous table
DELIMITER $$
CREATE FUNCTION `replace_database`(`db_name` TEXT) RETURNS TEXT
BEGIN
    -- Backup current database to stored_previous table
    TRUNCATE TABLE stored_previous;
    INSERT INTO stored_previous SELECT * FROM current_database;

    -- Clear current database
    TRUNCATE TABLE current_database;

    -- Use the new database
    USE db_name;

    -- Create table if it does not exist
    SET @sql_create_table = 'CREATE TABLE IF NOT EXISTS current_database (
        item_name TINYTEXT(500),
        storage_quantity SMALLINT(255),
        num_sold MEDIUMINT(200000),
        serving_weight DECIMAL(65, 2),
        serving_amount TINYINT(50),
        max_weight DECIMAL(65, 2),
        max_amount TINYINT(50)
    );';
    PREPARE stmt_create_table FROM @sql_create_table;
    EXECUTE stmt_create_table;
    DEALLOCATE PREPARE stmt_create_table;

    RETURN 'Database replaced successfully';
END$$

-- function to add a row to the current database
DELIMITER $$
CREATE FUNCTION `add_row`(`item_name` TEXT, `storage_quantity` INT, `num_sold` INT, `serving_weight` DECIMAL(65, 2), `serving_amount` INT, `max_weight` DECIMAL(65, 2), `max_amount` INT) RETURNS TEXT
BEGIN
    -- Check if the database exists
    DECLARE db_exists INT DEFAULT 0;
    SELECT COUNT(*) INTO db_exists FROM information_schema.schemata WHERE schema_name = 'retriever_essentials_data';

    IF db_exists = 0 THEN
        RETURN 'Database does not exist';
    END IF;

    -- Use the database
    USE retriever_essentials_data;

    -- Create table if it does not exist
    SET @sql_create_table = 'CREATE TABLE IF NOT EXISTS current_database (
        item_name TINYTEXT(500),
        storage_quantity SMALLINT(255),
        num_sold MEDIUMINT(200000),
        serving_weight DECIMAL(65, 2),
        serving_amount TINYINT(50),
        max_weight DECIMAL(65, 2),
        max_amount TINYINT(50)
    );';
    PREPARE stmt_create_table FROM @sql_create_table;
    EXECUTE stmt_create_table;
    DEALLOCATE PREPARE stmt_create_table;

    -- Add row to the table
    SET @sql = CONCAT('INSERT INTO current_database (item_name, storage_quantity, num_sold, serving_weight, serving_amount, max_weight, max_amount) VALUES ("', item_name, '", ', storage_quantity, ', ', num_sold, ', ', serving_weight, ', ', serving_amount, ', ', max_weight, ', ', max_amount, ')');
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    RETURN 'Row added successfully';
END$$

-- function to remove a row from the current database and add it to the stored_previous table
DELIMITER $$
CREATE FUNCTION `remove_row`(`item_name` TEXT) RETURNS TEXT
BEGIN
    -- Check if the database exists
    DECLARE db_exists INT DEFAULT 0;
    SELECT COUNT(*) INTO db_exists FROM information_schema.schemata WHERE schema_name = 'retriever_essentials_data';

    IF db_exists = 0 THEN
        RETURN 'Database does not exist';
    END IF;

    -- Use the database
    USE retriever_essentials_data;

    -- Create table if it does not exist
    SET @sql_create_table = 'CREATE TABLE IF NOT EXISTS stored_previous (
        item_name TINYTEXT(500),
        storage_quantity SMALLINT(255),
        num_sold MEDIUMINT(200000),
        serving_weight DECIMAL(65, 2),
        serving_amount TINYINT(50),
        max_weight DECIMAL(65, 2),
        max_amount TINYINT(50)
    );';
    PREPARE stmt_create_table FROM @sql_create_table;
    EXECUTE stmt_create_table;
    DEALLOCATE PREPARE stmt_create_table;

    -- Remove row from current_database and add it to stored_previous
    SET @sql = CONCAT('INSERT INTO stored_previous SELECT * FROM current_database WHERE item_name = "', item_name, '"');
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    SET @sql = CONCAT('DELETE FROM current_database WHERE item_name = "', item_name, '"');
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    RETURN 'Row removed successfully';
END$$

-- function to add file contents to database if database exists
DELIMITER $$
CREATE FUNCTION `add_file`(`file_path` TEXT) RETURNS TEXT
BEGIN
    -- Check if the database exists
    DECLARE db_exists INT DEFAULT 0;
    SELECT COUNT(*) INTO db_exists FROM information_schema.schemata WHERE schema_name = 'retriever_essentials_data';

    IF db_exists = 0 THEN
        RETURN 'Database does not exist';
    END IF;

    -- Use the database
    USE retriever_essentials_data;

    -- Create table if it does not exist
    SET @sql_create_table = 'CREATE TABLE IF NOT EXISTS from_file (
        item_name TINYTEXT(500),
        storage_quantity SMALLINT(255),
        num_sold MEDIUMINT(200000),
        serving_weight DECIMAL(65, 2),
        serving_amount TINYINT(50),
        max_weight DECIMAL(65, 2),
        max_amount TINYINT(50)
    );';
    PREPARE stmt_create_table FROM @sql_create_table;
    EXECUTE stmt_create_table;
    DEALLOCATE PREPARE stmt_create_table;

    -- Load data from file into the table
    SET @sql = CONCAT('LOAD DATA INFILE "', file_path, '" INTO TABLE from_file FIELDS TERMINATED BY "," LINES TERMINATED BY "\n" IGNORE 1 ROWS');
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    RETURN 'File loaded successfully';
END$$
DELIMITER ;
END;

-- function to upload excel file and replace current database with the file contents
-- old file contents are stored in stored_previous table
CREATE FUNCTION `load_file`(`file_path` TEXT) RETURNS TEXT
BEGIN
    -- Backup current database to stored_previous table
    TRUNCATE TABLE stored_previous;
    INSERT INTO stored_previous SELECT * FROM current_database;

    -- Clear current database
    TRUNCATE TABLE current_database;

    -- Load new data into current_database
    SET @sql = CONCAT('LOAD DATA INFILE "', file_path, '" INTO TABLE current_database FIELDS TERMINATED BY "," LINES TERMINATED BY "\n" IGNORE 1 ROWS');
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    RETURN 'File loaded and current database replaced successfully';
END;

/*
    item_name = name of the item
    storage_quantity = quantity of the item in storage
    num_sold = number of items sold
    serving_weight = weight of the item per serving
    serving_amount = amount of the item per serving
    max_weight = maximum weight of the item that a student can take
    max_amount = maximum amount of the item that a student can take
*/

-- this is the currently used database that will be utilized by the system
-- new files can either be added to this database or entirely replace this database
CREATE TABLE current_database (
    item_name TINYTEXT(500),
    storage_quantity SMALLINT(255),
    num_sold MEDIUMINT(200000),
    serving_weight DECIMAL(65, 2),
    serving_amount TINYINT(50),
    max_weight DECIMAL(65, 2),
    max_amount TINYINT(50)
);

-- when an excel sheet is uploaded as a replacement for the current database the previous database is added to this table
CREATE TABLE stored_previous (
    item_name TINYTEXT(500),
    storage_quantity SMALLINT(255),
    num_sold MEDIUMINT(200000),
    serving_weight DECIMAL(65, 2),
    serving_amount TINYINT(50),
    max_weight DECIMAL(65, 2),
    max_amount TINYINT(50)
);

