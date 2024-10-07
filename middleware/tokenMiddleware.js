const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const token = req.cookies.jwt;
    if (!token) {
        req.isLoggedIn = false;
        next();
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            req.isLoggedIn = false;
            next();
        }
        req.isLoggedIn = true;
        next();
    });
}

module.exports = verifyToken;
