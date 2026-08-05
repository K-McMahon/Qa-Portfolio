# Online Sales Portal | SQL Analysis and Power BI Project

## Project Synopsis

This project presents a self-designed MySQL sales database and a business-focused analysis workflow. It includes a six-table relational schema, sanitized sample data, 15 documented SQL queries, a consolidated query-results report, and a two-page Power BI dashboard for sales and inventory analysis.

## Project Artifacts

- [Database schema](Database/online_sales_portal_schema.sql)
- [Sanitized sample data](Database/online_sales_portal_sample_data.sql)
- [Complete SQL analysis script](Queries/online_sales_portal_analysis.sql)
- [SQL query-results report](Documentation/online_sales_portal_query_results_report.md)
- [Power BI dashboard overview](Power%20Bi/README.md)
- [Power BI report file](Power%20Bi/online_sales_portal_dashboard.pbix)

## Database Design

The `online_sales_portal` schema contains six related tables:

- `customers`
- `orders`
- `order_items`
- `products`
- `payments`
- `inventory_logs`

Primary keys and foreign keys connect customers to orders, orders to line items and payments, and products to both line items and inventory activity.

## Analysis Coverage

The SQL portfolio demonstrates filtering, sorting, pattern matching, conditional logic, aggregation, grouping, joins, calculated values, and subqueries. The analysis answers practical questions about order status, approved revenue, payment methods, product performance, stock levels, and inventory movement.

## Power BI Deliverable

The interactive Power BI report contains:

- A Sales Overview page with revenue and order KPIs, product performance, payment-method analysis, and slicers.
- An Inventory Analysis page with stock KPIs, low-stock details, current inventory, and inventory movement by type.

![Sales Overview dashboard](Power%20Bi/Screenshots/DASHBOARD_SALES_OVERVIEW.png)

![Inventory Analysis dashboard](Power%20Bi/Screenshots/DASHBOARD_INV_ANALYSIS.png)

## Tools and Skills

`MySQL` | `MySQL Workbench` | `SQL` | `Power BI` | `Power Query` | `DAX` | Relational Modeling | Data Analysis | Dashboard Design
