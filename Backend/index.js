const express = require('express')
const rateLimit = require('express-rate-limit')
const cors = require('cors');
const app=express()

const port=3000

const limiter = rateLimit({
    windowMs: 10 * 1000,
    max: 3,                             // 3 request for 10 seconds
    standardHeaders: true,
    legacyHeaders: false,
});
  
app.use(express.json())
app.use(limiter);
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

const productsRouter = require('./routes/product');
const ordersRouter = require('./routes/order');
const usersRouter = require('./routes/user');

app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use('/user', usersRouter);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});