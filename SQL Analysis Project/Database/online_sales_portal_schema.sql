/*
Project: Online Sales Portal Database
Author: Kevin McMahon
File: Database schema
Purpose: Create the portfolio database, tables, keys, and relationships.
Platform: MySQL 8.0+
*/

CREATE DATABASE IF NOT EXISTS online_sales_portal
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_0900_ai_ci;

USE online_sales_portal;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS inventory_logs;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS customers;

SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE customers (
    customer_id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    street_address VARCHAR(150),
    city VARCHAR(50),
    state VARCHAR(50),
    zip_code VARCHAR(15),
    CONSTRAINT pk_customers PRIMARY KEY (customer_id),
    CONSTRAINT uq_customers_email UNIQUE (email)
) ENGINE = InnoDB;

CREATE TABLE products (
    product_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    category VARCHAR(75),
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    CONSTRAINT pk_products PRIMARY KEY (product_id)
) ENGINE = InnoDB;

CREATE TABLE orders (
    order_id INT NOT NULL AUTO_INCREMENT,
    customer_id INT NOT NULL,
    order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    order_status VARCHAR(50) NOT NULL,
    order_total DECIMAL(10,2) NOT NULL,
    CONSTRAINT pk_orders PRIMARY KEY (order_id),
    CONSTRAINT fk_orders_customers
        FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
) ENGINE = InnoDB;

CREATE TABLE order_items (
    order_item_id INT NOT NULL AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    line_total DECIMAL(10,2) NOT NULL,
    CONSTRAINT pk_order_items PRIMARY KEY (order_item_id),
    CONSTRAINT fk_order_items_orders
        FOREIGN KEY (order_id) REFERENCES orders (order_id),
    CONSTRAINT fk_order_items_products
        FOREIGN KEY (product_id) REFERENCES products (product_id)
) ENGINE = InnoDB;

CREATE TABLE payments (
    payment_id INT NOT NULL AUTO_INCREMENT,
    order_id INT NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) NOT NULL,
    payment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    payment_amount DECIMAL(10,2) NOT NULL,
    CONSTRAINT pk_payments PRIMARY KEY (payment_id),
    CONSTRAINT uq_payments_order_id UNIQUE (order_id),
    CONSTRAINT fk_payments_orders
        FOREIGN KEY (order_id) REFERENCES orders (order_id)
) ENGINE = InnoDB;

CREATE TABLE inventory_logs (
    inventory_log_id INT NOT NULL AUTO_INCREMENT,
    product_id INT NOT NULL,
    change_type VARCHAR(50) NOT NULL,
    quantity_changed INT NOT NULL,
    change_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes VARCHAR(255),
    CONSTRAINT pk_inventory_logs PRIMARY KEY (inventory_log_id),
    CONSTRAINT fk_inventory_logs_products
        FOREIGN KEY (product_id) REFERENCES products (product_id)
) ENGINE = InnoDB;

