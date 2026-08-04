/*
Project: Online Sales Portal Database
Author: Kevin McMahon
File: Sanitized sample data
Purpose: Populate the portfolio database with fictional, reproducible test data.
Security: All customer identities and contact details are fictional.
*/

USE online_sales_portal;

START TRANSACTION;

INSERT INTO customers (
    customer_id,
    first_name,
    last_name,
    email,
    phone,
    street_address,
    city,
    state,
    zip_code
) VALUES
    (1, 'Alex', 'Carter', 'alex.carter@example.com', '555-010-1001', '100 Test Avenue', 'Tampa', 'FL', '33601'),
    (2, 'Morgan', 'Lee', 'morgan.lee@example.com', '555-010-1002', '205 Sample Street', 'Orlando', 'FL', '32801'),
    (3, 'Taylor', 'Brooks', 'taylor.brooks@example.com', '555-010-1003', '88 Quality Road', 'Miami', 'FL', '33101'),
    (4, 'Jordan', 'Reed', 'jordan.reed@example.com', '555-010-1004', '410 Automation Drive', 'Jacksonville', 'FL', '32202'),
    (5, 'Casey', 'Morgan', 'casey.morgan@example.com', '555-010-1005', '72 Data Lane', 'St Petersburg', 'FL', '33701'),
    (6, 'Riley', 'Parker', 'riley.parker@example.com', '555-010-1006', '390 Schema Court', 'Sarasota', 'FL', '34236'),
    (7, 'Jamie', 'Quinn', 'jamie.quinn@example.com', '555-010-1007', '55 Portfolio Way', 'Clearwater', 'FL', '33755');

INSERT INTO products (
    product_id,
    product_name,
    description,
    price,
    stock_quantity,
    category,
    is_active
) VALUES
    (1, 'Wireless Mouse', 'Ergonomic wireless mouse', 24.99, 150, 'Electronics', 1),
    (2, 'Bluetooth Speaker', 'Portable speaker with clear sound', 49.99, 80, 'Electronics', 1),
    (3, 'Desk Lamp', 'Adjustable LED desk lamp', 34.99, 60, 'Home Office', 1),
    (4, 'Travel Backpack', 'Water resistant backpack for travel', 59.99, 45, 'Travel', 1),
    (5, 'Reusable Water Bottle', 'Insulated stainless steel bottle', 19.99, 200, 'Lifestyle', 1),
    (6, 'Gaming Keyboard', 'Mechanical keyboard with backlighting', 84.98, 35, 'Electronics', 1),
    (7, 'Phone Charger', 'Fast charging USB C wall charger', 24.99, 120, 'Electronics', 1);

INSERT INTO orders (
    order_id,
    customer_id,
    order_date,
    order_status,
    order_total
) VALUES
    (1, 1, '2026-05-30 20:27:11', 'Processing', 74.98),
    (2, 2, '2026-05-30 20:27:11', 'Shipped', 59.99),
    (3, 3, '2026-05-30 20:27:11', 'Delivered', 34.99),
    (4, 4, '2026-05-30 20:27:11', 'Pending Payment', 49.99),
    (5, 5, '2026-05-30 20:27:11', 'Cancelled', 19.99),
    (6, 6, '2026-05-30 20:27:11', 'Processing', 84.98),
    (7, 7, '2026-05-30 20:27:11', 'Delivered', 24.99);

INSERT INTO order_items (
    order_item_id,
    order_id,
    product_id,
    quantity,
    unit_price,
    line_total
) VALUES
    (1, 1, 1, 1, 24.99, 24.99),
    (2, 1, 2, 1, 49.99, 49.99),
    (3, 2, 4, 1, 59.99, 59.99),
    (4, 3, 3, 1, 34.99, 34.99),
    (5, 4, 2, 1, 49.99, 49.99),
    (6, 5, 5, 1, 19.99, 19.99),
    (7, 6, 6, 1, 84.98, 84.98),
    (8, 7, 7, 1, 24.99, 24.99);

INSERT INTO payments (
    payment_id,
    order_id,
    payment_method,
    payment_status,
    payment_date,
    payment_amount
) VALUES
    (1, 1, 'Credit Card', 'Approved', '2026-05-30 20:27:11', 74.98),
    (2, 2, 'PayPal', 'Approved', '2026-05-30 20:27:11', 59.99),
    (3, 3, 'Debit Card', 'Approved', '2026-05-30 20:27:11', 34.99),
    (4, 4, 'Credit Card', 'Pending', '2026-05-30 20:27:11', 49.99),
    (5, 5, 'Gift Card', 'Refunded', '2026-05-30 20:27:11', 19.99),
    (6, 6, 'Credit Card', 'Approved', '2026-05-30 20:27:11', 84.98),
    (7, 7, 'Debit Card', 'Approved', '2026-05-30 20:27:11', 24.99);

INSERT INTO inventory_logs (
    inventory_log_id,
    product_id,
    change_type,
    quantity_changed,
    change_date,
    notes
) VALUES
    (1, 1, 'Restock', 50, '2026-05-30 20:27:11', 'New mouse shipment received'),
    (2, 2, 'Sale', -2, '2026-05-30 20:27:11', 'Speaker units sold'),
    (3, 3, 'Sale', -1, '2026-05-30 20:27:11', 'Desk lamp sold'),
    (4, 4, 'Restock', 25, '2026-05-30 20:27:11', 'Backpack inventory added'),
    (5, 5, 'Adjustment', -5, '2026-05-30 20:27:11', 'Damaged bottles removed from stock'),
    (6, 6, 'Sale', -1, '2026-05-30 20:27:11', 'Gaming keyboard sold'),
    (7, 7, 'Sale', -1, '2026-05-30 20:27:11', 'Phone charger sold');

COMMIT;

