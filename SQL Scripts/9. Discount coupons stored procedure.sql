DELIMITER //
CREATE PROCEDURE generate_single_discount_coupon(
    OUT coupon_code VARCHAR(20),
    IN expiry_date DATE,
    IN discount decimal(10,2),
    IN product_id VARCHAR(36),
    IN category_id VARCHAR(36)
)
BEGIN
    DECLARE characters CHAR(62) DEFAULT 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    DECLARE i INT DEFAULT 1;
    DECLARE code VARCHAR(20) DEFAULT '';

    WHILE i <= 20 DO
        SET code = CONCAT(code, SUBSTRING(characters, FLOOR(RAND() * 62) + 1, 1));
        SET i = i + 1;
    END WHILE;

    SET coupon_code = code;
	INSERT INTO discount_coupons (code, expiry_date, discount, product_id, product_category)
	VALUES (coupon_code, expiry_date, discount, product_id, category_id);
END;

CALL generate_single_discount_coupon(
    @generated_coupon_code,
    '2024-10-15',
    5,
    '5c5f81ae-66a6-11ef-a58d-1860241447c9',
    null
);
