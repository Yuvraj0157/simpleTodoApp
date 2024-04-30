const express = require('express');
const path = require('path');
const router = express.Router();
// const connection = require('../utils/connection')
const {op} = require('sequelize');
const sequelize = require('../utils/connection');
const Todo = require('../models/todo');
const verifyToken = require('../middleware/authMiddleware');
const { stat } = require('fs');


router.get('/', verifyToken, (req, res) => {
    const userID = req.userID;
    // connection.query("SELECT *,(SELECT COUNT(*) FROM todos WHERE status = 0) AS uncomplete FROM todos where userID = ? order by due",[userID], (error, results) => {
    //     if (error) {
    //         res.render('500');
    //         console.log(error);
    //     }
    //     results = results.map((result) => {
    //         result.due = result.due ? result.due.toLocaleString().split(',')[0] : null;   
    //         return result;
    //     });
    //     // console.log(results);
    //     res.render('todo', { todos: results});
    // });
    Todo.findAll({
        attributes: {
            include: [
                [sequelize.literal(`(SELECT COUNT(*) FROM todos WHERE status = 0)`), 'uncomplete']
            ]
        },
        where: {
            userID: userID
        },
        order: [
            ['due', 'ASC']
        ]
    })
    .then((results) => {
        results = results.map((result) => {
            result.due = result.due ? result.due.toLocaleString().split(',')[0] : null;   
            return result;
        });
        // console.log(results[0].uncomplete, results[0].dataValues.uncomplete);
        res.render('todo', { todos: results });
    })
    .catch((error) => {
        console.log(error);
        res.status(500).render('500');
    });
});

router.post('/', verifyToken, (req, res) => {
    const task = req.body.task.trim();
    const due = req.body.due;
    const userID = req.userID;
    // connection.query('INSERT INTO todos (task, due, userID) VALUES (?,?,?)', [task, due ? due : null, userID], (error, results) => {
    //     if (error) {
    //         res.render('500');
    //         console.log(error);
    //     }
    //     // console.log(results);
    //     res.redirect("/todos");
    // });
    Todo.create({
        task: task,
        due: due ? due : null,
        userID: userID
    })
    .then((result) => {
        res.redirect("/todos");
    })
    .catch((error) => {
        console.log(error);
        res.status(500).render('500');
    });
});

router.post('/delete/:id', verifyToken, (req, res) => {
    const id = req.params.id;
    const userID = req.userID;
    // connection.query('DELETE FROM todos WHERE userID = ? and id = ?', [userID, id], (error, results) => {
    //     if (error) {
    //         res.render('500');
    //         console.log(error);
    //     }
    //     res.redirect("/todos");
    // });
    Todo.destroy({
        where: {
            userID: userID,
            id: id
        }
    })
    .then((result) => {
        res.redirect("/todos");
    })
    .catch((error) => {
        console.log(error);
        res.status(500).render('500');
    });
}); 

router.post('/update/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    const userID = req.userID;

    Todo.findOne({
        where: {
            userID: userID,
            id: id
        }
    })
    .then((todo) => {
        todo.status = !todo.status;
        return todo.save();
    })
    .then((result) => {
        res.redirect("/todos");
    })
    .catch((error) => {
        console.log(error);
        res.status(500).render('500');
    });
});

module.exports = router;
