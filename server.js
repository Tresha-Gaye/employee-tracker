const cTable = require('console.table');
const inquirer = require('inquirer');
const db = require('./db/connection');

// Start server after db connection
// db.connect function runs startingPoint();

db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    startingPoint();
});

function startingPoint() {
    inquirer.prompt({
        type: "list",
        name: "choices",
        message: "what do you want to do?",
        choices: [
            { name: "View all departments", value: "dept_list" },
            { name: "View all roles", value: "role_list" },
            { name: "View all employees", value: "employee_list" },
            { name: "Add a department", value: "add_dept" },
            { name: "Add a role", value: "add_role" },
            { name: "Add an employee", value: "add_employee" },
            { name: "Update an employee role", value: "update_emp_role" },
            { name: "Update employee managers", value: "eupdate_emp_mgr" },
            { name: "View employees by manager", value: "view_by_mgr" },
            { name: "View employees by department", value: "view_by_dept" },
            { name: "Delete a department", value: "delete_dept" },
            { name: "Delete a role", value: "delete_role" },
            { name: "Delete an employee", value: "delete_employee" },
            { name: "View combined salaries of all employees in a department", value: "view_salaries" },
            { name: "Exit" }
        ]
    }).then((answers) => {
        const {choices} = answers;
                console.log(answers);

            if (choices === "dept_list") {
                viewDepts()
            }

            if (choices === "role_list") {
                viewRoles()
            }
      });
}


// function to view departments
const viewDepts = () => {
    const sql = `SELECT department.id AS id, department.name AS department FROM department`;
    db.query(sql, (err, res) => {
        if(err) throw err; 
        console.table(res);
        startingPoint();
    });
};

// function to view all roles
const viewRoles = () => {
    const sql =   `SELECT role.id, role.title, role.salary
                  FROM role
                  UNION SELECT department.name AS department
                  FROM department`;
    db.query(sql, (err, res) => {
        if(err) throw err; 
        console.table(res);
        startingPoint();
    });
};

// function i


// const show_depts = [
//     {
//         type: "iput",
//         name: "show_dept",
//         message: "these are the list of departments"
//     }
// ]
// // queries??
// if(show_depts) {
    
//     })
    // .then(startingPoint() )
    


// if statements // while loop
// last questions = exit program? while 'exist_program' = fase un program again
// onc enquiruer starts asking it will not wait, if asking questions & expecting something to happen
// beak up inquirier qiestions into smaller chunks, call different functions
// once code exeuction finishes it will return bac to original while loo
// lots of .thens
// different trees/baths depending on how user responds
// then once all completed, user will bereturned to original while loop (start of function)
// console.log
//console.table
//console.err
//



// try this for update functions
    // function ({ first_name, last_name, manager }) {
    // connection.query("INSERT INTO employee (first_name, last_name, manager) 
    //      VALUES ?", ('first_name', 'last_name', 'manager'), function (err, result) {
    //     if (err) throw err;

    //try thi =s for managers

    // const getManagers = () => {
    //     return new Promise((resolve, reject) => {
    //         connection.query(`SELECT CONCAT(b.first_name, " ", b.last_name) AS Name 
    //         FROM employee a LEFT JOIN employee b
    //         ON a.manager_id = b.id
    //         WHERE a.manager_id IS NOT NULL;`, (err, res) => {
    //             if (err) reject(err);
    //             resolve(res);
    //         });
    //     });
    // }

    // const viewEmployeesByManager = async () => {
    //     let choices = await employeeDB_CRUD.getManagers();
    //     console.log(choices);
    //     return new Promise( (resolve, reject) => {
    //         inquirer.prompt([
    //             {
    //                 name: "manager",
    //                 type: "list",
    //                 message: "Please select a department: ",
    //                 choices: choices
    //             }
    //         ]).then( ({ manager }) => {
    //             console.log(manager);
    //             resolve();
    //         });
    //     });
    // }