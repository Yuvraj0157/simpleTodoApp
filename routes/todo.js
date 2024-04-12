const express = require('express');
const path = require('path');
const router = express.Router();
const connection = require('../utils/connection');

const fetchStaus = (id) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT status FROM todos WHERE id = ?', [id], (error, results) => {
            if (error) {
                console.log(error);
            }
            resolve(results[0].status);
        });
    });
}

router.get('/', (req, res) => {
    connection.query('SELECT * FROM todos', (error, results) => {
        if (error) {
            console.log(error);
        }
        // console.log(results);
        res.render('index', { todos: results });
        // res.json(results);
    });
});

router.post('/', (req, res) => {
    const task = req.body.task;
    // const status = 0;
    connection.query('INSERT INTO todos (task) VALUES (?)', [task], (error, results) => {
        if (error) {
            console.log(error);
        }
        // console.log(results);
        res.redirect('/');
    });
});

router.post('/:id/delete', (req, res) => {
    const id = parseInt(req.params.id);
    connection.query('DELETE FROM todos WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.log(error);
        }
        res.redirect('/');
    });
}); 

router.post('/:id/update', async (req, res) => {
    const id = parseInt(req.params.id);
    let currentStatus = await fetchStaus(id);
    connection.query('UPDATE todos SET status = ? WHERE id = ?', [!currentStatus, id], (error, results) => {
        if (error) {
            console.log(error);
        }
        res.redirect('/');
    });
});

module.exports = router;
