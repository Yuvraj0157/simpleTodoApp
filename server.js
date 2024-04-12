const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const todoRoutes = require('./routes/todo');


const PORT = 3000;
const app = express();


// View engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));


app.use(bodyParser.urlencoded({ extended: true }));


app.use('/todos', todoRoutes);


app.get('*', (req, res) => res.redirect('/todos'));


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});