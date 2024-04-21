const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');  
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
require('dotenv').config();


const todoRoutes = require('./routes/todo');
const authRoutes = require('./routes/auth');


const PORT = process.env.PORT || 3000; // process.env.port is required for render to work.
const app = express();


// View engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // cookie: { maxAge: 60000 }
}));
app.use(flash());


app.use('/todos', todoRoutes);
app.use(authRoutes);


app.get('/home', (req, res) => {
    res.render('home', { title: 'Home' });
});

app.get('/', (req, res) => {
    res.render('home', { title: 'Home' });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});