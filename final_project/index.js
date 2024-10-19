const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());
app.use("/customer", session({secret: "fingerprint_customer", resave: true, saveUninitialized: true}));

// Middleware for authenticated routes
app.use("/customer/auth/*", (req, res, next) => {
    if (req.session.authorization) {
        const token = req.session.authorization['accessToken'];
        jwt.verify(token, "access", (err, user) => {
            if (err) {
                return res.status(403).json({message: "prego effettuare l'accesso"});
            } else {
                req.user = user;
                next();
            }
        });
    } else {
        return res.status(403).json({message: "per vedere la risorsa devi essere registrato o effettuare il login"});
    }
});

// Use the routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
