// Dependencies
const router = require('./app/controllers/todo_controller');
const express = require('express');
const path = require('path');

// Express setup
const PORT = process.env.PORT || 3000;
const app = express();

// View engine
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'pug');

// Public assets
app.use(express.static(path.join(__dirname, '/app/public')));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(router);

// Redirect to home on bad route.
app.get('*', (req, res) => res.redirect('/'));

// Listen
app.listen(PORT, () => {
    console.log(`--> Server running on http://localhost:${PORT}/`);
});