const cTable = require('console.table');
const mysql = require('mysql2'); 
const inquirer = require('inquirer');

//Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employee'
    },
);

// add db.connect function to run startingPoint();

function startingPoint() {
    inquirer.prompt({
        type: "list",
        name: "choice",
        message: "what do you want to do?",
        choices: [
        "view all departments",
         "view all roles",
         "view all employees",
         "add a department", 
         "add a role", 
         "add an employee", 
         "update an employee role"]
    }).then(function (answers) {
        console.log(answers);
      });
}

// queries??




