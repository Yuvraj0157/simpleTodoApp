const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
    const token = req.cookies.jwt;
    if (!token) {
        return res.redirect('/login');
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.redirect('/login');
        }
        req.userID = decoded.userID;
        next();
    });
}

module.exports = verifyToken;
