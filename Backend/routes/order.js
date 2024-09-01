const express = require('express');
const mysql = require('mysql2');
const emailModule = require('../email/email');
const router = express.Router();

const { v4: uuidv4 } = require('uuid');

const db = mysql.createConnection({
    host: process.env.db_host,
    port: process.env.db_port,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_name
});

router.get('/generate-orderid', (req, res) => {
    return res.status(200).json({ id: uuidv4() });
});

router.put('/update-order', (req, res) => {
    const orderid = req.headers['id'];
    const newStatus = req.headers['status'];

    db.query('UPDATE orders SET status = ? WHERE id = ?', [newStatus, orderid], (err, result) => {
        if (err) {
            console.error('Error updating order status:', err);
            return res.status(500).json({ error: 'Internal server error' });
        } else if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Order not found' });
        } else {
            const query = 'SELECT uc.email FROM user_credentials uc JOIN orders o ON o.users_id = uc.user_id WHERE o.id = ?';
            db.query(query, [orderid], (err, results) => {
                if (err) {
                    console.error('Error fetching user data:', err);
                    return res.status(500).json({ error: 'Internal server error while fetching user data' });
                } else {
                    const recipientEmail = results;
                    const subject = 'Order Status Update';
                    const message = 'Your order has been ' + newStatus + ' on ' + (new Date());
                    // emailModule.sendEmail(recipientEmail, subject, message);
                    return res.status(200).json({ success: 'Order updated successfully', user: results });
                }
            });
        }
    });
});


module.exports = router;