const inquirer = require('inquirer');

const promptUser = dataOption => {

    if (!dataOption.option) {
        dataOption.option = [];
    }
    return inquirer.prompt([
        {
            type: 'list',
            name: 'type',
            message: 'What would you like to do?',
            choices: ['View all departments', 'View all roles', 'View all employees',
        'Add a department', 'Add a role', 'Add an employee', 'Update an employee']
        }
    ])
}

promptUser([])
    .then(res => {
        console.log(res);
    });