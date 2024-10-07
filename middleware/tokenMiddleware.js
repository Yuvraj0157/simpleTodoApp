const jwt = require("jsonwebtoken");

function validateToken(req, res, next) {
    const token = req.cookies.jwt;
    if (!token) {
        req.isLoggedIn = false;
        return next();
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            req.isLoggedIn = false;
            return next();
        }
        req.isLoggedIn = true;
        next();
    });
}

module.exports = validateToken;
