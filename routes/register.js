const express = require('express');
const path = require('path');
const router = express.Router();
const connection = require('../utils/connection');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    res.render('register', { title: 'Register' });
});

router.post('/', (req, res) => {
    const inputEmail = req.body.email;
    const inputPassword = req.body.password;
    const saltRounds = 10;
    connection.query("SELECT * FROM users WHERE email = ?", inputEmail, (err, result) => {
        if (err) {
            console.log(err);
        }
        if (result.length > 0) {
            res.send('User already exists');
        } else {
            bcrypt.hash(inputPassword, saltRounds, (err, hash) => {
                if (err) {
                    console.log(err);
                }
                connection.query("INSERT INTO users (email, password) VALUES (?, ?)", [inputEmail, hash], (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    res.redirect('/login');
                });
            });
        }
    });
        
    
});

module.exports = router;