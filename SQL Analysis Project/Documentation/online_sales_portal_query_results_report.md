# Online Sales Portal — SQL Analysis Report

**Author:** Kevin McMahon  
**Database:** `online_sales_portal`  
**Queries:** 15  
**Dataset:** Fictional, sanitized portfolio data  

## Executive Summary

This report documents SQL analysis performed against a six-table online sales database containing customers, products, orders, order items, payments, and inventory activity. The analysis demonstrates filtering, sorting, pattern matching, aggregation, grouping, joins, and subqueries while answering practical sales and operations questions.

## Query 01 — Electronics Products Sorted by Price

**Purpose:** Identify Electronics products from highest to lowest price.

```sql
SELECT product_name, category, price, stock_quantity
FROM products
WHERE category = 'Electronics'
ORDER BY price DESC;
```

| Product | Category | Price | Stock Quantity |
|---|---|---:|---:|
| Gaming Keyboard | Electronics | 84.98 | 35 |
| Bluetooth Speaker | Electronics | 49.99 | 80 |
| Wireless Mouse | Electronics | 24.99 | 150 |
| Phone Charger | Electronics | 24.99 | 120 |

## Query 02 — Affordable Products With High Stock Levels

**Purpose:** Find products below $50 with more than 100 units in stock.

```sql
SELECT product_name, price, stock_quantity
FROM products
WHERE price < 50 AND stock_quantity > 100
ORDER BY stock_quantity DESC;
```

| Product | Price | Stock Quantity |
|---|---:|---:|
| Reusable Water Bottle | 19.99 | 200 |
| Wireless Mouse | 24.99 | 150 |
| Phone Charger | 24.99 | 120 |

## Query 03 — Travel or Premium-Priced Products

**Purpose:** Find Travel products or products priced above $75.

```sql
SELECT product_name, category, price
FROM products
WHERE price > 75 OR category = 'Travel'
ORDER BY price DESC;
```

| Product | Category | Price |
|---|---|---:|
| Gaming Keyboard | Electronics | 84.98 |
| Travel Backpack | Travel | 59.99 |

## Query 04 — Product Catalog Keyword Search

**Purpose:** Search product names and descriptions for the keyword `charger`.

```sql
SELECT product_name, description, category, price
FROM products
WHERE product_name LIKE '%charger%'
   OR description LIKE '%charger%'
ORDER BY product_name ASC;
```

| Product | Description | Category | Price |
|---|---|---|---:|
| Phone Charger | Fast charging USB C wall charger | Electronics | 24.99 |

## Query 05 — Count Delivered Orders

**Purpose:** Determine how many orders have reached Delivered status.

```sql
SELECT COUNT(*) AS delivered_order_count
FROM orders
WHERE order_status = 'Delivered';
```

| Delivered Order Count |
|---:|
| 2 |

## Query 06 — Count Orders by Status

**Purpose:** Summarize the number of orders in each status.

```sql
SELECT order_status, COUNT(*) AS order_count
FROM orders
GROUP BY order_status
ORDER BY order_count DESC;
```

| Order Status | Order Count |
|---|---:|
| Processing | 2 |
| Delivered | 2 |
| Shipped | 1 |
| Pending Payment | 1 |
| Cancelled | 1 |

## Query 07 — Approved Payment Revenue

**Purpose:** Calculate the total amount collected from approved payments.

```sql
SELECT SUM(payment_amount) AS approved_revenue
FROM payments
WHERE payment_status = 'Approved';
```

| Approved Revenue |
|---:|
| 279.93 |

## Query 08 — Approved Revenue by Payment Method

**Purpose:** Show how approved revenue is distributed across payment methods.

```sql
SELECT payment_method, SUM(payment_amount) AS approved_revenue
FROM payments
WHERE payment_status = 'Approved'
GROUP BY payment_method
ORDER BY approved_revenue DESC;
```

| Payment Method | Approved Revenue |
|---|---:|
| Credit Card | 159.96 |
| PayPal | 59.99 |
| Debit Card | 59.98 |

## Query 09 — Customers and Their Orders

**Purpose:** Match each sanitized customer record to its order.

```sql
SELECT customers.first_name, customers.last_name,
       orders.order_id, orders.order_status, orders.order_total
FROM customers
INNER JOIN orders
    ON customers.customer_id = orders.customer_id
ORDER BY orders.order_id ASC;
```

| Customer | Order ID | Status | Total |
|---|---:|---|---:|
| Alex Carter | 1 | Processing | 74.98 |
| Morgan Lee | 2 | Shipped | 59.99 |
| Taylor Brooks | 3 | Delivered | 34.99 |
| Jordan Reed | 4 | Pending Payment | 49.99 |
| Casey Morgan | 5 | Cancelled | 19.99 |
| Riley Parker | 6 | Processing | 84.98 |
| Jamie Quinn | 7 | Delivered | 24.99 |

## Query 10 — Products Included in Each Order

