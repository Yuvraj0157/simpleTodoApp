const express = require('express');
const path = require('path');
const router = express.Router();
const connection = require('../utils/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.get('/', (req, res) => {
    res.render('login', { title: 'Login' });
});

router.post('/', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    connection.query("SELECT * FROM users WHERE email = ?", email, async (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result.length > 0) {
            const comparison = await bcrypt.compare(password, result[0].password);
            if (comparison) {
                const userID = result[0].id;
                const token = jwt.sign({ userID }, process.env.JWT_SECRET, { expiresIn: '5d' }, (err, token) => {
                    if (err) {
                        console.log(err);
                    }
                    res.cookie('jwt', token, { httpOnly: true, maxAge: 86400000, secure: true});
                    res.redirect('/todos');
                })
            } else {
                res.send('Incorrect password');
            }
        } else {
            res.send('User not found');
        }
    });
});

module.exports = router;