const express = require('express');
const path = require('path');
const router = express.Router();
const connection = require('../utils/connection');
const verifyToken = require('../middleware/authMiddleware');

const fetchStaus = (userID, id) => {
    return new Promise((resolve, reject) => {
        connection.query('SELECT status FROM todos WHERE userID = ? and id = ?', [userID, id], (error, results) => {
            if (error) {
                console.log(error);
            }
            resolve(results[0].status);
        });
    });
}

router.get('/', verifyToken, (req, res) => {
    const userID = req.userID;
    connection.query("SELECT *,(SELECT COUNT(*) FROM todos WHERE status = 0) AS uncomplete FROM todos where userID = ? order by due",[userID], (error, results) => {
        if (error) {
            res.render('500');
            console.log(error);
        }
        results = results.map((result) => {
            result.due = result.due ? result.due.toLocaleString().split(',')[0] : null;   
            return result;
        });
        // console.log(results);
        res.render('todo', { todos: results});
    });
});

router.post('/', verifyToken, (req, res) => {
    const task = req.body.task.trim();
    const due = req.body.due;
    const userID = req.userID;
    connection.query('INSERT INTO todos (task, due, userID) VALUES (?,?,?)', [task, due ? due : null, userID], (error, results) => {
        if (error) {
            res.render('500');
            console.log(error);
        }
        // console.log(results);
        res.redirect("/todos");
    });
});

router.post('/delete/:id', verifyToken, (req, res) => {
    const id = req.params.id;
    const userID = req.userID;
    connection.query('DELETE FROM todos WHERE userID = ? and id = ?', [userID, id], (error, results) => {
        if (error) {
            res.render('500');
            console.log(error);
        }
        res.redirect("/todos");
    });
}); 

router.post('/update/:id', verifyToken, async (req, res) => {
    const id = req.params.id;
    const userID = req.userID;
    let currentStatus = await fetchStaus(userID, id);
    connection.query('UPDATE todos SET status = ? WHERE userID = ? and id = ?', [!currentStatus, userID, id], (error, results) => {
        if (error) {
            res.render('500');
            console.log(error);
        }
        res.redirect("/todos");
    });
});

module.exports = router;
