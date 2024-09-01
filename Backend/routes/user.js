const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const dotenv = require('dotenv');
dotenv.config();

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.db_host,
    port: process.env.db_port,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_name
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

router.post('/signup', async (req, res) => {
    const { name, city, country, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if(email && !isValidEmail(email)){
        return res.status(400).json({ error: 'Enter valid email' });
    }
    if(password && password.length<5) {
        return res.status(400).json({ error: 'Password should have atleast 5 characters' });
    }

    try {
        const [existingUser] = await db.promise().query('SELECT * FROM user_credentials WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userid = uuidv4();
        const secretCode = process.env.jwt_secret;

        const [userResult] = await db.promise().query('INSERT INTO users (id, name, city, country, role) VALUES (?, ?, ?, ?, "Guest")', [userid, name, city, country]);
        const [userCredentialsResult] = await db.promise().query('INSERT INTO user_credentials (user_id, email, password) VALUES (?, ?, ?)', [userid, email, hashedPassword]);

        const token = jwt.sign({ userId: userid, email }, secretCode, { expiresIn: '1h' });
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (err) {
        console.error('Error during sign-up:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const [rows] = await db.promise().query('SELECT * FROM user_credentials WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = rows[0];
        const isPasswordValid = (await bcrypt.compare(password, user.password)) || (password === user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const jwtSecret = process.env.JWT_SECRET;
        const token = jwt.sign({ userId: user.user_id, email }, jwtSecret, { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/user-details', (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (token == null) return res.status(401).json({ error: 'Token is required' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        const email = user.email
        const dataQuery = 'select o.id, u.name as user_name, uc.email, u.city, u.country, u.role, p.name as product_name, p.category, o.quantity, o.status, o.delivery_address, o.orderdate, pa.mode_of_payment, p.price*o.quantity as bill from orders o join products p on p.id=o.product_id join users u on u.id=o.users_id join user_credentials uc on uc.user_id=u.id join payment pa on o.id=pa.order_id where email = ?';

        db.query(dataQuery, [email], (err, result) => {
            if(err){
                console.error('Error fetching user details:', err);
                res.status(500).json({ error: 'Internal server error' });
            }
            return res.status(200).json({ data: result });
        })

    });
})

module.exports = router;