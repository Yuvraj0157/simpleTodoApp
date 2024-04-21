const express = require('express');
const router = express.Router();
const connection = require('../utils/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, body } = require('express-validator');
const { validationResult } = require('express-validator');
const crypto = require('crypto');

const emailController = require('../utils/emailController');

// Generate a random buffer of 32 bytes (256 bits)

// const randomBytes = crypto.randomBytes(32);
// const secret = randomBytes.toString('hex');
// console.log('Generated secret:', secret);


router.get('/register', (req, res) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('register', { title: 'Register', error: message});
});

router.post('/register', 
    [
        check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .normalizeEmail(),
        body('password', 'Password must be at least 6 characters long and alphanumeric')
        .isLength({ min: 6 })
        .isAlphanumeric()
        .trim(),
        body('confirmPassword')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
    ],
    (req, res) => {
        const inputEmail = req.body.email;
        const inputPassword = req.body.password;
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) { 
            // console.log(errors.array());  
            return res.status(422).render('register', { title: 'Register', error: errors.array()[0].msg});
        }

        connection.query("SELECT * FROM users WHERE email = ?", inputEmail, (err, result) => {
            if (err) {
                res.render('500');
                console.log(err);
            }
            if (result.length > 0) {
                req.flash('error', 'User already exists');
                res.redirect('/register');
            } else {
                bcrypt.hash(inputPassword, 10, (err, hash) => {
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
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('login', { title: 'Login', error: message});
});

router.post('/login', 
    [
        check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .normalizeEmail(),
        body('password')
        .trim()
    ],
    (req, res) => {
        const email = req.body.email;
        const password = req.body.password;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render('login', { title: 'Login', error: errors.array()[0].msg});
        }

        connection.query("SELECT * FROM users WHERE email = ?", email, async (err, result) => {
            if (err) {
                res.render('500');
                console.log(err);
            }
            if (result.length > 0) {
                const comparison = await bcrypt.compare(password, result[0].password);
                if (comparison) {
                    const userID = result[0].id;
                    jwt.sign({ userID }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY || '7d'}, (err, token) => {
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
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('forgot-password', { title: 'Forgot Password' , error: message});
});

router.post('/forgot-password',
    [
        check('email')
        .isEmail()
        .withMessage('Please enter a valid email.')
        .normalizeEmail()
    ],
    (req, res) => {
        const email = req.body.email;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).render('forgot-password', { title: 'Forgot Password', error: errors.array()[0].msg});
        }

        connection.query("SELECT * FROM users WHERE email = ?", email, (err, result) => {
            if (err) {
                res.render('500');
                console.log(err);
            }
            if (result.length > 0) {
                const userID = result[0].id;
                jwt.sign({ userID: userID }, process.env.JWT_RESET_PASSWORD, { expiresIn: process.env.EXPIRY_RESET_PASSWORD || '15m'}, (err, token) => {
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
    res.render('reset-password', { title: 'Reset Password', error: null, token: token });
});

router.post('/reset-password',
    [
        body('password', 'Password must be at least 6 characters long and alphanumeric')
        .isLength({ min: 6 })
        .isAlphanumeric()
        .trim(),
        body('confirmPassword')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
    ],
    (req, res) => {
        const token = req.body.token;
        const password = req.body.password;
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // let message = null;
            // if(errors.array().length > 0) {
            //     message = errors.array()[0].msg;
            // }
            return res.status(422).render('reset-password', { title: 'Reset Password', error: errors.array()[0].msg , token: token });
        }

        jwt.verify(token, process.env.JWT_RESET_PASSWORD, (err, decoded) => {
            if (err) {
                // console.log(err);
                res.render('404');
                return;
            }
            const userID = decoded.userID;
            bcrypt.hash(password, 10, (err, hash) => {
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