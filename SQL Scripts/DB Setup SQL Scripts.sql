create database zimyo;

CREATE TABLE products (
    id VARCHAR(36) PRIMARY KEY DEFAULT (uuid()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(255),
    price DECIMAL(10, 4) NOT NULL,
    createdtimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastmodifiedtimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE inventory (
    id VARCHAR(36) PRIMARY KEY DEFAULT (uuid()),
    product_id varchar(36) NOT NULL,
    stock INT NOT NULL,
    createdtimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastmodifiedtimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE users(
    id VARCHAR(36) PRIMARY KEY DEFAULT (uuid()),
    name VARCHAR(100) NOT NULL,
    city varchar(50),
    country varchar(50),
    role varchar(30),
    createdtimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastmodifiedtimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders(
    id VARCHAR(36) PRIMARY KEY DEFAULT (uuid()),
    product_id varchar(36) NOT NULL,
    users_id varchar(36) NOT NULL,
    status varchar(30),
    delivery_address varchar(200),  
    orderdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deliverydate TIMESTAMP,
    createdtimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastmodifiedtimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (users_id) REFERENCES users(id)
);

CREATE TABLE orders_archive LIKE orders;

CREATE TABLE payment(
    id VARCHAR(36) PRIMARY KEY DEFAULT (uuid()),
    order_id varchar(36) NOT NULL,
    
    paymentdate TIMESTAMP,
    mode_of_payment varchar(50),
    payment_made boolean,
    createdtimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastmodifiedtimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    unique(order_id)
);

CREATE TABLE Review(
    id VARCHAR(36) PRIMARY KEY DEFAULT (uuid()),
    product_id varchar(36) NOT NULL,
    user_id varchar(36) NOT NULL,
    rating INT CHECK (rating BETWEEN 0 AND 5),
    comment text,
    reviewdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdtimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastmodifiedtimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    unique (product_id, user_id)
);

CREATE TABLE ReviewVotes(
    id VARCHAR(36) PRIMARY KEY DEFAULT (uuid()),
    review_id varchar(36) NOT NULL,
    user_id varchar(36) NOT NULL,
    reaction boolean,
    
    createdtimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastmodifiedtimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES review(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    unique (review_id, user_id)
);

create table discount_coupons (
    id varchar(36) primary key default (uuid()),
    code varchar(20) unique,
    expiry_date TIMESTAMP,
    discount decimal(10,2),
    product_id varchar(36),
    product_category varchar(40),
    createdtimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
