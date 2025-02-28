CREATE DATABASE retriever_essentials_data;
/*
    item_name = name of the item
    storage_quantity = quantity of the item in storage
    num_sold = number of items sold
    serving_weight = weight of the item per serving
    serving_amount = amount of the item per serving
    max_weight = maximum weight of the item that a student can take
    max_amount = maximum amount of the item that a student can take
*/
/*test for github*/
CREATE TABLE items (
    item_name TINYTEXT(500),
    storage_quantity SMALLINT(255),
    num_sold MEDIUMINT(200000),
    serving_weight DECIMAL(65, 2),
    serving_amount TINYINT(50),
    max_weight DECIMAL(65, 2),
    max_amount TINYINT(50)
);