**Purpose:** Display product, quantity, unit price, and line total for each order item.

```sql
SELECT order_items.order_id, products.product_name,
       order_items.quantity, order_items.unit_price,
       order_items.line_total
FROM order_items
INNER JOIN products
    ON order_items.product_id = products.product_id
ORDER BY order_items.order_id ASC;
```

| Order ID | Product | Quantity | Unit Price | Line Total |
|---:|---|---:|---:|---:|
| 1 | Wireless Mouse | 1 | 24.99 | 24.99 |
| 1 | Bluetooth Speaker | 1 | 49.99 | 49.99 |
| 2 | Travel Backpack | 1 | 59.99 | 59.99 |
| 3 | Desk Lamp | 1 | 34.99 | 34.99 |
| 4 | Bluetooth Speaker | 1 | 49.99 | 49.99 |
| 5 | Reusable Water Bottle | 1 | 19.99 | 19.99 |
| 6 | Gaming Keyboard | 1 | 84.98 | 84.98 |
| 7 | Phone Charger | 1 | 24.99 | 24.99 |

## Query 11 — Order Fulfillment Detail Report

**Purpose:** Combine orders, order items, and products into a fulfillment report.

```sql
SELECT orders.order_id, orders.order_status, products.product_name,
       order_items.quantity, order_items.line_total
FROM orders
INNER JOIN order_items
    ON orders.order_id = order_items.order_id
INNER JOIN products
    ON order_items.product_id = products.product_id
ORDER BY orders.order_id ASC;
```

| Order ID | Status | Product | Quantity | Line Total |
|---:|---|---|---:|---:|
| 1 | Processing | Wireless Mouse | 1 | 24.99 |
| 1 | Processing | Bluetooth Speaker | 1 | 49.99 |
| 2 | Shipped | Travel Backpack | 1 | 59.99 |
| 3 | Delivered | Desk Lamp | 1 | 34.99 |
| 4 | Pending Payment | Bluetooth Speaker | 1 | 49.99 |
| 5 | Cancelled | Reusable Water Bottle | 1 | 19.99 |
| 6 | Processing | Gaming Keyboard | 1 | 84.98 |
| 7 | Delivered | Phone Charger | 1 | 24.99 |

## Query 12 — Inventory Activity Summary

**Purpose:** Summarize the frequency and net quantity effect of inventory activities.

```sql
SELECT change_type,
       COUNT(*) AS log_count,
       SUM(quantity_changed) AS net_quantity_change
FROM inventory_logs
GROUP BY change_type
ORDER BY net_quantity_change DESC;
```

| Change Type | Log Count | Net Quantity Change |
|---|---:|---:|
| Restock | 2 | 75 |
| Sale | 4 | -5 |
| Adjustment | 1 | -5 |

## Query 13 — Average Product Price

**Purpose:** Calculate the average catalog price rounded to two decimal places.

```sql
SELECT ROUND(AVG(price), 2) AS average_product_price
FROM products;
```

| Average Product Price |
|---:|
| 42.85 |

## Query 14 — Products Below the Catalog Average

**Purpose:** Dynamically identify products priced below the current catalog average.

```sql
SELECT product_name, category, price
FROM products
WHERE price < (
    SELECT AVG(price)
    FROM products
)
ORDER BY price ASC;
```

| Product | Category | Price |
|---|---|---:|
| Reusable Water Bottle | Lifestyle | 19.99 |
| Wireless Mouse | Electronics | 24.99 |
| Phone Charger | Electronics | 24.99 |
| Desk Lamp | Home Office | 34.99 |

## Query 15 — Low-Stock Inventory Activity

**Purpose:** Identify products below 50 units and display their associated inventory activity.

```sql
SELECT products.product_name, products.stock_quantity,
       inventory_logs.change_type, inventory_logs.quantity_changed,
       inventory_logs.notes
FROM products
INNER JOIN inventory_logs
    ON products.product_id = inventory_logs.product_id
WHERE products.stock_quantity < 50
ORDER BY products.stock_quantity ASC;
```

| Product | Stock Quantity | Change Type | Quantity Changed | Notes |
|---|---:|---|---:|---|
| Gaming Keyboard | 35 | Sale | -1 | Gaming keyboard sold |
| Travel Backpack | 45 | Restock | 25 | Backpack inventory added |

## Skills Demonstrated

- `SELECT`, `FROM`, `WHERE`, `AND`, `OR`, and `LIKE`
- `ORDER BY` with ascending and descending sorting
- `COUNT`, `SUM`, `AVG`, and `ROUND`
- Aliases with `AS`
- `GROUP BY`
- Two-table and three-table `INNER JOIN` operations
- Aggregate and scalar subqueries
- Product, order, payment, revenue, and inventory analysis

## Supporting Files

- `../Queries/online_sales_portal_analysis.sql`
- `../Database/online_sales_portal_schema.sql`
- `../Database/online_sales_portal_sample_data.sql`

