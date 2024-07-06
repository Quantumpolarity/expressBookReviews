const express = require('express');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
app.use(express.json());

app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// JWT authentication middleware (if needed)
// app.use("/customer/auth/*", function auth(req, res, next) { ... });

app.use("/customer", customer_routes);
app.use("/", genl_routes); // Ensure this line is present

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
