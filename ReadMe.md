# E-Commerce Application

This is a full-stack e-commerce application built with React for the frontend, Node.js and Express for the backend, and uses MySQL database. The application allows users to browse products, search for products through various filters. Users can also sign up, log in, and view their order history.

## Features

- User authentication (sign up, log in)
- Product browsing and search
- Single/Bulk Product Upload
- User Profile and order viewing
- JWT-based authentication
- Responsive UI design
- API Rate Limiting

## Technologies Used

### Frontend
- React
- HTML5 & CSS3
- Fetch for API requests

### Backend
- Node.js
- Express.js
- MySQL
- bcrypt for password hashing
- JWT for authentication

### Database
- MySQL


## Configuration

### Backend
- cd backend
- npm install
- Create a .env file in the backend directory with the following content:
    -   EMAIL_USER, EMAIL_PASS, host, post, jwt_secret, db_user, db_password, db_name, db_port, db_host

### Frontend
- cd frontend
- npm install

### Database
- Create a mysql database 'Zimyo'. 
- Execute the scripts mentioned in folder 'DB Setup SQL Scripts'.

### Start the server
- Use npm start command in frontend and backend folders.
- The backend server is configured to run on port 3000.
- The frontend server is configured to run on port 5173.


## API Endpoints
### Products
- `GET products/fetch-products`: Fetches products, filter and pagination can be applied
- `POST products/bulk-upload`: Reads a csv file and uploads all products in database
- `POST products/new-product`: Saves a single new product after validating product details in database

### User
- `POST user/signup`: Registers a new user in database after validating user input
- `POST user/login`: Checks the credentials provided and generates a jwt token for successful login
- `GET user/user-details`: Fetches all details related to the user along with order details

### Orders
- `GET orders/generate-orderid`: Generates a unique order id of type UUID
- `PUT orders/update-order`: Updates the status of the specified order to specified new value and also notifies the user associated with the order via email