/*
Project: Online Sales Portal SQL Analysis
Author: Kevin McMahon
Database: online_sales_portal
Purpose: Demonstrate SQL filtering, sorting, aggregation,
         pattern matching, grouping, and relational joins.
*/

USE online_sales_portal;


-- =========================================================
-- Query 01: Electronics products sorted by price
-- Purpose: Identify Electronics products from highest
--          to lowest price.
-- Skills: SELECT, WHERE, ORDER BY
-- =========================================================

SELECT
    product_name,
    category,
    price,
    stock_quantity
FROM products
WHERE category = 'Electronics'
ORDER BY price DESC;


-- =========================================================
-- Query 02: Affordable products with high stock levels
-- Purpose: Identify products priced below $50 that have
--          more than 100 units in stock, ordered from the
--          highest to the lowest stock quantity.
-- Skills: SELECT, WHERE, AND, ORDER BY
-- =========================================================

SELECT
    product_name,
    price,
    stock_quantity
FROM products
WHERE price < 50
    AND stock_quantity > 100
ORDER BY stock_quantity DESC;


-- =========================================================
-- Query 03: Travel or premium-priced products
-- Purpose: Identify products that belong to the Travel
--          category or are priced above $75, ordered from
--          the highest to the lowest price.
-- Skills: SELECT, WHERE, OR, ORDER BY
-- =========================================================

SELECT
    product_name,
    category,
    price
FROM products
WHERE price > 75
    OR category = 'Travel'
ORDER BY price DESC;


-- =========================================================
-- Query 04: Search the product catalog by keyword
-- Purpose: Find products where the keyword "charger"
--          appears in either the product name or description.
-- Skills: SELECT, WHERE, LIKE, OR, ORDER BY
-- =========================================================

SELECT
    product_name,
    description,
    category,
    price
FROM products
WHERE product_name LIKE '%charger%'
    OR description LIKE '%charger%'
ORDER BY product_name ASC;


-- =========================================================
-- Query 05: Count delivered orders
-- Purpose: Determine how many customer orders have reached
--          the Delivered status.
-- Skills: SELECT, COUNT, AS, WHERE
-- =========================================================

SELECT
    COUNT(*) AS delivered_order_count
FROM orders
WHERE order_status = 'Delivered';


-- =========================================================
-- Query 06: Count orders by status
-- Purpose: Summarize the number of orders currently assigned
--          to each order status, with the largest groups first.
-- Skills: SELECT, COUNT, AS, GROUP BY, ORDER BY
-- =========================================================

SELECT
    order_status,
    COUNT(*) AS order_count
FROM orders
GROUP BY order_status
ORDER BY order_count DESC;


-- =========================================================
-- Query 07: Calculate approved payment revenue
-- Purpose: Calculate the total amount collected from payments
--          that have been approved.
-- Skills: SELECT, SUM, AS, WHERE
-- =========================================================

SELECT
    SUM(payment_amount) AS approved_revenue
FROM payments
WHERE payment_status = 'Approved';


-- =========================================================
-- Query 08: Approved revenue by payment method
-- Purpose: Show how approved revenue is distributed across
--          the available payment methods.
-- Skills: SELECT, SUM, AS, WHERE, GROUP BY, ORDER BY
-- =========================================================

SELECT
    payment_method,
    SUM(payment_amount) AS approved_revenue
FROM payments
WHERE payment_status = 'Approved'
GROUP BY payment_method
ORDER BY approved_revenue DESC;


-- =========================================================
-- Query 09: Match customers to their orders
-- Purpose: Combine customer and order records to show who
--          placed each order and its current status and total.
-- Skills: SELECT, INNER JOIN, ON, ORDER BY
-- =========================================================

SELECT
    customers.first_name,
    customers.last_name,
    orders.order_id,
    orders.order_status,
    orders.order_total
FROM customers
INNER JOIN orders
    ON customers.customer_id = orders.customer_id
ORDER BY orders.order_id ASC;


-- =========================================================
-- Query 10: Display products included in each order
-- Purpose: Combine order-item and product records to show
--          the products, quantities, and amounts per order.
-- Skills: SELECT, INNER JOIN, ON, ORDER BY
-- =========================================================

SELECT
    order_items.order_id,
    products.product_name,
    order_items.quantity,
    order_items.unit_price,
    order_items.line_total
FROM order_items
INNER JOIN products
    ON order_items.product_id = products.product_id
ORDER BY order_items.order_id ASC;


-- =========================================================
-- Query 11: Order fulfillment detail report
-- Purpose: Combine orders, order items, and products to show
--          each ordered product and its fulfillment status.
-- Skills: SELECT, multiple INNER JOINs, ON, ORDER BY
-- =========================================================

SELECT
    orders.order_id,
    orders.order_status,
    products.product_name,
    order_items.quantity,
    order_items.line_total
FROM orders
INNER JOIN order_items
    ON orders.order_id = order_items.order_id
INNER JOIN products
    ON order_items.product_id = products.product_id
ORDER BY orders.order_id ASC;


-- =========================================================
-- Query 12: Inventory activity summary
-- Purpose: Summarize the number and net quantity effect of
--          inventory log entries for each activity type.
-- Skills: SELECT, COUNT, SUM, AS, GROUP BY, ORDER BY
-- =========================================================

SELECT
    change_type,
    COUNT(*) AS log_count,
    SUM(quantity_changed) AS net_quantity_change
FROM inventory_logs
GROUP BY change_type
ORDER BY net_quantity_change DESC;


-- =========================================================
-- Query 13: Calculate the average product price
-- Purpose: Determine the average price across the complete
--          product catalog, rounded to two decimal places.
-- Skills: SELECT, AVG, ROUND, AS
-- =========================================================

SELECT
    ROUND(AVG(price), 2) AS average_product_price
FROM products;


-- =========================================================
-- Query 14: Products priced below the catalog average
-- Purpose: Dynamically identify products priced below the
--          current average price of the complete catalog.
-- Skills: SELECT, WHERE, subquery, AVG, ORDER BY
-- =========================================================

SELECT
    product_name,
    category,
    price
FROM products
WHERE price < (
    SELECT AVG(price)
    FROM products
)
ORDER BY price ASC;


-- =========================================================
-- Query 15: Low-stock inventory activity report
-- Purpose: Identify products with fewer than 50 units in
--          stock and display their related inventory activity.
-- Skills: SELECT, INNER JOIN, ON, WHERE, ORDER BY
-- =========================================================

SELECT
    products.product_name,
    products.stock_quantity,
    inventory_logs.change_type,
    inventory_logs.quantity_changed,
    inventory_logs.notes
FROM products
INNER JOIN inventory_logs
    ON products.product_id = inventory_logs.product_id
WHERE products.stock_quantity < 50
ORDER BY products.stock_quantity ASC;
