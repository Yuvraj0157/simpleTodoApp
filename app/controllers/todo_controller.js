//============================
// DEPENDENCIES
//============================
const Todo = require('../models/todo');
const express = require('express');
const router = express.Router();

//============================
// ROUTES
//============================
/**
 * VIEW: home
 */
router.get('/', (req, res) => {
    Todo.getAll((err, data) => {
        if (err) throw err;

        const completedTodos = data.filter(todo => todo.done);
        const incompleteTodos = data.filter(todo => !todo.done);

        res.render('index', {
            completedTodos,
            incompleteTodos
        });
    });
});

/**
 * API: all todos
 */
router.get('/todos', (req, res) => {
    Todo.getAll((err, data) => {
        if (err) throw err;
        res.json(data);
    });
});

/**
 * API: add todo
 */
router.post('/todos', (req, res) => {
    // If todo name is empty send an error back.
    if (req.body.task.trim() === '') {
        res.statusMessage = 'Todo name is required.';
        return res.status(400).end();
    }

    Todo.add(req.body, (err, data) => {
        if (err) {
            res.sendStatus(500);
        } else {
            res.json(data);
        }
    });
});

/**
 * API: update todo
 */
router.put('/todos', (req, res) => {
    Todo.update(req.body, (err, data) => {
        if (err) throw err;
        res.json(data);
    });
});

/**
 * API: delete todo
 */
router.delete('/todos', (req, res) => {
    Todo.delete(req.body.id, (err, data) => {
        if (err) throw err;
        res.json(data);
    });
});

module.exports = router;