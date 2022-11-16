const express = require('express');
const inputCheck = require('./utils/inputCheck');

const PORT = process.env.PORT || 3001;
const app = express();
const mysql = require('mysql2');

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to MySQL database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'password',
      database: 'employeetracker'
    },
    console.log('Connected to the employeetracker database.')
  );

// Get all departments
app.get('/api/departments', (req, res) => {
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

// Get all roles
app.get('/api/roles', (req, res) => {
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

// Get a single departments
app.get('/api/departments/:id', (req, res) => {
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
app.delete('/api/departments/:id', (req, res) => {
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

// Delete a role
app.delete('/api/roles/:id', (req, res) => {
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

// Create a department
app.post('/api/departments', ({body}, res) => {
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

// Create a role
app.post('/api/roles', ({body}, res) => {
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

app.get('/', (req, res) => {
    res.json({
      message: 'Hello World'
    });
  });

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });