ALTER TABLE orders ADD INDEX order_productid_idx (product_id);
ALTER TABLE orders ADD INDEX order_userid_idx (users_id);
ALTER TABLE orders ADD INDEX order_status_idx (status);
ALTER TABLE orders ADD INDEX order_orderdate_idx (orderdate);
CREATE TABLE orders_archive LIKE orders;
INSERT INTO orders_archive (SELECT * FROM orders WHERE orderdate < DATE_SUB(CURDATE(), INTERVAL 1 MONTH));
DELETE FROM orders WHERE orderdate < DATE_SUB(CURDATE(), INTERVAL 1 MONTH);
