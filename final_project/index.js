const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const books = require('./booksdb.js');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
 // Extract the token from the request headers
    const token = req.headers['authorization'];

    // Check if the token is not present
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, "your_jwt_secret_key");
        // Attach the decoded user to the request object
        req.user = decoded;
    } catch (err) {
        // If the token is invalid, return an error
        return res.status(401).send("Invalid Token");
    }

    // Proceed to the next middleware or route handler
    return next();
});

const PORT = 5000;
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));

module.exports = {
  getAllBooks,
  getBookById,
  addReview
};
function getBookById(bookId) {
  return books[bookId] || null;
}

function addReview(bookId, review) {
  if (books[bookId]) {
    const reviewId = Object.keys(books[bookId].reviews).length + 1;
    books[bookId].reviews[reviewId] = review;
    return true;
  }
  return false;
}

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const PORT = 5000;
app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));

module.exports = {
  getAllBooks,
  getBookById,
  addReview
};
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
