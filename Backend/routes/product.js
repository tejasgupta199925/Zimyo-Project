const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const dotenv = require('dotenv');
const fs = require('fs');
const csv = require('csv-parser');

dotenv.config();

// MySQL connection details
const db = mysql.createConnection({
    host: process.env.db_host,
    port: process.env.db_port,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_name
});

// Fetch all products
router.get('/fetch-products', (req, res) => {
    const filter = req.body;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let query = "Select * from Products ";
    let filterParameter = [];

    if (filter.name) {
        query += ' WHERE name LIKE ?';
        filterParameter.push(`%${filter.name}%`);
    }
    if (filter.category) {
        if (query.includes('WHERE')) {
            query += ' AND category = ?';
        } else {
            query += ' WHERE category = ?';
        }
        filterParameter.push(filter.category);
    }
    if (filter.price) {
        if (query.includes('WHERE')) {
            query += ' AND price ' + (filter.price.greater === true ? '> ?' : '<= ? ');
        } else {
            query += ' WHERE price ' + (filter.price.greater === true ? '> ?' : '<= ? ');
        }
        filterParameter.push(filter.price.amount)
    }

    const countQuery = query.replace('Select *', 'SELECT COUNT(*) AS totalCount');

    query += ' order by createdtimestamp desc LIMIT ? OFFSET ?';
    filterParameter.push(limit, offset);

    db.query(countQuery, filterParameter.slice(0, filterParameter.length - 2), (err, countResults) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }

        const totalCount = countResults[0].totalCount;
        const totalPages = Math.ceil(totalCount / limit);

        db.query(query, filterParameter, (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }

            res.json({
                products: results,
                totalPages: totalPages
            });
        });
    });
});

router.post('/new-product', async (req, res) => {
    const productData = req.body;
    try {
        const [statusCode, response] = await insertProduct(productData);
        res.status(statusCode).json(response);
    } catch (error) {
        console.error('Error inserting product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const insertProduct = async (productData) => {
    try {
        const errors = checkProductDetails(productData);

        if (errors.length > 0) {
            return [400, { errors: errors }];
        }

        const result = await new Promise((resolve, reject) => {
            db.query('INSERT INTO products SET ?', productData, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        return [201, { message: 'Product created successfully' }];
    } catch (error) {
        console.error('Error inserting product:', error);
        return [500, { error: 'Internal server error' }];
    }
}

const checkProductDetails = productData => {
    const errors = [];
    if (productData.name === undefined) {
        errors.push('Product Name is missing')
    }
    if (productData.description === undefined) {
        errors.push('Product Description is missing')
    }
    if (productData.category === undefined) {
        errors.push('Product Category is missing')
    }
    if (productData.price === undefined) {
        errors.push('Product Price is missing')
    } else if (productData.price <= 0) {
        errors.push('Invalid Product Price')
    }

    return errors;
}

// Bulk Upload Products
router.post('/bulk-upload', (req, res) => {
    const filePath = './Products_Data.csv';
    let processedProducts = [];
    let errors = [];

    fs.createReadStream(filePath)
        .pipe(csv({ headers: ['product_name', 'description', 'category', 'price'] }))
        .on('data', (row) => {
            try {
                const prod = {
                    name: row.product_name,
                    description: row.description,
                    category: row.category,
                    price: row.price
                };
                processedProducts.push(prod);
            } catch (error) {
                errors.push({ row, error: 'Error parsing product data' });
            }
        })
        .on('end', async () => {
            if (errors.length > 0) {
                res.status(400).json({ message: 'Errors encountered while processing CSV', errors });
            } else {
                try {
                    for (const product of processedProducts) {
                        await insertProduct(product);
                    }
                    res.status(201).json({ message: 'Products created successfully' });
                } catch (err) {
                    console.error('Error creating products:', err);
                    res.status(500).json({ message: 'Internal server error' });
                }
            }
        })
        .on('error', (err) => {
            console.error('Error reading CSV file:', err);
            res.status(500).json({ message: 'Internal server error' });
        });

});

module.exports = router;