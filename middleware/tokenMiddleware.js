const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const token = req.cookies.jwt;
    if (!token) {
        req.isLoggedIn = false;
        return next();
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            req.isLoggedIn = false;
        } else {
            req.isLoggedIn = true;
            req.userID = decoded.userID;
        }
        next();
    });
}

module.exports = verifyToken;
