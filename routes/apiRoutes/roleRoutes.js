const express = require('express');
const router = express.Router();
const db = require('../../db/connection');

// Get all roles
router.get('/roles', (req, res) => {
    const sql = `SELECT role.title, role.id, d.name department_name, role.salary FROM role left join department d ON role.department_id = d.id`;
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({error: err.message});
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

// Delete a role
router.delete('/roles/:id', (req, res) => {
    const sql = `DELETE FROM role WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
    if (err) {
        res.statusMessage(400).json({error: res.message});
    } else if (!result.affectedRows) {
        res.json({
            message: 'Role not found'
        });
    } else {
        res.json({
            message: 'deleted', 
            changes: result.affectedRows,
            id: req.params.id
        });
    };
    console.log(result);
  });
});

// Create a role
router.post('/roles', ({body}, res) => {
    const errors =inputCheck(body, 'title', 'salary', 'department_id');
    if (errors) {
        res.status(400).json({error: errors});
        return;
    };

    const sql = `INSERT INTO role (title, salary, department_id)
    VALUES (?, ?, ?)`;
    const params = [body.title, body.salary, body.department_id];

    db.query(sql, params, (err, result) => {
        if (err) {
          res.status(400).json({ error: err.message });
          return;
        }
        res.json({
          message: 'success',
          data: body
        });
      });
});

module.exports = router;