const express = require('express');
const router = express.Router();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

// Get all departments
router.get('/departments', (req, res) => {
    const sql = `SELECT * FROM department`;
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

// Get a single departments
router.get('/departments/:id', (req, res) => {
    const sql = `SELECT * FROM department WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, rows) => {
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

// Delete a department
router.delete('/departments/:id', (req, res) => {
    const sql = `DELETE FROM department WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
    if (err) {
        res.statusMessage(400).json({error: res.message});
    } else if (!result.affectedRows) {
        res.json({
            message: 'Department not found'
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

// Create a department
router.post('/departments', ({body}, res) => {
    const errors =inputCheck(body, 'name');
    if (errors) {
        res.status(400).json({error: errors});
        return;
    };

    const sql = `INSERT INTO department (name) VALUES (?)`;
    const params = [body.name];

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