const express = require('express');
const router = express.Router();
const connection = require('../utils/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


const emailController = require('../utils/emailController');


// Generate a random buffer of 32 bytes (256 bits)

// const randomBytes = crypto.randomBytes(32);
// const secret = randomBytes.toString('hex');
// console.log('Generated secret:', secret);


router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' , error: req.flash('error')});
});

router.post('/register', (req, res) => {
    const inputEmail = req.body.email;
    const inputPassword = req.body.password;
    const saltRounds = 10;
    connection.query("SELECT * FROM users WHERE email = ?", inputEmail, (err, result) => {
        if (err) {
            res.render('500');
            console.log(err);
        }
        if (result.length > 0) {
            req.flash('error', 'User already exists');
            res.redirect('/register');
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


router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' , error: req.flash('error')});
});

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    connection.query("SELECT * FROM users WHERE email = ?", email, async (err, result) => {
        if (err) {
            res.render('500');
            console.log(err);
        }
        if (result.length > 0) {
            const comparison = await bcrypt.compare(password, result[0].password);
            if (comparison) {
                const userID = result[0].id;
                jwt.sign({ userID }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY }, (err, token) => {
                    if (err) {
                        console.log(err);
                    }
                    res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000, secure: true});
                    res.redirect('/todos');
                })
            } else {
                req.flash('error', 'Incorrect password');
                res.redirect('/login');
            }
        } else {
            req.flash('error', 'Invalid email');
            res.redirect('/login');
        }
    });
});

router.get('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/home');
});

router.get('/forgot-password', (req, res) => {
    res.render('forgot-password', { title: 'Forgot Password' , error: req.flash('error')});
});

router.post('/forgot-password', (req, res) => {
    const email = req.body.email;
    connection.query("SELECT * FROM users WHERE email = ?", email, (err, result) => {
        if (err) {
            res.render('500');
            console.log(err);
        }
        if (result.length > 0) {
            const userID = result[0].id;
            jwt.sign({ userID: userID }, process.env.JWT_RESET_PASSWORD, { expiresIn: process.env.EXPIRY_RESET_PASSWORD }, (err, token) => {
                if (err) {
                    console.log(err);
                }
                const link = `${req.headers['x-forwarded-proto']||'http'}://${req.headers.host}/reset-password/${token}`;
                emailController.sendEmail(link, email);
                // console.log(`http://localhost:5000/reset-password/${token}`);
                res.redirect('/login');
            });
        } else {
            req.flash('error', 'Invalid email');
            res.redirect('/forgot-password');
        }
    });
});

router.get('/reset-password/:token', async (req, res) => {
    const token = req.params.token;
    res.render('reset-password', { title: 'Reset Password', token: token });
});

router.post('/reset-password', (req, res) => {
    const token = req.body.token;
    const password = req.body.password;
    const saltRounds = 10;
    jwt.verify(token, process.env.JWT_RESET_PASSWORD, (err, decoded) => {
        if (err) {
            console.log(err);
            res.render('404');
        }
        const userID = decoded.userID;
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                console.log(err);
            }
            connection.query("UPDATE users SET password = ? WHERE id = ?", [hash, userID], (err, result) => {
                if (err) {
                    res.render('500');
                    console.log(err);
                }
                res.redirect('/login');
            });
        });
    });
});

module.exports = router;