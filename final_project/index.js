const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(session({
    secret: 'yourSecret',
    resave: false,
    saveUninitialized: true
}));

app.use(express.json());

// Authentication middleware
app.use("/customer/auth/*", function auth(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Extract the token from the header
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.user = user; // Assign the user to the request object
                next(); // Proceed to the next middleware
            } else {
                return res.status(403).json({ message: "User not authenticated" });
            }
        });
    } else {
        return res.status(403).json({ message: "User not logged in" });
    }
});


app.use("/customer", customer_routes);
app.use("/", genl_routes);

const PORT = 3000;
app.listen(PORT, () => console.log("Server is running"));
