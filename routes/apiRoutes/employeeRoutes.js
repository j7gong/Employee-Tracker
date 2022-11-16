const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// Get all employees
router.get('/employees', (req, res) => {
    const sql = `select e.id, e.first_name, e.last_name, r.title, d.name department_name, r.salary, CONCAT(m.first_name, ', ', m.last_name) manager
    from employee e
    left join role r on e.role_id = r.id
    left join employee m on e.manager_id = m.id
    left join department d on r.department_id = d.id;`;
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

// Delete an employee
router.delete('/employees/:id', (req, res) => {
    const sql = `DELETE FROM employee WHERE id = ?`;
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

// Create an employee
router.post('/employees', ({body}, res) => {
    const errors =inputCheck(body, 'first_name', 'last_name', 'role_id', 'manager_id');
    if (errors) {
        res.status(400).json({error: errors});
        return;
    };

    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
    VALUES (?, ?, ?, ?)`;
    const params = [body.first_name, body.last_name, body.role_id, body.manager_id];

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

// Update an employee
router.put('/employees/:id', (req, res) => {
    const errors = inputCheck(req.body, 'role_id');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `UPDATE employee SET role_id = ? where id =?`;
    const params = [req.body.role_id, req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
          res.status(400).json({ error: err.message });
          // check if a record was found
        } else if (!result.affectedRows) {
          res.json({
            message: 'Employee not found'
          });
        } else {
          res.json({
            message: 'success',
            data: req.body,
            changes: result.affectedRows
          });
        }
      });
});

module.exports = router;