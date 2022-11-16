INSERT INTO department (name)
VALUES 
    ('Sales'), 
    ('Engineering'), 
    ('Finance'), 
    ('Legal');

INSERT INTO role (title, salary, department_id)
VALUES 
    ('Sales Lead', 10000, 3), 
    ('Salesperson', 8000, 3), 
    ('Legal Team Lead', 25000, 4), 
    ('Software Engineer', 15000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('Jane', 'Jan', 1, 1), 
    ('James', 'Feb', 2, 1), 
    ('Matt', 'Mar', 3, 1), 
    ('Janny', 'May', 3, 2),
    ('Jimmy', 'Jun', 4, 2);